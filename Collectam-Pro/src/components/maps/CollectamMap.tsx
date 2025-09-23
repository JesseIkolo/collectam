"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

// Styles CSS pour l'animation de battement de cœur et le surlignage
const heartbeatStyles = `
  @keyframes heartbeat {
    0% {
      transform: scale(1);
      box-shadow: 0 0 20px rgba(255, 0, 0, 0.8), 0 2px 10px rgba(0,0,0,0.3);
    }
    50% {
      transform: scale(1.2);
      box-shadow: 0 0 30px rgba(255, 0, 0, 1), 0 2px 15px rgba(0,0,0,0.4);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 20px rgba(255, 0, 0, 0.8), 0 2px 10px rgba(0,0,0,0.3);
    }
  }
  @keyframes highlightPulse {
    0% { box-shadow: 0 0 0 0 rgba(14,165,233,0.6); }
    70% { box-shadow: 0 0 0 12px rgba(14,165,233,0.0); }
    100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.0); }
  }
  
  .collectam-marker {
    transition: all 0.3s ease;
  }
  .collectam-highlight {
    outline: 3px solid #0ea5e9; /* cyan-500 */
    animation: highlightPulse 1.5s ease-out 3;
  }
`;

// Injecter les styles dans le document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = heartbeatStyles;
  document.head.appendChild(styleSheet);
}

// Configuration MapTiler
const MAPTILER_API_KEY = 'DvJJUZaEy1icy86CXLTL';
maptilersdk.config.apiKey = MAPTILER_API_KEY;

export interface MapMarker {
  id: string;
  coordinates: [number, number]; // [longitude, latitude]
  type: 'household' | 'collector' | 'waste-request' | 'collection-point';
  status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  data?: any;
  popup?: {
    title: string;
    content: string;
    actions?: Array<{
      label: string;
      onClick: () => void;
      variant?: 'primary' | 'secondary' | 'danger';
    }>;
  };
}

export interface RouteLayer {
  id: string;
  coordinates: [number, number][];
  color?: string;
  width?: number;
  opacity?: number;
}

export interface CollectamMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  routes?: RouteLayer[];
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (coordinates: [number, number]) => void;
  showUserLocation?: boolean;
  style?: 'streets' | 'satellite' | 'hybrid' | 'dark' | 'light';
  height?: string;
  className?: string;
  realTimeTracking?: boolean;
  clustered?: boolean;
  highlightMarkerId?: string;
}

