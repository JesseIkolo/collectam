"use client";

import React, { useState, useEffect } from 'react';
import CollectamMap, { MapMarker } from './CollectamMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Weight, 
  Phone, 
  CheckCircle, 
  Play,
  Route
} from 'lucide-react';

interface WasteRequest {
  _id: string;
  wasteType: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  address: string;
  coordinates?: {
    coordinates: [number, number];
  };
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  preferredDate: string;
  preferredTime: string;
  estimatedWeight: number;
  description: string;
  scheduledDate?: string;
}

interface CollectorRouteMapProps {
  assignedRequests: WasteRequest[];
  collectorLocation?: [number, number];
  onStartCollection?: (requestId: string) => void;
  onCompleteCollection?: (requestId: string) => void;
  onNavigateToLocation?: (coordinates: [number, number], address: string) => void;
  className?: string;
}

const CollectorRouteMap: React.FC<CollectorRouteMapProps> = ({
  assignedRequests,
  collectorLocation,
  onStartCollection,
  onCompleteCollection,
  onNavigateToLocation,
  className = ''
}) => {
  const [selectedRequest, setSelectedRequest] = useState<WasteRequest | null>(null);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [routeOptimized, setRouteOptimized] = useState(false);

  // Conversion des demandes assignées en marqueurs de carte
  useEffect(() => {
    const markers: MapMarker[] = [];

    // Marqueur pour la position du collecteur
    if (collectorLocation) {
      markers.push({
        id: 'collector-position',
        coordinates: collectorLocation,
        type: 'collector',
        popup: {
          title: 'Votre position',
          content: 'Position actuelle du collecteur',
          actions: [
            {
              label: 'Centrer sur moi',
              onClick: () => {
                // La carte se centrera automatiquement
              },
              variant: 'primary'
            }
          ]
        }
      });
    }

    // Marqueurs pour les demandes assignées
    assignedRequests.forEach((request, index) => {
      if (request.coordinates) {
        markers.push({
          id: `request-${request._id}`,
          coordinates: request.coordinates.coordinates,
          type: 'waste-request',
          status: request.status,
          data: { ...request, routeOrder: index + 1 },
          popup: {
            title: `Collecte #${index + 1} - ${getWasteTypeLabel(request.wasteType)}`,
            content: `
              <div class="space-y-2">
                <p><strong>Client:</strong> ${request.userId.firstName} ${request.userId.lastName}</p>
                <p><strong>Adresse:</strong> ${request.address}</p>
                <p><strong>Poids:</strong> ${request.estimatedWeight}kg</p>
                <p><strong>Heure prévue:</strong> ${request.preferredTime}</p>
                <p><strong>Status:</strong> ${getStatusLabel(request.status)}</p>
                <p><strong>Description:</strong> ${request.description}</p>
              </div>
            `,
            actions: [
              ...(request.status === 'scheduled' ? [{
                label: 'Commencer',
                onClick: () => onStartCollection?.(request._id),
                variant: 'primary' as const
              }] : []),
              ...(request.status === 'in_progress' ? [{
                label: 'Terminer',
                onClick: () => onCompleteCollection?.(request._id),
                variant: 'primary' as const
              }] : []),
              {
                label: 'Navigation',
                onClick: () => onNavigateToLocation?.(request.coordinates!.coordinates, request.address),
                variant: 'secondary' as const
              },
              {
                label: 'Appeler',
                onClick: () => window.open(`tel:${request.userId.phone}`),
                variant: 'secondary' as const
              }
            ]
          }
        });
      }
    });

    setMapMarkers(markers);
  }, [assignedRequests, collectorLocation]);

  const getWasteTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'organic': 'Organique',
      'plastic': 'Plastique',
      'paper': 'Papier/Carton',
      'glass': 'Verre',
      'metal': 'Métal',
      'electronic': 'Électronique',
      'hazardous': 'Dangereux',
      'mixed': 'Mixte'
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'pending': 'En attente',
      'scheduled': 'Programmée',
      'in_progress': 'En cours',
      'completed': 'Terminée',
      'cancelled': 'Annulée'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const calculateDistance = (from: [number, number], to: [number, number]) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (to[1] - from[1]) * Math.PI / 180;
    const dLon = (to[0] - from[0]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(from[1] * Math.PI / 180) * Math.cos(to[1] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const optimizeRoute = () => {
    if (!collectorLocation || assignedRequests.length <= 1) return;

    // Algorithme simple du plus proche voisin pour optimiser la route
    const unvisited = [...assignedRequests];
    const optimized: WasteRequest[] = [];
    let currentLocation = collectorLocation;

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      unvisited.forEach((request, index) => {
        if (request.coordinates) {
          const distance = calculateDistance(currentLocation, request.coordinates.coordinates);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
          }
        }
      });

      const nearest = unvisited.splice(nearestIndex, 1)[0];
      optimized.push(nearest);
      if (nearest.coordinates) {
        currentLocation = nearest.coordinates.coordinates;
      }
    }

    setRouteOptimized(true);
    // Ici vous pourriez mettre à jour l'ordre des demandes
    console.log('Route optimisée:', optimized.map(r => r.address));
  };

  const totalWeight = assignedRequests.reduce((sum, req) => sum + req.estimatedWeight, 0);
  const completedCount = assignedRequests.filter(req => req.status === 'completed').length;
  const inProgressCount = assignedRequests.filter(req => req.status === 'in_progress').length;
  const scheduledCount = assignedRequests.filter(req => req.status === 'scheduled').length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total collectes</p>
                <p className="text-2xl font-bold">{assignedRequests.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-green-600">{inProgressCount}</p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminées</p>
                <p className="text-2xl font-bold text-gray-600">{completedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Poids total</p>
                <p className="text-2xl font-bold">{totalWeight.toFixed(1)}kg</p>
              </div>
              <Weight className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carte principale avec contrôles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Carte des collectes
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={optimizeRoute}
                disabled={assignedRequests.length <= 1}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Optimiser route
              </Button>
              {routeOptimized && (
                <Badge variant="secondary">Route optimisée</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CollectamMap
            markers={mapMarkers}
            center={collectorLocation}
            onMarkerClick={(marker) => {
              if (marker.type === 'waste-request') {
                setSelectedRequest(marker.data);
              }
            }}
            showUserLocation={false}
            realTimeTracking={false}
            height="600px"
            style="streets"
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Liste des collectes */}
      <Card>
        <CardHeader>
          <CardTitle>Collectes assignées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedRequests.map((request, index) => (
              <div
                key={request._id}
                className={`p-4 border rounded-lg ${
                  request.status === 'in_progress' ? 'border-green-500 bg-green-50' :
                  request.status === 'completed' ? 'border-gray-300 bg-gray-50' :
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {request.userId.firstName} {request.userId.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{request.address}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusLabel(request.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm font-medium">{getWasteTypeLabel(request.wasteType)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Poids</p>
                    <p className="text-sm font-medium">{request.estimatedWeight}kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Heure</p>
                    <p className="text-sm font-medium">{request.preferredTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="text-sm font-medium">
                      {collectorLocation && request.coordinates ? 
                        `${calculateDistance(collectorLocation, request.coordinates.coordinates).toFixed(1)} km` :
                        'N/A'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {request.status === 'scheduled' && (
                    <Button
                      size="sm"
                      onClick={() => onStartCollection?.(request._id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Commencer
                    </Button>
                  )}
                  
                  {request.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => onCompleteCollection?.(request._id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Terminer
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => request.coordinates && onNavigateToLocation?.(
                      request.coordinates.coordinates, 
                      request.address
                    )}
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Navigation
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`tel:${request.userId.phone}`)}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Appeler
                  </Button>
                </div>
              </div>
            ))}

            {assignedRequests.length === 0 && (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune collecte assignée
                </h3>
                <p className="text-gray-500">
                  Les nouvelles collectes assignées apparaîtront ici.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectorRouteMap;
