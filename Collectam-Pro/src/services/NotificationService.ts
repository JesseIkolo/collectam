"use client";

import { io, Socket } from 'socket.io-client';
import { AuthService } from './AuthService';

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'collection_assigned' | 'collection_started' | 'collection_completed' | 'new_mission' | 'mission_reminder' | 'system';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  timestamp: string;
  read: boolean;
  data?: any;
  actions?: Array<{
    title: string;
    action: string;
  }>;
  sound?: string;
}

export interface NotificationPreferences {
  realTime: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
  sms: boolean;
  collections: boolean;
  missions: boolean;
  system: boolean;
}

class NotificationService {
  private socket: Socket | null = null;
  private isConnected = false;
  private notifications: Notification[] = [];
  private listeners: Map<string, Function[]> = new Map();
  private preferences: NotificationPreferences = {
    realTime: true,
    sound: true,
    desktop: true,
    email: true,
    sms: true,
    collections: true,
    missions: true,
    system: true
  };

  constructor() {
    // Load preferences from localStorage
    this.loadPreferences();
    
    // Request notification permission
    this.requestNotificationPermission();
  }

  // Initialize WebSocket connection
  async connect(): Promise<boolean> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        console.warn('⚠️ No auth token available for notifications');
        return false;
      }

      const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      this.socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        auth: { token }
      });

      return new Promise((resolve) => {
        if (!this.socket) {
          resolve(false);
          return;
        }

        this.socket.on('connect', () => {
          console.log('🔗 Connected to notification server');
          this.isConnected = true;
          
          // Authenticate with server
          this.socket?.emit('authenticate', token);
        });

        this.socket.on('authenticated', (data) => {
          console.log('✅ Notification authentication successful:', data);
          this.setupEventListeners();
          resolve(true);
        });

        this.socket.on('authentication_error', (error) => {
          console.error('❌ Notification authentication failed:', error);
          this.isConnected = false;
          resolve(false);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('🔌 Disconnected from notification server:', reason);
          this.isConnected = false;
          this.emit('connection_lost', { reason });
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Connection error:', error);
          this.isConnected = false;
          resolve(false);
        });
      });
    } catch (error) {
      console.error('❌ Failed to connect to notification server:', error);
      return false;
    }
  }

  // Setup event listeners
  private setupEventListeners() {
    if (!this.socket) return;

    // Handle incoming notifications
    this.socket.on('notification', (notification: Notification) => {
      console.log('📱 Received notification:', notification);
      this.handleIncomingNotification(notification);
    });

    // Handle mission status updates
    this.socket.on('mission_status_changed', (data) => {
      console.log('🔄 Mission status changed:', data);
      this.emit('mission_status_changed', data);
    });

    // Handle collector location updates
    this.socket.on('collector_location_update', (data) => {
      console.log('📍 Collector location updated:', data);
      this.emit('collector_location_update', data);
    });

    // Handle chat messages
    this.socket.on('new_message', (message) => {
      console.log('💬 New message received:', message);
      this.emit('new_message', message);
      
      // Show notification for new message
      this.showNotification({
        id: `msg_${Date.now()}`,
        title: 'Nouveau message',
        body: message.message,
        type: 'system',
        priority: 'normal',
        timestamp: new Date().toISOString(),
        read: false
      });
    });

    // Handle typing indicators
    this.socket.on('user_typing', (data) => {
      this.emit('user_typing', data);
    });

    this.socket.on('user_stopped_typing', (data) => {
      this.emit('user_stopped_typing', data);
    });

    // Handle area notifications
    this.socket.on('area_notification', (data) => {
      console.log('📡 Area notification received:', data);
      this.handleIncomingNotification(data.notification);
    });
  }

  // Handle incoming notification
  private handleIncomingNotification(notification: Notification) {
    // Add to notifications list
    this.notifications.unshift(notification);
    
    // Limit notifications history
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    // Check preferences
    if (!this.preferences.realTime) return;
    
    const typeEnabled = this.isNotificationTypeEnabled(notification.type);
    if (!typeEnabled) return;

    // Show notification
    this.showNotification(notification);
    
    // Emit to listeners
    this.emit('notification_received', notification);
    
    // Play sound if enabled
    if (this.preferences.sound && notification.sound) {
      this.playNotificationSound(notification.sound);
    }

    // Send acknowledgment
    this.socket?.emit('notification_received', notification.id);
  }

  // Show notification (desktop/browser)
  private showNotification(notification: Notification) {
    if (!this.preferences.desktop) return;

    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.body,
        icon: '/icons/collectam-logo.png',
        badge: '/icons/collectam-badge.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'high' || notification.priority === 'urgent',
        silent: !this.preferences.sound
      });

      browserNotification.onclick = () => {
        window.focus();
        this.emit('notification_clicked', notification);
        browserNotification.close();
      };

      // Auto close after 5 seconds for normal priority
      if (notification.priority === 'normal' || notification.priority === 'low') {
        setTimeout(() => browserNotification.close(), 5000);
      }
    }
  }

  // Play notification sound
  private playNotificationSound(soundFile: string) {
    try {
      const audio = new Audio(`/sounds/${soundFile}`);
      audio.volume = 0.5;
      audio.play().catch(console.error);
    } catch (error) {
      console.error('❌ Failed to play notification sound:', error);
    }
  }

  // Check if notification type is enabled
  private isNotificationTypeEnabled(type: string): boolean {
    switch (type) {
      case 'collection_assigned':
      case 'collection_started':
      case 'collection_completed':
        return this.preferences.collections;
      case 'new_mission':
      case 'mission_reminder':
        return this.preferences.missions;
      case 'system':
      default:
        return this.preferences.system;
    }
  }

  // Request notification permission
  private async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('⚠️ Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('⚠️ Notification permission denied');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Load preferences from localStorage
  private loadPreferences() {
    try {
      const saved = localStorage.getItem('notification_preferences');
      if (saved) {
        this.preferences = { ...this.preferences, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('❌ Failed to load notification preferences:', error);
    }
  }

  // Save preferences to localStorage
  private savePreferences() {
    try {
      localStorage.setItem('notification_preferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('❌ Failed to save notification preferences:', error);
    }
  }

  // Public methods

  // Disconnect from server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Send location update (for collectors)
  updateLocation(latitude: number, longitude: number, accuracy?: number) {
    if (this.socket && this.isConnected) {
      this.socket.emit('update_location', { latitude, longitude, accuracy });
    }
  }

  // Send mission status update
  updateMissionStatus(missionId: string, status: string, data?: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit('mission_status_update', { missionId, status, data });
    }
  }

  // Send chat message
  sendMessage(conversationId: string, message: string, recipientId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', { conversationId, message, recipientId });
    }
  }

  // Send typing indicator
  startTyping(conversationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_start', { conversationId });
    }
  }

  stopTyping(conversationId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_stop', { conversationId });
    }
  }

  // Mark notifications as read
  markAsRead(notificationIds: string[]) {
    if (this.socket && this.isConnected) {
      this.socket.emit('mark_notifications_read', notificationIds);
    }
    
    // Update local notifications
    this.notifications.forEach(notification => {
      if (notificationIds.includes(notification.id)) {
        notification.read = true;
      }
    });
    
    this.emit('notifications_updated', this.notifications);
  }

  // Get notifications
  getNotifications(): Notification[] {
    return this.notifications;
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Get preferences
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  // Update preferences
  updatePreferences(newPreferences: Partial<NotificationPreferences>) {
    this.preferences = { ...this.preferences, ...newPreferences };
    this.savePreferences();
    this.emit('preferences_updated', this.preferences);
  }

  // Check connection status
  isConnectedToServer(): boolean {
    return this.isConnected;
  }

  // Event system
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.emit('notifications_updated', this.notifications);
  }

  // Remove specific notification
  removeNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.emit('notifications_updated', this.notifications);
  }
}

export const notificationService = new NotificationService();