const CollectamMap: React.FC<CollectamMapProps> = ({
  center = [9.7043, 4.0511], // Douala, Cameroun par défaut
  zoom = 12,
  markers = [],
  routes = [],
  onMarkerClick,
  onMapClick,
  showUserLocation = true,
  style = 'streets',
  height = '400px',
  className = '',
  realTimeTracking = false,
  clustered = false,
  highlightMarkerId
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maptilersdk.Marker }>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Styles de carte MapTiler
  const getMapStyle = (styleType: string) => {
    switch (styleType) {
      case 'satellite':
        return maptilersdk.MapStyle.SATELLITE;
      case 'hybrid':
        return maptilersdk.MapStyle.HYBRID;
      case 'dark':
        return 'https://api.maptiler.com/maps/dataviz-dark/style.json?key=' + MAPTILER_API_KEY;
      case 'light':
        return 'https://api.maptiler.com/maps/dataviz-light/style.json?key=' + MAPTILER_API_KEY;
      default:
        return maptilersdk.MapStyle.STREETS;
    }
  };

  // Couleurs et icônes pour les différents types de marqueurs
  const getMarkerStyle = (marker: MapMarker) => {
    const baseStyle = {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: '3px solid white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
      color: 'white',
      cursor: 'pointer'
    };

    switch (marker.type) {
      case 'household':
        return { ...baseStyle, backgroundColor: '#3B82F6' }; // Bleu
      case 'collector':
        return { ...baseStyle, backgroundColor: '#10B981' }; // Vert
      case 'waste-request':
        const statusColors = {
          pending: '#FF0000', // Rouge fluorescent
          scheduled: '#FF0000', // Rouge fluorescent
          in_progress: '#FF4444', // Rouge plus clair
          completed: '#10B981', // Vert
          cancelled: '#6B7280' // Gris
        };
        
        // Style avec effet de battement de cœur pour les demandes actives
        const isActive = marker.status === 'pending' || marker.status === 'scheduled';
        return { 
          ...baseStyle, 
          backgroundColor: statusColors[marker.status as keyof typeof statusColors] || '#FF0000',
          boxShadow: isActive 
            ? '0 0 20px rgba(255, 0, 0, 0.8), 0 2px 10px rgba(0,0,0,0.3)' 
            : '0 2px 10px rgba(0,0,0,0.3)',
          animation: isActive ? 'heartbeat 1.5s ease-in-out infinite' : 'none',
          width: isActive ? '40px' : '32px',
          height: isActive ? '40px' : '32px'
        };
      case 'collection-point':
        return { ...baseStyle, backgroundColor: '#F97316' }; // Orange foncé
      default:
        return { ...baseStyle, backgroundColor: '#6B7280' }; // Gris par défaut
    }
  };

  // Icônes pour les différents types
  const getMarkerIcon = (marker: MapMarker) => {
    switch (marker.type) {
      case 'household':
        return '🏠';
      case 'collector':
        return '🚛';
      case 'waste-request':
        return '🗑️';
      case 'collection-point':
        return '📍';
      default:
        return '📍';
    }
  };

  // Initialisation de la carte
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: getMapStyle(style),
        center: center,
        zoom: zoom,
        attributionControl: false
      });

      map.current.on('load', () => {
        setIsLoaded(true);
        console.log('🗺️ Carte MapTiler chargée avec succès');
      });

      // Gestion des clics sur la carte
      if (onMapClick) {
        map.current.on('click', (e) => {
          const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
          onMapClick(coordinates);
        });
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de la carte:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Mise à jour des routes
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Supprimer les routes existantes
    routes.forEach(route => {
      if (map.current?.getSource(`route-${route.id}`)) {
        map.current?.removeLayer(`route-${route.id}`);
        map.current?.removeSource(`route-${route.id}`);
      }
    });

    // Ajouter les nouvelles routes
    routes.forEach(route => {
      const routeGeoJSON = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: route.coordinates
        }
      };

      // Ajouter la source de données
      map.current?.addSource(`route-${route.id}`, {
        type: 'geojson',
        data: routeGeoJSON
      });

      // Ajouter la couche de ligne
      map.current?.addLayer({
        id: `route-${route.id}`,
        type: 'line',
        source: `route-${route.id}`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': route.color || '#3B82F6',
          'line-width': route.width || 4,
          'line-opacity': route.opacity || 0.8
        }
      });
    });
  }, [routes, isLoaded]);

  // Recentrer la carte quand la prop center change
  useEffect(() => {
    if (!map.current || !isLoaded) return;
    if (center && Array.isArray(center) && center.length === 2) {
      try {
        map.current.setCenter(center);
      } catch (e) {
        console.warn('⚠️ Impossible de recentrer la carte', e);
      }
    }
  }, [center, isLoaded]);

  // Mise à jour des marqueurs
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Supprimer tous les marqueurs existants
    Object.values(markersRef.current).forEach(marker => {
      marker.remove();
    });
    markersRef.current = {};

    // Ajouter les nouveaux marqueurs
    markers.forEach(markerData => {
      try {
        // Créer l'élément DOM pour le marqueur
        const el = document.createElement('div');
        el.className = 'collectam-marker'; // Ajouter la classe pour identification
        const markerStyle = getMarkerStyle(markerData);
        
        Object.assign(el.style, markerStyle);
        el.innerHTML = getMarkerIcon(markerData);
        el.title = markerData.popup?.title || `${markerData.type} - ${markerData.id}`;

        // Créer le marqueur MapTiler
        const marker = new maptilersdk.Marker({ element: el })
          .setLngLat(markerData.coordinates)
          .addTo(map.current!);

        // Ajouter popup si définie
        if (markerData.popup) {
          const popup = new maptilersdk.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-3">
                <h3 class="font-bold text-lg mb-2">${markerData.popup.title}</h3>
                <p class="text-sm text-gray-600 mb-3">${markerData.popup.content}</p>
                ${markerData.popup.actions ? `
                  <div class="flex gap-2">
                    ${markerData.popup.actions.map((action, index) => `
                      <button 
                        onclick="window.collectamMapActions?.['${markerData.id}_${index}']()"
                        class="px-3 py-1 text-xs rounded ${
                          action.variant === 'danger' ? 'bg-red-500 text-white' :
                          action.variant === 'primary' ? 'bg-blue-500 text-white' :
                          'bg-gray-200 text-gray-700'
                        }"
                      >
                        ${action.label}
                      </button>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            `);

          marker.setPopup(popup);

          // Stocker les actions dans window pour les callbacks
          if (markerData.popup.actions) {
            if (!window.collectamMapActions) window.collectamMapActions = {};
            markerData.popup.actions.forEach((action, index) => {
              window.collectamMapActions![`${markerData.id}_${index}`] = action.onClick;
            });
          }
        }

        // Surligner le marqueur si demandé
        if (highlightMarkerId && markerData.id === highlightMarkerId) {
          try {
            el.classList.add('collectam-highlight');
            // Ouvrir le popup si disponible
            // @ts-ignore - togglePopup may exist depending on SDK version
            marker.togglePopup && marker.togglePopup();
            // Retirer le surlignage après 4.5s
            setTimeout(() => el.classList.remove('collectam-highlight'), 4500);
          } catch (e) {
            console.warn('⚠️ Impossible de surligner/ouvrir le popup du marqueur', e);
          }
        }

        // Gestion du clic sur le marqueur
        el.addEventListener('click', () => {
          if (onMarkerClick) {
            onMarkerClick(markerData);
          }
        });

        markersRef.current[markerData.id] = marker;

      } catch (error) {
        console.error(`❌ Erreur lors de la création du marqueur ${markerData.id}:`, error);
      }
    });

    // Ajuster la vue pour inclure tous les marqueurs
    if (markers.length > 1) {
      const bounds = new maptilersdk.LngLatBounds();
      markers.forEach(marker => {
        bounds.extend(marker.coordinates);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }

  }, [markers, isLoaded, highlightMarkerId]);

  // Nettoyage lors du démontage du composant
  useEffect(() => {
    return () => {
      // Nettoyer tous les marqueurs
      Object.values(markersRef.current).forEach(marker => {
        marker.remove();
      });
      markersRef.current = {};
      
      // Nettoyer la carte
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainer} 
        style={{ height }}
        className="w-full rounded-lg overflow-hidden shadow-lg"
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-gray-600">Chargement de la carte...</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Déclaration TypeScript pour window.collectamMapActions
declare global {
  interface Window {
    collectamMapActions?: { [key: string]: () => void };
  }
}

export default CollectamMap;
