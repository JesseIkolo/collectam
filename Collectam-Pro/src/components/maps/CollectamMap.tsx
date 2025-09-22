"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

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

export interface CollectamMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (coordinates: [number, number]) => void;
  showUserLocation?: boolean;
  style?: 'streets' | 'satellite' | 'hybrid' | 'dark' | 'light';
  height?: string;
  className?: string;
  realTimeTracking?: boolean;
  clustered?: boolean;
}

const CollectamMap: React.FC<CollectamMapProps> = ({
  center = [9.7043, 4.0511], // Douala, Cameroun par défaut
  zoom = 12,
  markers = [],
  onMarkerClick,
  onMapClick,
  showUserLocation = true,
  style = 'streets',
  height = '400px',
  className = '',
  realTimeTracking = false,
  clustered = false
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
          pending: '#F59E0B', // Orange
          scheduled: '#8B5CF6', // Violet
          in_progress: '#EF4444', // Rouge
          completed: '#10B981', // Vert
          cancelled: '#6B7280' // Gris
        };
        return { 
          ...baseStyle, 
          backgroundColor: statusColors[marker.status as keyof typeof statusColors] || '#F59E0B' 
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

  // Mise à jour des marqueurs
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Supprimer les anciens marqueurs
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Ajouter les nouveaux marqueurs
    markers.forEach(markerData => {
      try {
        // Créer l'élément DOM pour le marqueur
        const el = document.createElement('div');
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

  }, [markers, isLoaded]);

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
