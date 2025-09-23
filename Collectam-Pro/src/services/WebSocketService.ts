import { io, Socket } from 'socket.io-client';
import { AuthService } from './AuthService';

export interface NotificationData {
  type: 'new_request' | 'request_assigned' | 'collection_started' | 'collection_completed' | 'collector_location_update';
  requestId?: string;
  collectorId?: string;
  userId?: string;
  message: string;
  data?: any;
  timestamp: string;
}

export interface LocationUpdate {
  collectorId: string;
  coordinates: [number, number];
  accuracy?: number;
  timestamp: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Se connecter au serveur WebSocket
   */
  connect(): void {
    if (this.socket?.connected) {
      console.log('🔌 WebSocket déjà connecté');
      return;
    }

    const serverUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';
    const token = AuthService.getToken();

    if (!token) {
      console.warn('⚠️ Pas de token d\'authentification pour WebSocket');
      return;
    }

    console.log('🔌 Connexion WebSocket à:', serverUrl);

    this.socket = io(serverUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay
    });

    this.setupEventListeners();
  }

  /**
   * Configurer les écouteurs d'événements WebSocket
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connexion réussie
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connecté avec ID:', this.socket?.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emitLocal('connected', { socketId: this.socket?.id });
    });

    // Déconnexion
    this.socket.on('disconnect', (reason: string) => {
      console.log('❌ WebSocket déconnecté:', reason);
      this.isConnected = false;
      this.emitLocal('disconnected', { reason });
    });

    // Erreur de connexion
    this.socket.on('connect_error', (error: any) => {
      console.error('❌ Erreur connexion WebSocket:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('❌ Nombre maximum de tentatives de reconnexion atteint');
        this.emitLocal('connection_failed', { error, attempts: this.reconnectAttempts });
      }
    });

    // Notification générale
    this.socket.on('notification', (data: NotificationData) => {
      console.log('🔔 Notification reçue:', data);
      this.emitLocal('notification', data);
    });

    // Nouvelle demande de collecte (pour collecteurs)
    this.socket.on('new_waste_request', (data: any) => {
      console.log('🗑️ Nouvelle demande de collecte:', data);
      this.emitLocal('new_waste_request', data);
    });

    // Collecteur assigné (pour ménages)
    this.socket.on('collector_assigned', (data: any) => {
      console.log('🚛 Collecteur assigné:', data);
      this.emitLocal('collector_assigned', data);
    });

    // Mise à jour position collecteur
    this.socket.on('collector_location_update', (data: LocationUpdate) => {
      console.log('📍 Position collecteur mise à jour:', data);
      this.emitLocal('collector_location_update', data);
    });

    // Collecte démarrée
    this.socket.on('collection_started', (data: any) => {
      console.log('▶️ Collecte démarrée:', data);
      this.emitLocal('collection_started', data);
    });

    // Collecte terminée
    this.socket.on('collection_completed', (data: any) => {
      console.log('✅ Collecte terminée:', data);
      this.emitLocal('collection_completed', data);
    });
  }

  /**
   * Se déconnecter du WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Déconnexion WebSocket');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Envoyer un événement au serveur
   */
  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ WebSocket non connecté, impossible d\'envoyer:', event);
    }
  }

  /**
   * Écouter un événement
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Si le socket existe déjà, ajouter l'écouteur
    if (this.socket) {
      this.socket.on(event, callback as any);
    }
  }

  /**
   * Arrêter d'écouter un événement
   */
  off(event: string, callback?: Function): void {
    if (callback) {
      const listeners = this.listeners.get(event) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
      this.socket?.off(event, callback as any);
    } else {
      this.listeners.delete(event);
      this.socket?.off(event);
    }
  }

  /**
   * Rejoindre une room (pour les notifications ciblées)
   */
  joinRoom(roomName: string): void {
    this.emit('join_room', { room: roomName });
    console.log('🏠 Rejoint la room:', roomName);
  }

  /**
   * Quitter une room
   */
  leaveRoom(roomName: string): void {
    this.emit('leave_room', { room: roomName });
    console.log('🚪 Quitté la room:', roomName);
  }

  /**
   * Envoyer la position du collecteur en temps réel
   */
  sendLocationUpdate(coordinates: [number, number], accuracy?: number): void {
    const locationData: LocationUpdate = {
      collectorId: this.getCurrentUserId() || '',
      coordinates,
      accuracy,
      timestamp: new Date().toISOString()
    };

    this.emit('location_update', locationData);
  }

  /**
   * Notifier le démarrage d'une collecte
   */
  notifyCollectionStarted(requestId: string): void {
    this.emit('collection_started', {
      requestId,
      collectorId: this.getCurrentUserId(),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Notifier la fin d'une collecte
   */
  notifyCollectionCompleted(requestId: string, actualWeight?: number): void {
    this.emit('collection_completed', {
      requestId,
      collectorId: this.getCurrentUserId(),
      actualWeight,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Obtenir l'ID de l'utilisateur actuel
   */
  private getCurrentUserId(): string | null {
    try {
      const token = AuthService.getToken();
      if (!token) return null;
      
      // Décoder le token JWT pour obtenir l'ID utilisateur
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload._id || null;
    } catch (error) {
      console.error('Erreur décodage token:', error);
      return null;
    }
  }

  /**
   * Vérifier si WebSocket est connecté
   */
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Obtenir l'ID du socket
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  /**
   * Émettre un événement personnalisé local
   */
  private emitLocal(event: string, data: any): void {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('❌ Erreur dans le callback WebSocket:', error);
      }
    });
  }
}

// Instance singleton
export const webSocketService = new WebSocketService();

// Auto-connexion si un token existe
if (typeof window !== 'undefined') {
  const token = AuthService.getToken();
  if (token) {
    webSocketService.connect();
  }
}
