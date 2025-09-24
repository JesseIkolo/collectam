"use client";

import React, { useState, useEffect, useMemo } from 'react';
import CollectamMap, { MapMarker, RouteLayer } from './CollectamMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Weight, 
  Phone, 
  MessageSquare,
  Route as RouteIcon,
  CheckCircle,
  AlertTriangle,
  Play
} from 'lucide-react';
import { routingService, RoutePoint } from '@/services/RoutingService';

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
    phone?: string;
  };
  preferredTime?: string;
  estimatedWeight: number;
  description: string;
  createdAt: string;
  scheduledDate?: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
}

interface CollectorRouteMapProps {
  assignedRequests: WasteRequest[];
  collectorLocation?: [number, number];
  onStartCollection?: (requestId: string) => void;
  onCompleteCollection?: (requestId: string) => void;
  onNavigateToLocation?: (coordinates: [number, number], address: string) => void;
  className?: string;
  center?: [number, number];
  highlightMarkerId?: string;
}

const CollectorRouteMap: React.FC<CollectorRouteMapProps> = ({
  assignedRequests,
  collectorLocation,
  onStartCollection,
  onCompleteCollection,
  onNavigateToLocation,
  className = '',
  center,
  highlightMarkerId
}) => {
  const [selectedRequest, setSelectedRequest] = useState<WasteRequest | null>(null);
  const [routeOptimized, setRouteOptimized] = useState(false);
  const [routeLayers, setRouteLayers] = useState<RouteLayer[]>([]);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  // Assurer l'unicité des demandes par _id afin d'éviter les clés React dupliquées et les marqueurs en double
  const uniqueAssignedRequests = useMemo(() => {
    const map = new Map<string, WasteRequest>();
    (assignedRequests || []).forEach((r) => {
      if (r && r._id && !map.has(r._id)) {
        map.set(r._id, r);
      }
    });
    return Array.from(map.values());
  }, [assignedRequests]);

  // Hoisted helpers to avoid TDZ issues in useMemo
  function getUrgencyLabel(urgency: string) {
    const labels: { [key: string]: string } = {
      'low': 'Faible',
      'medium': 'Moyenne',
      'high': 'Élevée',
      'urgent': 'Urgent'
    };
    return labels[urgency] || urgency;
  }

  function getStatusLabel(status: string) {
    const labels: { [key: string]: string } = {
      'pending': 'En attente',
      'scheduled': 'Programmé',
      'in_progress': 'En cours',
      'completed': 'Terminé',
      'cancelled': 'Annulé'
    };
    return labels[status] || status;
  }

  function getWasteTypeLabel(type: string) {
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
  }

  const mapMarkers = useMemo(() => {
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

    // Marqueurs pour les demandes assignées (uniques)
    uniqueAssignedRequests.forEach((request, index) => {
      if (request.coordinates) {
        markers.push({
          id: `request-${request._id}`,
          coordinates: request.coordinates.coordinates,
          type: 'waste-request',
          status: request.status,
          data: request,
          popup: {
            title: `${getWasteTypeLabel(request.wasteType)}`,
            content: `
              <div class="space-y-2">
                <p><strong>Client:</strong> ${request.userId.firstName} ${request.userId.lastName}</p>
                <p><strong>Adresse:</strong> ${request.address}</p>
                <p><strong>Poids estimé:</strong> ${request.estimatedWeight}kg</p>
                <p><strong>Urgence:</strong> ${getUrgencyLabel(request.urgency)}</p>
                <p><strong>Statut:</strong> ${getStatusLabel(request.status)}</p>
                ${request.description ? `<p><strong>Description:</strong> ${request.description}</p>` : ''}
              </div>
            `,
            actions: [
              {
                label: 'Naviguer',
                onClick: () => {
                  if (onNavigateToLocation) {
                    onNavigateToLocation(request.coordinates!.coordinates, request.address);
                  }
                },
                variant: 'primary'
              },
              ...(request.status === 'scheduled' ? [{
                label: 'Démarrer collecte',
                onClick: () => {
                  if (onStartCollection) {
                    onStartCollection(request._id);
                  }
                },
                variant: 'primary' as const
              }] : []),
              ...(request.status === 'in_progress' ? [{
                label: 'Terminer collecte',
                onClick: () => {
                  if (onCompleteCollection) {
                    onCompleteCollection(request._id);
                  }
                },
                variant: 'primary' as const
              }] : [])
            ]
          }
        });
      }
    });

    return markers;
  }, [uniqueAssignedRequests, collectorLocation, onNavigateToLocation, onStartCollection, onCompleteCollection]);

  

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

  // Fonction utilitaire pour calculer la distance entre deux points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculer et afficher l'itinéraire optimisé avec algorithme avancé
  const calculateOptimizedRoute = async () => {
    if (!collectorLocation || uniqueAssignedRequests.length === 0) return;

    setIsCalculatingRoute(true);
    
    try {
      // Préparer les points pour le calcul d'itinéraire
      const startPoint: RoutePoint = {
        coordinates: collectorLocation,
        address: 'Position collecteur'
      };

      const pendingRequests = uniqueAssignedRequests.filter(req => 
        req.coordinates && req.status !== 'completed'
      );

      if (pendingRequests.length === 0) {
        setIsCalculatingRoute(false);
        return;
      }

      console.log('🛣️ Calcul itinéraire optimisé pour', pendingRequests.length, 'points');

      // Optimisation locale avec algorithme du plus proche voisin amélioré
      const optimizedOrder = await optimizeRouteOrder(startPoint, pendingRequests);
      
      // Créer les waypoints dans l'ordre optimisé
      const waypoints: RoutePoint[] = optimizedOrder.map(req => ({
        coordinates: req.coordinates!.coordinates,
        address: req.address
      }));

      // Calculer l'itinéraire avec l'ordre optimisé
      const route = await routingService.getOptimizedRoute(startPoint, waypoints);

      if (route) {
        // Créer plusieurs couches pour un affichage plus riche
        const routeLayers: RouteLayer[] = [
          // Route principale
          {
            id: 'optimized-route',
            coordinates: route.geometry.coordinates,
            color: '#10B981', // Vert
            width: 5,
            opacity: 0.8
          },
          // Route en pointillés pour l'effet
          {
            id: 'route-outline',
            coordinates: route.geometry.coordinates,
            color: '#065F46', // Vert foncé
            width: 7,
            opacity: 0.4
          }
        ];

        setRouteLayers(routeLayers);
        setRouteOptimized(true);

        console.log('✅ Itinéraire optimisé calculé:', {
          distance: routingService.formatDistance(route.distance),
          duration: routingService.formatDuration(route.duration),
          waypoints: waypoints.length,
          estimatedSavings: calculateRouteSavings(pendingRequests, optimizedOrder)
        });
      } else {
        console.warn('⚠️ Impossible de calculer l\'itinéraire');
      }
    } catch (error) {
      console.error('❌ Erreur calcul itinéraire:', error);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Algorithme d'optimisation de route amélioré
  const optimizeRouteOrder = async (startPoint: RoutePoint, requests: WasteRequest[]): Promise<WasteRequest[]> => {
    if (requests.length <= 1) return requests;

    // Prioriser par urgence et poids
    const prioritizedRequests = [...requests].sort((a, b) => {
      const urgencyWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
      const urgencyDiff = urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
      
      if (urgencyDiff !== 0) return urgencyDiff;
      
      // Si même urgence, prioriser les plus lourds
      return b.estimatedWeight - a.estimatedWeight;
    });

    // Algorithme du plus proche voisin avec optimisation locale
    const optimized: WasteRequest[] = [];
    const remaining = [...prioritizedRequests];
    let currentLocation = startPoint.coordinates;

    // Toujours commencer par la demande la plus urgente
    const mostUrgent = remaining.shift()!;
    optimized.push(mostUrgent);
    currentLocation = mostUrgent.coordinates!.coordinates;

    // Optimiser le reste avec plus proche voisin
    while (remaining.length > 0) {
      let nearest = remaining[0];
      let nearestDistance = calculateDistance(
        currentLocation[1], currentLocation[0],
        nearest.coordinates!.coordinates[1], nearest.coordinates!.coordinates[0]
      );

      for (let i = 1; i < remaining.length; i++) {
        const request = remaining[i];
        const distance = calculateDistance(
          currentLocation[1], currentLocation[0],
          request.coordinates!.coordinates[1], request.coordinates!.coordinates[0]
        );

        // Pondérer par distance ET urgence
        const urgencyBonus = request.urgency === 'urgent' ? 0.5 : 
                           request.urgency === 'high' ? 0.7 : 1.0;
        const weightedDistance = distance * urgencyBonus;

        if (weightedDistance < nearestDistance * (nearest.urgency === 'urgent' ? 0.5 : 
                                                 nearest.urgency === 'high' ? 0.7 : 1.0)) {
          nearest = request;
          nearestDistance = distance;
        }
      }

      optimized.push(nearest);
      remaining.splice(remaining.indexOf(nearest), 1);
      currentLocation = nearest.coordinates!.coordinates;
    }

    return optimized;
  };

  // Calculer les économies de l'optimisation
  const calculateRouteSavings = (original: WasteRequest[], optimized: WasteRequest[]): string => {
    if (original.length !== optimized.length) return '0%';

    const originalDistance = calculateTotalDistance(original);
    const optimizedDistance = calculateTotalDistance(optimized);
    
    const savings = ((originalDistance - optimizedDistance) / originalDistance) * 100;
    return `${Math.max(0, savings).toFixed(1)}%`;
  };

  // Calculer la distance totale d'une route
  const calculateTotalDistance = (requests: WasteRequest[]): number => {
    if (!collectorLocation || requests.length === 0) return 0;

    let totalDistance = 0;
    let currentLocation = collectorLocation;

    for (const request of requests) {
      if (request.coordinates) {
        const distance = calculateDistance(
          currentLocation[1], currentLocation[0],
          request.coordinates.coordinates[1], request.coordinates.coordinates[0]
        );
        totalDistance += distance;
        currentLocation = request.coordinates.coordinates;
      }
    }

    return totalDistance;
  };

  // Fonction de compatibilité pour l'ancien bouton
  const optimizeRoute = calculateOptimizedRoute;

  const totalWeight = uniqueAssignedRequests.reduce((sum, req) => sum + req.estimatedWeight, 0);
  const completedCount = uniqueAssignedRequests.filter(req => req.status === 'completed').length;
  const inProgressCount = uniqueAssignedRequests.filter(req => req.status === 'in_progress').length;
  const scheduledCount = uniqueAssignedRequests.filter(req => req.status === 'scheduled').length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total collectes</p>
                <p className="text-2xl font-bold">{uniqueAssignedRequests.length}</p>
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
              <RouteIcon className="h-5 w-5" />
              Carte des collectes
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={optimizeRoute}
                disabled={uniqueAssignedRequests.length <= 1 || isCalculatingRoute}
              >
                {isCalculatingRoute ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                    Calcul...
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 mr-2" />
                    Optimiser route
                  </>
                )}
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
            routes={routeLayers}
            center={center || collectorLocation}
            highlightMarkerId={highlightMarkerId}
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
            {uniqueAssignedRequests.map((request, index) => (
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
                        `${calculateDistance(
                          collectorLocation[1], collectorLocation[0],
                          request.coordinates.coordinates[1], request.coordinates.coordinates[0]
                        ).toFixed(1)} km` :
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
