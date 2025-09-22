const jwt = require('jsonwebtoken');
const NotificationService = require('../services/NotificationService');

class SocketHandler {
  constructor() {
    this.io = null;
    this.authenticatedUsers = new Map(); // socketId -> userId
  }

  initialize(server) {
    const { Server } = require('socket.io');
    
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    // Set Socket.IO instance in NotificationService
    NotificationService.setSocketIO(this.io);

    this.setupEventHandlers();
    console.log('🚀 WebSocket server initialized');
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔗 New socket connection: ${socket.id}`);

      // Handle authentication
      socket.on('authenticate', async (token) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decoded.userId;
          
          // Store authenticated user
          this.authenticatedUsers.set(socket.id, userId);
          socket.userId = userId;
          
          // Register with notification service
          NotificationService.registerConnection(userId, socket);
          
          // Join user-specific room
          socket.join(`user_${userId}`);
          
          // Send authentication success
          socket.emit('authenticated', { 
            success: true, 
            userId,
            message: 'Successfully connected to real-time notifications' 
          });
          
          console.log(`✅ User ${userId} authenticated and connected`);
          
        } catch (error) {
          console.error('❌ Socket authentication failed:', error);
          socket.emit('authentication_error', { 
            success: false, 
            message: 'Invalid token' 
          });
          socket.disconnect();
        }
      });

      // Handle collector location updates
      socket.on('update_location', async (locationData) => {
        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        try {
          const { latitude, longitude, accuracy } = locationData;
          
          // Update collector location in database
          // This would typically update the User model
          console.log(`📍 Location update from user ${socket.userId}:`, {
            latitude, longitude, accuracy
          });
          
          // Broadcast to relevant users (e.g., customers waiting for this collector)
          socket.broadcast.emit('collector_location_update', {
            collectorId: socket.userId,
            location: { latitude, longitude },
            timestamp: new Date().toISOString()
          });
          
        } catch (error) {
          console.error('❌ Error updating location:', error);
          socket.emit('error', { message: 'Failed to update location' });
        }
      });

      // Handle mission status updates
      socket.on('mission_status_update', async (statusData) => {
        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        try {
          const { missionId, status, data } = statusData;
          
          console.log(`🔄 Mission status update:`, { missionId, status, userId: socket.userId });
          
          // Broadcast to customer
          if (data.customerId) {
            this.io.to(`user_${data.customerId}`).emit('mission_status_changed', {
              missionId,
              status,
              collectorId: socket.userId,
              timestamp: new Date().toISOString(),
              ...data
            });
          }
          
        } catch (error) {
          console.error('❌ Error updating mission status:', error);
          socket.emit('error', { message: 'Failed to update mission status' });
        }
      });

      // Handle typing indicators for chat
      socket.on('typing_start', (data) => {
        if (socket.userId && data.conversationId) {
          socket.broadcast.to(`conversation_${data.conversationId}`).emit('user_typing', {
            userId: socket.userId,
            conversationId: data.conversationId
          });
        }
      });

      socket.on('typing_stop', (data) => {
        if (socket.userId && data.conversationId) {
          socket.broadcast.to(`conversation_${data.conversationId}`).emit('user_stopped_typing', {
            userId: socket.userId,
            conversationId: data.conversationId
          });
        }
      });

      // Handle chat messages
      socket.on('send_message', async (messageData) => {
        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        try {
          const { conversationId, message, recipientId } = messageData;
          
          const chatMessage = {
            id: `msg_${Date.now()}`,
            senderId: socket.userId,
            conversationId,
            message,
            timestamp: new Date().toISOString()
          };
          
          // Send to recipient
          this.io.to(`user_${recipientId}`).emit('new_message', chatMessage);
          
          // Send confirmation to sender
          socket.emit('message_sent', { messageId: chatMessage.id });
          
          console.log(`💬 Message sent from ${socket.userId} to ${recipientId}`);
          
        } catch (error) {
          console.error('❌ Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle notification acknowledgment
      socket.on('notification_received', (notificationId) => {
        console.log(`📨 Notification ${notificationId} received by user ${socket.userId}`);
      });

      // Handle notification read status
      socket.on('mark_notifications_read', async (notificationIds) => {
        if (socket.userId) {
          await NotificationService.markAsRead(socket.userId, notificationIds);
          socket.emit('notifications_marked_read', { count: notificationIds.length });
        }
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        console.log(`🔌 Socket ${socket.id} disconnected: ${reason}`);
        
        if (socket.userId) {
          // Clean up authenticated users map
          this.authenticatedUsers.delete(socket.id);
          
          // Notify others that user went offline
          socket.broadcast.emit('user_offline', {
            userId: socket.userId,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error(`❌ Socket error from ${socket.id}:`, error);
      });
    });
  }

  // Send notification to specific user
  async sendToUser(userId, event, data) {
    if (this.io) {
      this.io.to(`user_${userId}`).emit(event, {
        timestamp: new Date().toISOString(),
        ...data
      });
      return true;
    }
    return false;
  }

  // Broadcast to all connected users
  async broadcast(event, data) {
    if (this.io) {
      this.io.emit(event, {
        timestamp: new Date().toISOString(),
        ...data
      });
      return true;
    }
    return false;
  }

  // Send to users in specific area (for location-based notifications)
  async sendToArea(coordinates, radius, event, data) {
    if (this.io) {
      // In production, you'd filter connected users by location
      this.io.emit(event, {
        area: { coordinates, radius },
        timestamp: new Date().toISOString(),
        ...data
      });
      return true;
    }
    return false;
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.authenticatedUsers.size;
  }

  // Get connected users list
  getConnectedUsers() {
    return Array.from(this.authenticatedUsers.values());
  }
}

module.exports = new SocketHandler();
