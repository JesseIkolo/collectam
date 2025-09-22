class NotificationService {
  constructor() {
    // Select transports via env, default to mock
    this.smsTransport = (process.env.NOTIFY_TRANSPORT_SMS || 'mock').toLowerCase();
    this.emailTransport = (process.env.NOTIFY_TRANSPORT_EMAIL || 'mock').toLowerCase();
    this.pushTransport = (process.env.NOTIFY_TRANSPORT_PUSH || 'mock').toLowerCase();
    
    // WebSocket connections storage
    this.connections = new Map(); // userId -> socket
    this.io = null; // Will be set by server

    // Mock transport implementation
    this.mock = {
      async sendSms(to, message) {
        const id = `mock-sms-${Date.now()}`;
        if (process.env.NODE_ENV !== 'test') {
          console.log(`[MockSMS] to=${to} id=${id} msg=${message}`);
        }
        return { success: true, messageId: id };
      },
      async sendEmail(to, subject, html, text) {
        const id = `mock-email-${Date.now()}`;
        if (process.env.NODE_ENV !== 'test') {
          console.log(`[MockEmail] to=${to} id=${id} subject=${subject}`);
        }
        return { success: true, messageId: id };
      },
      async sendPush(token, title, body, data) {
        const id = `mock-push-${Date.now()}`;
        if (process.env.NODE_ENV !== 'test') {
          console.log(`[MockPush] token=${token} id=${id} title=${title}`);
        }
        return { success: true, messageId: id };
      }
    };
  }

  // Send SMS notification via selected transport (mock by default)
  async sendSMS(to, message) {
    if (this.smsTransport === 'mock') {
      return this.mock.sendSms(to, message);
    }
    // Other providers can be added here later (e.g., twilio) guarded by env
    return this.mock.sendSms(to, message);
  }

  // Send WhatsApp notification (mocked)
  async sendWhatsApp(to, message) {
    // Keep same interface; route through SMS mock for now
    return this.mock.sendSms(`whatsapp:${to}`, message);
  }

  // Send email notification via selected transport (mock by default)
  async sendEmail(to, subject, html, text) {
    if (this.emailTransport === 'mock') {
      return this.mock.sendEmail(to, subject, html, text);
    }
    // Other providers can be added here later (e.g., nodemailer/sendgrid)
    return this.mock.sendEmail(to, subject, html, text);
  }

  // Send OTP via SMS
  async sendOTP(phone, otp) {
    const message = `Your Collectam verification code is: ${otp}. Valid for 10 minutes.`;
    return await this.sendSMS(phone, message);
  }

  // Send collection notification
  async sendCollectionNotification(user, collection, type) {
    const messages = {
      assigned: `Your waste collection has been assigned! Collector will arrive at ${collection.scheduledTime}`,
      completed: `Your waste collection has been completed successfully! You earned ${collection.points || 10} points.`,
      cancelled: `Your waste collection has been cancelled. Please reschedule or contact support.`
    };

    const message = messages[type];
    if (!message) return { success: false, error: 'Invalid notification type' };

    const results = [];

    // Send SMS if enabled
    if (user.preferences?.notifications?.sms) {
      results.push(await this.sendSMS(user.phone, message));
    }

    // Send email if enabled
    if (user.preferences?.notifications?.email) {
      results.push(await this.sendEmail(
        user.email,
        `Nacollect - Collection ${type}`,
        `<p>${message}</p>`,
        message
      ));
    }

    return results;
  }

  // Send mission notification to collector
  async sendMissionNotification(collector, mission, type) {
    const messages = {
      assigned: `New mission assigned! Collection ID: ${mission.collectionId}`,
      reminder: `Reminder: You have a pending collection mission`,
      completed: `Mission completed successfully! Payment will be processed.`
    };

    const message = messages[type];
    if (!message) return { success: false, error: 'Invalid notification type' };

    return await this.sendSMS(collector.phone, message);
  }

  // Multicast notification to multiple users
  async multicast(users, message, channels = ['sms', 'email']) {
    const results = [];

    for (const user of users) {
      if (channels.includes('sms') && user.preferences?.notifications?.sms) {
        results.push(await this.sendSMS(user.phone, message));
      }

      if (channels.includes('email') && user.preferences?.notifications?.email) {
        results.push(await this.sendEmail(
          user.email,
          'Collectam Notification',
          `<p>${message}</p>`,
          message
        ));
      }
    }

    return results;
  }

  // ==================== REAL-TIME NOTIFICATIONS ====================

  // Set Socket.IO instance
  setSocketIO(io) {
    this.io = io;
    console.log('🔔 NotificationService: WebSocket initialized');
  }

  // Register user connection
  registerConnection(userId, socket) {
    this.connections.set(userId, socket);
    console.log(`🔗 User ${userId} connected for notifications`);
    
    // Handle disconnection
    socket.on('disconnect', () => {
      this.connections.delete(userId);
      console.log(`🔌 User ${userId} disconnected from notifications`);
    });
  }

  // Send real-time notification
  async sendRealTimeNotification(userId, notification) {
    try {
      // Send via WebSocket if user is connected
      const socket = this.connections.get(userId);
      if (socket) {
        socket.emit('notification', {
          id: `notif-${Date.now()}`,
          timestamp: new Date().toISOString(),
          ...notification
        });
        console.log(`📱 Real-time notification sent to user ${userId}`);
        return { success: true, channel: 'websocket' };
      }

      // Fallback to push notification if available
      console.log(`📤 User ${userId} not connected, using fallback notifications`);
      return { success: false, reason: 'user_offline' };
    } catch (error) {
      console.error('❌ Error sending real-time notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send notification to all collectors in area
  async notifyCollectorsInArea(coordinates, radius, notification) {
    if (!this.io) return { success: false, error: 'WebSocket not initialized' };

    // Broadcast to all connected collectors
    // In production, you'd filter by location
    this.io.emit('area_notification', {
      area: { coordinates, radius },
      notification: {
        id: `area-notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...notification
      }
    });

    console.log(`📡 Area notification broadcasted (radius: ${radius}m)`);
    return { success: true, channel: 'broadcast' };
  }

  // Enhanced collection notification with real-time
  async sendEnhancedCollectionNotification(user, collection, type) {
    const notifications = {
      assigned: {
        title: 'Nouvelle collecte assignée !',
        body: `Collecte programmée pour ${collection.scheduledTime}`,
        type: 'collection_assigned',
        data: { collectionId: collection._id, status: 'assigned' },
        priority: 'high',
        sound: 'notification.wav'
      },
      started: {
        title: 'Collecte en cours',
        body: 'Le collecteur est en route vers votre domicile',
        type: 'collection_started',
        data: { collectionId: collection._id, status: 'in_progress' },
        priority: 'normal'
      },
      completed: {
        title: 'Collecte terminée !',
        body: `Collecte terminée avec succès. Points gagnés: ${collection.points || 10}`,
        type: 'collection_completed',
        data: { collectionId: collection._id, status: 'completed', points: collection.points },
        priority: 'normal',
        actions: [{ title: 'Noter le collecteur', action: 'rate_collector' }]
      }
    };

    const notification = notifications[type];
    if (!notification) return { success: false, error: 'Invalid notification type' };

    const results = [];

    // 1. Send real-time notification
    const realtimeResult = await this.sendRealTimeNotification(user._id, notification);
    results.push(realtimeResult);

    // 2. Send traditional notifications as backup
    if (user.preferences?.notifications?.sms) {
      results.push(await this.sendSMS(user.phone, notification.body));
    }

    if (user.preferences?.notifications?.email) {
      results.push(await this.sendEmail(
        user.email,
        notification.title,
        `<h3>${notification.title}</h3><p>${notification.body}</p>`,
        notification.body
      ));
    }

    return results;
  }

  // Enhanced mission notification for collectors
  async sendEnhancedMissionNotification(collector, mission, type) {
    const notifications = {
      new_request: {
        title: 'Nouvelle demande de collecte !',
        body: `Demande à ${mission.distance}m de vous - ${mission.wasteType}`,
        type: 'new_mission',
        data: { 
          missionId: mission._id, 
          distance: mission.distance,
          wasteType: mission.wasteType,
          urgency: mission.urgency 
        },
        priority: 'high',
        sound: 'mission_alert.wav',
        actions: [
          { title: 'Accepter', action: 'accept_mission' },
          { title: 'Voir détails', action: 'view_mission' }
        ]
      },
      reminder: {
        title: 'Rappel de mission',
        body: 'Vous avez une collecte en attente',
        type: 'mission_reminder',
        data: { missionId: mission._id },
        priority: 'normal'
      },
      completed: {
        title: 'Mission terminée !',
        body: 'Paiement en cours de traitement',
        type: 'mission_completed',
        data: { missionId: mission._id, payment: mission.payment },
        priority: 'normal'
      }
    };

    const notification = notifications[type];
    if (!notification) return { success: false, error: 'Invalid notification type' };

    // Send real-time notification to collector
    return await this.sendRealTimeNotification(collector._id, notification);
  }

  // Get notification history for user
  async getNotificationHistory(userId, limit = 50) {
    // In production, this would query a notifications database
    // For now, return mock data structure
    return {
      notifications: [],
      unreadCount: 0,
      lastRead: new Date().toISOString()
    };
  }

  // Mark notifications as read
  async markAsRead(userId, notificationIds) {
    // In production, update database
    console.log(`📖 Marked ${notificationIds.length} notifications as read for user ${userId}`);
    return { success: true };
  }
}

module.exports = new NotificationService();
