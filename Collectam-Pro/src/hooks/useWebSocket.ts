import { useEffect, useRef } from 'react';
import { webSocketService, NotificationData } from '@/services/WebSocketService';
import { AuthService } from '@/services/AuthService';
import { toast } from 'sonner';

interface UseWebSocketProps {
  onNewWasteRequest?: (data: any) => void;
  onCollectorAssigned?: (data: any) => void;
  onCollectorLocationUpdate?: (data: any) => void;
  onCollectionStarted?: (data: any) => void;
  onCollectionCompleted?: (data: any) => void;
}

export const useWebSocket = ({
  onNewWasteRequest,
  onCollectorAssigned,
  onCollectorLocationUpdate,
  onCollectionStarted,
  onCollectionCompleted
}: UseWebSocketProps = {}) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = AuthService.getToken();
    if (!token || isInitialized.current) {
      return;
    }

    console.log('🔌 Initialisation WebSocket...');
    
    // Se connecter au WebSocket
    webSocketService.connect();
    isInitialized.current = true;

    // Écouter les événements de connexion
    webSocketService.on('connected', (data: any) => {
      console.log('✅ WebSocket connecté:', data);
      toast.success('Connexion temps réel établie');
    });

    webSocketService.on('disconnected', (data: any) => {
      console.log('❌ WebSocket déconnecté:', data);
      toast.warning('Connexion temps réel perdue');
    });

    webSocketService.on('connection_failed', (data: any) => {
      console.error('❌ Échec connexion WebSocket:', data);
      toast.error('Impossible de se connecter au service temps réel');
    });

    // Écouter les notifications générales
    webSocketService.on('notification', (data: NotificationData) => {
      console.log('🔔 Notification reçue:', data);
      
      switch (data.type) {
        case 'new_request':
          toast.info(data.message);
          break;
        case 'request_assigned':
          toast.success(data.message);
          break;
        case 'collection_started':
          toast.info(data.message);
          break;
        case 'collection_completed':
          toast.success(data.message);
          break;
        default:
          toast.info(data.message);
      }
    });

    // Écouter les événements spécifiques
    if (onNewWasteRequest) {
      webSocketService.on('new_waste_request', onNewWasteRequest);
    }

    if (onCollectorAssigned) {
      webSocketService.on('collector_assigned', onCollectorAssigned);
    }

    if (onCollectorLocationUpdate) {
      webSocketService.on('collector_location_update', onCollectorLocationUpdate);
    }

    if (onCollectionStarted) {
      webSocketService.on('collection_started', onCollectionStarted);
    }

    if (onCollectionCompleted) {
      webSocketService.on('collection_completed', onCollectionCompleted);
    }

    // Nettoyage lors du démontage
    return () => {
      console.log('🔌 Nettoyage WebSocket...');
      
      // Retirer les écouteurs spécifiques
      if (onNewWasteRequest) {
        webSocketService.off('new_waste_request', onNewWasteRequest);
      }
      if (onCollectorAssigned) {
        webSocketService.off('collector_assigned', onCollectorAssigned);
      }
      if (onCollectorLocationUpdate) {
        webSocketService.off('collector_location_update', onCollectorLocationUpdate);
      }
      if (onCollectionStarted) {
        webSocketService.off('collection_started', onCollectionStarted);
      }
      if (onCollectionCompleted) {
        webSocketService.off('collection_completed', onCollectionCompleted);
      }

      // Retirer les écouteurs généraux
      webSocketService.off('connected');
      webSocketService.off('disconnected');
      webSocketService.off('connection_failed');
      webSocketService.off('notification');
      
      // Déconnecter si nécessaire
      // Note: On ne déconnecte pas automatiquement car d'autres composants peuvent l'utiliser
    };
  }, [onNewWasteRequest, onCollectorAssigned, onCollectorLocationUpdate, onCollectionStarted, onCollectionCompleted]);

  // Fonctions utilitaires
  const sendLocationUpdate = (coordinates: [number, number], accuracy?: number) => {
    webSocketService.sendLocationUpdate(coordinates, accuracy);
  };

  const notifyCollectionStarted = (requestId: string) => {
    webSocketService.notifyCollectionStarted(requestId);
  };

  const notifyCollectionCompleted = (requestId: string, actualWeight?: number) => {
    webSocketService.notifyCollectionCompleted(requestId, actualWeight);
  };

  const joinRoom = (roomName: string) => {
    webSocketService.joinRoom(roomName);
  };

  const leaveRoom = (roomName: string) => {
    webSocketService.leaveRoom(roomName);
  };

  const isConnected = () => {
    return webSocketService.isSocketConnected();
  };

  return {
    sendLocationUpdate,
    notifyCollectionStarted,
    notifyCollectionCompleted,
    joinRoom,
    leaveRoom,
    isConnected
  };
};

export default useWebSocket;
