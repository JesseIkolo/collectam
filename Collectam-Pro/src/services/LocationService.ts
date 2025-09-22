import { apiService } from '@/services/ApiService';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface CollectorLocationResponse {
  collectorId: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  accuracy?: number;
  lastUpdate: string;
  onDuty: boolean;
}

export interface ActiveCollectorResponse {
  collectorId: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  accuracy?: number;
  lastUpdate: string;
  onDuty: boolean;
}

class LocationService {
  private watchId: number | null = null;
  private lastKnownPosition: LocationData | null = null;

  /**
   * Obtenir la position actuelle de l'utilisateur
   */
  async getCurrentPosition(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée par ce navigateur'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          this.lastKnownPosition = locationData;
          resolve(locationData);
        },
        (error) => {
          let errorMessage = 'Erreur de géolocalisation';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permission de géolocalisation refusée';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Position non disponible';
              break;
            case error.TIMEOUT:
              errorMessage = 'Timeout de géolocalisation';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * Surveiller la position en temps réel
   */
  startWatchingPosition(
    onPositionUpdate: (position: LocationData) => void,
    onError?: (error: string) => void
  ): void {
    if (!navigator.geolocation) {
      onError?.('Géolocalisation non supportée');
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        this.lastKnownPosition = locationData;
        onPositionUpdate(locationData);
      },
      (error) => {
        let errorMessage = 'Erreur de suivi de position';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission de géolocalisation refusée';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position non disponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout de géolocalisation';
            break;
        }
        onError?.(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000 // 30 secondes
      }
    );
  }

  /**
   * Arrêter le suivi de position
   */
  stopWatchingPosition(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Mettre à jour la position du collecteur sur le serveur
   */
  async updateCollectorLocation(locationData: LocationData): Promise<void> {
    try {
      const response = await apiService.post('/waste-requests/collector/location', {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy
      });

      if (!response.success) {
        throw new Error(response.message || 'Erreur lors de la mise à jour de la position');
      }

      console.log('✅ Position collecteur mise à jour:', response.data);
    } catch (error) {
      console.error('❌ Erreur mise à jour position:', error);
      throw error;
    }
  }

  /**
   * Récupérer la position d'un collecteur spécifique
   */
  async getCollectorLocation(collectorId: string): Promise<CollectorLocationResponse> {
    try {
      const response = await apiService.get(`/waste-requests/collector/${collectorId}/location`);

      if (!response.success) {
        throw new Error(response.message || 'Erreur lors de la récupération de la position');
      }

      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération position collecteur:', error);
      throw error;
    }
  }

  /**
   * Récupérer tous les collecteurs actifs
   */
  async getActiveCollectors(): Promise<ActiveCollectorResponse[]> {
    try {
      const response = await apiService.get('/waste-requests/collectors/active');

      if (!response.success) {
        throw new Error(response.message || 'Erreur lors de la récupération des collecteurs actifs');
      }

      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération collecteurs actifs:', error);
      throw error;
    }
  }

  /**
   * Calculer la distance entre deux points (en kilomètres)
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Calculer l'ETA basé sur la distance et la vitesse moyenne
   */
  calculateETA(
    collectorLat: number,
    collectorLon: number,
    destinationLat: number,
    destinationLon: number,
    averageSpeed: number = 25 // km/h par défaut
  ): { distance: number; eta: number; etaText: string } {
    const distance = this.calculateDistance(
      collectorLat,
      collectorLon,
      destinationLat,
      destinationLon
    );

    const eta = (distance / averageSpeed) * 60; // en minutes
    
    let etaText = '';
    if (eta < 1) {
      etaText = 'Moins d\'1 minute';
    } else if (eta < 60) {
      etaText = `${Math.round(eta)} minutes`;
    } else {
      const hours = Math.floor(eta / 60);
      const minutes = Math.round(eta % 60);
      etaText = `${hours}h ${minutes}min`;
    }

    return {
      distance: Math.round(distance * 100) / 100, // Arrondi à 2 décimales
      eta: Math.round(eta),
      etaText
    };
  }

  /**
   * Obtenir la dernière position connue
   */
  getLastKnownPosition(): LocationData | null {
    return this.lastKnownPosition;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const locationService = new LocationService();
