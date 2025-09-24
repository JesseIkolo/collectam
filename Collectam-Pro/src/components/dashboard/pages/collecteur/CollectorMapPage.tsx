"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { locationService } from "@/services/LocationService";
import { wasteRequestService } from "@/services/WasteRequestService";
import { useWebSocket } from "@/hooks/useWebSocket";
import { toast } from "sonner";
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
import { useSearchParams } from "next/navigation";

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
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
  const [recentlyCompleted, setRecentlyCompleted] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [banner, setBanner] = useState<{ type: 'started' | 'completed'; text: string } | null>(null);
  const bannerTimer = useRef<any>(null);

  // Combiner les demandes assignées et les terminées récemment, en supprimant les doublons par _id
  const combinedRequests = useMemo(() => {
    const map = new Map<string, any>();
    [...(assignedRequests || []), ...(recentlyCompleted || [])].forEach((r: any) => {
      if (r && r._id) {
        map.set(r._id, r);
      }
    });
    return Array.from(map.values());
  }, [assignedRequests, recentlyCompleted]);

  // Charger les demandes assignées au collecteur
  const loadAssignedRequests = async () => {
    try {
      console.log('🗑️ Chargement des demandes assignées au collecteur...');
      const requests = await wasteRequestService.getAssignedRequests();
      
      // Formatter les demandes pour la carte
      const formattedRequests = requests.map(request => ({
        ...request,
        // S'assurer que les coordonnées sont au bon format GeoJSON { coordinates: [lng, lat] }
        coordinates: request.coordinates && Array.isArray(request.coordinates.coordinates)
          ? { coordinates: request.coordinates.coordinates as [number, number] }
          : null
      }));
      
      setAssignedRequests(formattedRequests);
      console.log(`📋 ${formattedRequests.length} demandes assignées chargées`);
      
      // Log des coordonnées pour debug
      formattedRequests.forEach(req => {
        console.log(`- ${req._id}: ${req.wasteType} à ${req.address}, coords:`, req.coordinates);
      });
      
    } catch (error) {
      console.error('❌ Erreur chargement demandes assignées:', error);
      toast.error('Erreur lors du chargement des demandes assignées');
    } finally {
      setLoading(false);
    }
  };

  // Charger les demandes au montage du composant
  useEffect(() => {
    loadAssignedRequests();
    
    // Recharger toutes les 30 secondes pour le temps réel
    const interval = setInterval(loadAssignedRequests, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Rafraîchir manuellement les données et la position
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadAssignedRequests();
      try {
        const pos = await locationService.getCurrentPosition();
        setCurrentLocation([pos.longitude, pos.latitude]);
        await locationService.updateCollectorLocation(pos);
      } catch (e) {
        console.warn('⚠️ Impossible de mettre à jour la position lors du refresh');
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Center on focused request if provided
  useEffect(() => {
    const focusId = searchParams ? searchParams.get('focus') : null;
    if (focusId && Array.isArray(assignedRequests) && assignedRequests.length > 0) {
      const target = assignedRequests.find((r: any) => r._id === focusId && r.coordinates && r.coordinates.coordinates && Array.isArray(r.coordinates.coordinates));
      if (target && target.coordinates && target.coordinates.coordinates) {
        setMapCenter(target.coordinates.coordinates as [number, number]);
      }
    }
  }, [searchParams, assignedRequests]);

  // Intégration WebSocket pour notifications temps réel
  const { sendLocationUpdate } = useWebSocket({
    onNewWasteRequest: (data) => {
      console.log('🗑️ Nouvelle demande reçue:', data);
      toast.info(`Nouvelle collecte assignée: ${data.wasteType}`);
      // Rafraîchir la liste des demandes
      loadAssignedRequests();
    },
    onCollectionStarted: (data) => {
      console.log('▶️ Collecte démarrée:', data);
      toast.success('Collecte démarrée avec succès');
      loadAssignedRequests();
      try {
        if (bannerTimer.current) clearTimeout(bannerTimer.current);
        setBanner({ type: 'started', text: 'Collecte démarrée' });
        bannerTimer.current = setTimeout(() => setBanner(null), 4000);
      } catch {}
    },
    onCollectionCompleted: (data) => {
      console.log('✅ Collecte terminée:', data);
      toast.success('Collecte terminée avec succès');
      loadAssignedRequests();
      try {
        if (bannerTimer.current) clearTimeout(bannerTimer.current);
        setBanner({ type: 'completed', text: 'Collecte terminée' });
        bannerTimer.current = setTimeout(() => setBanner(null), 4000);
      } catch {}
    }
  });
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

  const startCollection = async (collectionId: string) => {
    try {
      // Call backend to mark as in_progress (server will broadcast WS event)
      await wasteRequestService.startCollection(collectionId);
      // Refresh assigned requests list
      await loadAssignedRequests();
      // Update local demo collections if any
      setCollections(prev => prev.map(c => 
        c.id === collectionId ? { ...c, status: 'in_progress' as const } : c
      ));
    } catch (e) {
      console.error('❌ Échec démarrage collecte:', e);
    }
  };

  const completeCollection = async (collectionId: string) => {
    try {
      // In a real flow we'd pass actual weight, here we keep it optional
      await wasteRequestService.completeCollection(collectionId, {});
      // Keep a temporary green marker on map for a few seconds
      const justCompleted = assignedRequests.find((r: any) => r._id === collectionId);
      if (justCompleted && justCompleted.coordinates) {
        const tmp = { ...justCompleted, status: 'completed' as const };
        setRecentlyCompleted(prev => [...prev, tmp]);
        setTimeout(() => {
          setRecentlyCompleted(prev => prev.filter((r) => r._id !== collectionId));
        }, 6000);
      }
      await loadAssignedRequests();
      setCollections(prev => prev.map(c => 
        c.id === collectionId ? { ...c, status: 'completed' as const } : c
      ));
    } catch (e) {
      console.error('❌ Échec finalisation collecte:', e);
    }
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
        // Émettre aussi via WebSocket pour temps réel household
        try {
          sendLocationUpdate([position.longitude, position.latitude], position.accuracy);
        } catch {}
        
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
          try { sendLocationUpdate([position.longitude, position.latitude], position.accuracy); } catch {}
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

  // NOTE: Suppression de l'override mock des collections pour éviter les doublons et conflits.

  return (
    <div className="space-y-6">
      {/* Bannières de succès */}
      {banner && (
        <Alert className={`${banner.type === 'completed' ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}`}>
          <AlertDescription>{banner.text}</AlertDescription>
        </Alert>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Carte Temps Réel</h1>
          <p className="text-muted-foreground">
            Navigation et gestion des collectes en cours
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RotateCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
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
        assignedRequests={combinedRequests}
        collectorLocation={currentLocation}
        center={mapCenter}
        highlightMarkerId={(searchParams && searchParams.get('focus')) ? `request-${searchParams.get('focus')}` : undefined}
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
