// Configuration MapTiler
const MAPTILER_API_KEY = 'DvJJUZaEy1icy86CXLTL';

export interface RoutePoint {
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
}

export interface RouteStep {
  instruction: string;
  distance: number; // en mètres
  duration: number; // en secondes
  coordinates: [number, number][];
}

export interface Route {
  geometry: {
    coordinates: [number, number][];
    type: 'LineString';
  };
  distance: number; // en mètres
  duration: number; // en secondes
  steps: RouteStep[];
}

export interface RoutingResponse {
  routes: Route[];
  waypoints: {
    location: [number, number];
    name: string;
  }[];
}

class RoutingService {
  private apiKey = MAPTILER_API_KEY;
  private baseUrl = 'https://api.maptiler.com/directions';

  /**
   * Calculer un itinéraire entre deux points
   */
  async getRoute(
    start: RoutePoint,
    end: RoutePoint,
    profile: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<Route | null> {
    try {
      const startCoords = `${start.coordinates[0]},${start.coordinates[1]}`;
      const endCoords = `${end.coordinates[0]},${end.coordinates[1]}`;
      
      const url = `${this.baseUrl}/${profile}/${startCoords};${endCoords}?key=${this.apiKey}&geometries=geojson&steps=true&overview=full`;
      
      console.log('🛣️ Calcul itinéraire:', { start: startCoords, end: endCoords, profile });
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('❌ Erreur API routing:', response.status, response.statusText);
        return null;
      }
      
      const data: RoutingResponse = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        console.warn('⚠️ Aucun itinéraire trouvé');
        return null;
      }
      
      const route = data.routes[0];
      console.log('✅ Itinéraire calculé:', {
        distance: `${(route.distance / 1000).toFixed(1)} km`,
        duration: `${Math.round(route.duration / 60)} min`
      });
      
      return route;
    } catch (error) {
      console.error('❌ Erreur calcul itinéraire:', error);
      return null;
    }
  }

  /**
   * Calculer un itinéraire optimisé pour plusieurs points
   */
  async getOptimizedRoute(
    start: RoutePoint,
    waypoints: RoutePoint[],
    end?: RoutePoint,
    profile: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<Route | null> {
    try {
      if (waypoints.length === 0) {
        return end ? this.getRoute(start, end, profile) : null;
      }

      // Construire la liste des coordonnées
      const coordinates = [start, ...waypoints];
      if (end) {
        coordinates.push(end);
      }

      const coordsString = coordinates
        .map(point => `${point.coordinates[0]},${point.coordinates[1]}`)
        .join(';');

      const url = `${this.baseUrl}/${profile}/${coordsString}?key=${this.apiKey}&geometries=geojson&steps=true&overview=full&optimize=true`;
      
      console.log('🛣️ Calcul itinéraire optimisé pour', coordinates.length, 'points');
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('❌ Erreur API routing optimisé:', response.status, response.statusText);
        return null;
      }
      
      const data: RoutingResponse = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        console.warn('⚠️ Aucun itinéraire optimisé trouvé');
        return null;
      }
      
      const route = data.routes[0];
      console.log('✅ Itinéraire optimisé calculé:', {
        distance: `${(route.distance / 1000).toFixed(1)} km`,
        duration: `${Math.round(route.duration / 60)} min`,
        waypoints: coordinates.length
      });
      
      return route;
    } catch (error) {
      console.error('❌ Erreur calcul itinéraire optimisé:', error);
      return null;
    }
  }

  /**
   * Calculer la matrice de distances entre plusieurs points
   */
  async getDistanceMatrix(
    origins: RoutePoint[],
    destinations: RoutePoint[],
    profile: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<number[][] | null> {
    try {
      const originsString = origins
        .map(point => `${point.coordinates[0]},${point.coordinates[1]}`)
        .join(';');
      
      const destinationsString = destinations
        .map(point => `${point.coordinates[0]},${point.coordinates[1]}`)
        .join(';');

      const url = `${this.baseUrl}/matrix/${profile}?key=${this.apiKey}&sources=${originsString}&destinations=${destinationsString}`;
      
      console.log('📊 Calcul matrice distances:', { origins: origins.length, destinations: destinations.length });
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('❌ Erreur API matrice distances:', response.status, response.statusText);
        return null;
      }
      
      const data = await response.json();
      
      if (!data.distances) {
        console.warn('⚠️ Aucune matrice de distances trouvée');
        return null;
      }
      
      console.log('✅ Matrice distances calculée');
      return data.distances;
    } catch (error) {
      console.error('❌ Erreur calcul matrice distances:', error);
      return null;
    }
  }

  /**
   * Formater la durée en texte lisible
   */
  formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)}min`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.round((seconds % 3600) / 60);
      return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    }
  }

  /**
   * Formater la distance en texte lisible
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(1)}km`;
    }
  }

  /**
   * Convertir une route en GeoJSON pour affichage sur carte
   */
  routeToGeoJSON(route: Route) {
    return {
      type: 'Feature' as const,
      properties: {
        distance: route.distance,
        duration: route.duration,
        distanceText: this.formatDistance(route.distance),
        durationText: this.formatDuration(route.duration)
      },
      geometry: route.geometry
    };
  }
}

export const routingService = new RoutingService();
