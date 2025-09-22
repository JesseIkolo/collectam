"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { locationService } from "@/services/LocationService";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Package, 
  Route, 
  Truck, 
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { InteractiveMap } from "@/components/maps/InteractiveMap";
import CollectorRouteMap from "@/components/maps/CollectorRouteMap";

interface CollectionPoint {
  id: string;
  address: string;
  wasteType: string;
  priority: 'high' | 'medium' | 'low';
  estimatedWeight: number;
  status: 'pending' | 'in_progress' | 'completed';
  coordinates: [number, number];
  timeSlot: string;
  distance: number;
}

export default function CollectorMapPage() {
  const [collections, setCollections] = useState<CollectionPoint[]>([]);

  const [currentLocation, setCurrentLocation] = useState<[number, number]>([9.7043, 4.0511]);
  const [selectedCollection, setSelectedCollection] = useState<CollectionPoint | null>(null);
  const [assignedRequests, setAssignedRequests] = useState<any[]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Play className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const startCollection = (collectionId: string) => {
    setCollections(prev => prev.map(c => 
      c.id === collectionId ? { ...c, status: 'in_progress' as const } : c
    ));
  };

  const completeCollection = (collectionId: string) => {
    setCollections(prev => prev.map(c => 
      c.id === collectionId ? { ...c, status: 'completed' as const } : c
    ));
  };

  const pendingCollections = collections.filter(c => c.status === 'pending');
  const inProgressCollections = collections.filter(c => c.status === 'in_progress');
  const completedCollections = collections.filter(c => c.status === 'completed');

  // Obtenir et synchroniser la position réelle du collecteur
  useEffect(() => {
    let isActive = true;

    const updateLocation = async () => {
      try {
        // Obtenir la position GPS
        const position = await locationService.getCurrentPosition();
        
        if (!isActive) return;

        // Mettre à jour l'état local
        setCurrentLocation([position.longitude, position.latitude]);
        setLocationError(null);

        // Envoyer la position au serveur
        await locationService.updateCollectorLocation(position);
        
        console.log('📍 Position collecteur synchronisée:', position);
      } catch (error) {
        console.error('❌ Erreur synchronisation position:', error);
        setLocationError(error instanceof Error ? error.message : 'Erreur de géolocalisation');
      }
    };

    // Mise à jour initiale
    updateLocation();

    // Mettre à jour la position toutes les 30 secondes
    const locationInterval = setInterval(updateLocation, 30000);

    // Démarrer le suivi en temps réel
    locationService.startWatchingPosition(
      async (position) => {
        if (!isActive) return;
        
        setCurrentLocation([position.longitude, position.latitude]);
        setLocationError(null);

        // Envoyer la nouvelle position au serveur
        try {
          await locationService.updateCollectorLocation(position);
          console.log('📍 Position temps réel synchronisée:', position);
        } catch (error) {
          console.error('❌ Erreur sync temps réel:', error);
        }
      },
      (error) => {
        if (!isActive) return;
        setLocationError(error);
      }
    );

    return () => {
      isActive = false;
      clearInterval(locationInterval);
      locationService.stopWatchingPosition();
    };
  }, []);

  // Convertir les collections en format pour CollectorRouteMap
  useEffect(() => {
    const wasteRequestsForMap = collections.map((collection) => ({
      _id: collection.id,
      wasteType: collection.wasteType.toLowerCase(),
      status: collection.status,
      address: collection.address,
      coordinates: {
        coordinates: [collection.coordinates[0], collection.coordinates[1]]
      },
      userId: {
        _id: `user-${collection.id}`,
        firstName: 'Client',
        lastName: `#${collection.id}`,
        phone: '+237123456789'
      },
      preferredDate: new Date().toISOString(),
      preferredTime: collection.timeSlot,
      estimatedWeight: collection.estimatedWeight,
      description: `Collecte de ${collection.wasteType}`
    }));
    setAssignedRequests(wasteRequestsForMap);
  }, [collections]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Carte Temps Réel</h1>
          <p className="text-muted-foreground">
            Navigation et gestion des collectes en cours
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Actualiser
          </Button>
          <Badge variant="default" className="flex items-center gap-1">
            <Truck className="h-3 w-3" />
            En tournée
          </Badge>
          {locationError ? (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              GPS Erreur
            </Badge>
          ) : (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              GPS Actif
            </Badge>
          )}
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCollections.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCollections.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCollections.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distance totale</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {collections.reduce((sum, c) => sum + c.distance, 0).toFixed(1)} km
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carte de Route Interactive MapTiler */}
      <CollectorRouteMap 
        assignedRequests={assignedRequests}
        collectorLocation={currentLocation}
        onStartCollection={(requestId) => {
          console.log('Démarrer collecte:', requestId);
          startCollection(requestId);
        }}
        onCompleteCollection={(requestId) => {
          console.log('Terminer collecte:', requestId);
          completeCollection(requestId);
        }}
        onNavigateToLocation={(coordinates, address) => {
          console.log('Navigation vers:', address, coordinates);
          // Ouvrir l'application de navigation native
          const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}`;
          window.open(url, '_blank');
        }}
        className="mb-6"
      />

      <div className="grid gap-6 lg:grid-cols-1">

        {/* Liste des collectes */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Collectes du jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {collections.map((collection) => (
                  <div 
                    key={collection.id} 
                    className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedCollection?.id === collection.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedCollection(collection)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{collection.address}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {collection.wasteType}
                          </Badge>
                          <Badge 
                            variant={collection.priority === 'high' ? 'destructive' : 
                                   collection.priority === 'medium' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {collection.priority === 'high' ? 'Urgent' : 
                             collection.priority === 'medium' ? 'Normal' : 'Faible'}
                          </Badge>
                        </div>
                      </div>
                      {getStatusIcon(collection.status)}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {collection.timeSlot}
                      </span>
                      <span>{collection.estimatedWeight} kg</span>
                      <span>{collection.distance} km</span>
                    </div>
                    
                    {collection.status === 'pending' && (
                      <Button 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          startCollection(collection.id);
                        }}
                      >
                        Démarrer collecte
                      </Button>
                    )}
                    
                    {collection.status === 'in_progress' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          completeCollection(collection.id);
                        }}
                      >
                        Marquer terminée
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
