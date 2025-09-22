"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageSquare, Clock, MapPin, Truck, MessageCircle } from 'lucide-react';
import CollectamMap, { MapMarker } from './CollectamMap';
import { locationService } from '@/services/LocationService';

interface WasteRequest {
  _id: string;
  wasteType: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  address: string;
  coordinates?: {
    coordinates: [number, number];
  };
  assignedCollector?: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    lastLocation?: {
      coordinates: [number, number];
    };
  };
  preferredDate: string;
  preferredTime: string;
  estimatedWeight: number;
  description: string;
}

interface HouseholdTrackingMapProps {
  wasteRequests: WasteRequest[];
  onRequestSelect?: (request: WasteRequest) => void;
  className?: string;
}

const HouseholdTrackingMap: React.FC<HouseholdTrackingMapProps> = ({
  wasteRequests,
  onRequestSelect,
  className = ''
}) => {
  const [selectedRequest, setSelectedRequest] = useState<WasteRequest | null>(null);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [collectorETAs, setCollectorETAs] = useState<Record<string, { distance: number; eta: number; etaText: string }>>({});

  // Calculer les ETAs pour les collecteurs assignés
  useEffect(() => {
    const calculateETAs = async () => {
      const newETAs: Record<string, { distance: number; eta: number; etaText: string }> = {};

      for (const request of wasteRequests) {
        if (request.assignedCollector && 
            request.assignedCollector.lastLocation && 
            request.coordinates &&
            (request.status === 'scheduled' || request.status === 'in_progress')) {
          
          try {
            // Récupérer la position actuelle du collecteur
            const collectorLocation = await locationService.getCollectorLocation(request.assignedCollector._id);
            
            // Calculer l'ETA
            const etaData = locationService.calculateETA(
              collectorLocation.location.coordinates[1], // latitude
              collectorLocation.location.coordinates[0], // longitude
              request.coordinates.coordinates[1], // destination latitude
              request.coordinates.coordinates[0]  // destination longitude
            );

            newETAs[request._id] = etaData;
          } catch (error) {
            console.error('❌ Erreur calcul ETA pour', request._id, error);
            // Fallback vers le calcul avec la dernière position connue
            if (request.assignedCollector.lastLocation) {
              const etaData = locationService.calculateETA(
                request.assignedCollector.lastLocation.coordinates[1],
                request.assignedCollector.lastLocation.coordinates[0],
                request.coordinates.coordinates[1],
                request.coordinates.coordinates[0]
              );
              newETAs[request._id] = etaData;
            }
          }
        }
      }

      setCollectorETAs(newETAs);
    };

    if (wasteRequests.length > 0) {
      calculateETAs();
      
      // Mettre à jour les ETAs toutes les 30 secondes
      const etaInterval = setInterval(calculateETAs, 30000);
      return () => clearInterval(etaInterval);
    }
  }, [wasteRequests]);

  // Conversion des demandes en marqueurs de carte
  useEffect(() => {
    const markers: MapMarker[] = [];

    wasteRequests.forEach(request => {
      // Marqueur pour la demande de collecte
      if (request.coordinates) {
        markers.push({
          id: `request-${request._id}`,
          coordinates: request.coordinates.coordinates,
          type: 'waste-request',
          status: request.status,
          data: request,
          popup: {
            title: `Collecte ${getWasteTypeLabel(request.wasteType)}`,
            content: `
              <div class="space-y-2">
                <p><strong>Status:</strong> ${getStatusLabel(request.status)}</p>
                <p><strong>Adresse:</strong> ${request.address}</p>
                <p><strong>Poids:</strong> ${request.estimatedWeight}kg</p>
                <p><strong>Date prévue:</strong> ${new Date(request.preferredDate).toLocaleDateString('fr-FR')} à ${request.preferredTime}</p>
                ${request.assignedCollector ? `
                  <p><strong>Collecteur:</strong> ${request.assignedCollector.firstName} ${request.assignedCollector.lastName}</p>
                  ${collectorETAs[request._id] ? `
                    <p><strong>Distance:</strong> ${collectorETAs[request._id].distance} km</p>
                    <p><strong>ETA:</strong> ${collectorETAs[request._id].etaText}</p>
                  ` : ''}
                ` : ''}
              </div>
            `,
            actions: [
              {
                label: 'Voir détails',
                onClick: () => {
                  setSelectedRequest(request);
                  onRequestSelect?.(request);
                },
                variant: 'primary'
              }
            ]
          }
        });
      }

      // Marqueur pour le collecteur assigné (si en cours)
      if (request.assignedCollector && 
          request.assignedCollector.lastLocation && 
          (request.status === 'scheduled' || request.status === 'in_progress')) {
        
        markers.push({
          id: `collector-${request.assignedCollector._id}`,
          coordinates: request.assignedCollector.lastLocation.coordinates,
          type: 'collector',
          data: request.assignedCollector,
          popup: {
            title: `Collecteur ${request.assignedCollector.firstName} ${request.assignedCollector.lastName}`,
            content: `
              <div class="space-y-2">
                <p><strong>Status:</strong> ${request.status === 'in_progress' ? 'En route vers vous' : 'Assigné à votre collecte'}</p>
                <p><strong>Téléphone:</strong> ${request.assignedCollector.phone}</p>
                <p><strong>Collecte:</strong> ${getWasteTypeLabel(request.wasteType)}</p>
              </div>
            `,
            actions: [
              {
                label: 'Appeler',
                onClick: () => window.open(`tel:${request.assignedCollector?.phone}`),
                variant: 'primary'
              },
              {
                label: 'Message',
                onClick: () => window.open(`sms:${request.assignedCollector?.phone}`),
                variant: 'secondary'
              }
            ]
          }
        });
      }
    });

    setMapMarkers(markers);
  }, [wasteRequests]);

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

  const calculateETA = (collectorLocation: [number, number], requestLocation: [number, number]) => {
    // Calcul approximatif de distance (formule haversine simplifiée)
    const R = 6371; // Rayon de la Terre en km
    const dLat = (requestLocation[1] - collectorLocation[1]) * Math.PI / 180;
    const dLon = (requestLocation[0] - collectorLocation[0]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(collectorLocation[1] * Math.PI / 180) * Math.cos(requestLocation[1] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Estimation du temps (vitesse moyenne 30 km/h en ville)
    const timeInHours = distance / 30;
    const timeInMinutes = Math.round(timeInHours * 60);
    
    return { distance: distance.toFixed(1), eta: timeInMinutes };
  };

  const activeRequests = wasteRequests.filter(r => 
    r.status === 'scheduled' || r.status === 'in_progress'
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Carte principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Suivi de vos collectes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CollectamMap
            markers={mapMarkers}
            onMarkerClick={(marker) => {
              if (marker.type === 'waste-request') {
                setSelectedRequest(marker.data);
                onRequestSelect?.(marker.data);
              }
            }}
            showUserLocation={true}
            realTimeTracking={true}
            height="500px"
            style="streets"
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Informations des collectes actives */}
      {activeRequests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeRequests.map(request => (
            <Card key={request._id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Collecte {getWasteTypeLabel(request.wasteType)}
                  </CardTitle>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusLabel(request.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {request.address}
                </div>

                {request.assignedCollector && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span className="font-medium">
                        {request.assignedCollector.firstName} {request.assignedCollector.lastName}
                      </span>
                    </div>

                    {collectorETAs[request._id] && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span className="text-sm">
                              ETA: {collectorETAs[request._id].etaText} ({collectorETAs[request._id].distance} km)
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`tel:${request.assignedCollector?.phone}`)}
                            >
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`sms:${request.assignedCollector?.phone}`)}
                            >
                              <MessageCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  Programmé le {new Date(request.preferredDate).toLocaleDateString('fr-FR')} à {request.preferredTime}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Message si aucune collecte active */}
      {activeRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune collecte en cours
            </h3>
            <p className="text-gray-500">
              Vos prochaines collectes apparaîtront ici avec le suivi en temps réel.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HouseholdTrackingMap;
