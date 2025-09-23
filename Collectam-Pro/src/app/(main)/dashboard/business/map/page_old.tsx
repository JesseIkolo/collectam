"use client";

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Truck, 
  Users, 
  RefreshCw,
  Package,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import HouseholdTrackingMap from '@/components/maps/HouseholdTrackingMap';
import { wasteRequestService } from '@/services/WasteRequestService';

interface BusinessMapData {
  collectors: BusinessCollector[];
  vehicles: BusinessVehicle[];
  wasteRequests: WasteRequest[];
}

interface BusinessCollector {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'actif' | 'inactif' | 'suspendu';
  position: string;
  workZone?: string;
  lastLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface BusinessVehicle {
  _id: string;
  licensePlate: string;
  brand: string;
  model: string;
  vehicleType: string;
  status: 'actif' | 'inactif' | 'maintenance' | 'hors_service';
  assignedCollectorId?: string;
  lastLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface WasteRequest {
  _id: string;
  wasteType: string;
  status: string;
  address: string;
  coordinates: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: string;
  assignedCollector?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}


export default function BusinessMapPage() {
  const [businessData, setBusinessData] = useState<BusinessMapData>({
    collectors: [],
    vehicles: [],
    wasteRequests: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalCollectors: 0,
    activeCollectors: 0,
    totalVehicles: 0,
    activeRequests: 0
  });

  useEffect(() => {
    loadBusinessMapData();
    // Refresh every 30 seconds
    const interval = setInterval(loadBusinessMapData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadBusinessMapData = async () => {
    try {
      setRefreshing(true);
      console.log('🏢 Chargement des données carte business...');
      
      // Charger les collecteurs business
      const collectorsResponse = await fetch('/api/business-collectors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      const collectorsData = collectorsResponse.ok ? 
        (await collectorsResponse.json()).data || [] : [];
      
      // Charger les demandes assignées aux collecteurs business
      const requestsData = await loadBusinessWasteRequests(collectorsData);
      
      // Calculer les statistiques
      const activeCollectors = collectorsData.filter((c: BusinessCollector) => c.status === 'actif').length;
      const activeRequests = requestsData.filter((r: WasteRequest) => 
        ['pending', 'scheduled', 'in_progress'].includes(r.status)
      ).length;
      
      setBusinessData({
        collectors: collectorsData,
        vehicles: [], // TODO: Charger les véhicules business
        wasteRequests: requestsData
      });
      
      setStats({
        totalCollectors: collectorsData.length,
        activeCollectors,
        totalVehicles: 0,
        activeRequests
      });
      
      console.log(`📊 Données business: ${collectorsData.length} collecteurs, ${requestsData.length} demandes`);
      
    } catch (error) {
      console.error('❌ Erreur chargement données business:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadBusinessWasteRequests = async (collectors: BusinessCollector[]) => {
    try {
      // Récupérer toutes les demandes assignées aux collecteurs business
      const collectorIds = collectors.map(c => c._id);
      
      if (collectorIds.length === 0) return [];
      
      const response = await fetch('/api/waste-collection-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) return [];
      
      const allRequests = (await response.json()).data || [];
      
      // Filtrer les demandes assignées aux collecteurs business
      const businessRequests = allRequests.filter((request: any) => 
        request.assignedCollector && 
        collectorIds.includes(request.assignedCollector._id || request.assignedCollector)
      );
      
      return businessRequests;
    } catch (error) {
      console.error('❌ Erreur chargement demandes business:', error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
            Carte Business - Temps Réel
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Suivez vos collecteurs et les demandes assignées
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={loadBusinessMapData}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Collecteurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCollectors}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeCollectors} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Véhicules</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              À venir
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes Actives</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRequests}</div>
            <p className="text-xs text-muted-foreground">
              En cours de traitement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de Réponse</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h 15min</div>
            <p className="text-xs text-muted-foreground">
              Temps moyen
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Carte Interactive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Carte Interactive Business
          </CardTitle>
          <CardDescription>
            Suivi en temps réel de vos collecteurs et demandes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] rounded-lg overflow-hidden">
            <HouseholdTrackingMap 
              wasteRequests={businessData.wasteRequests}
              onRequestSelect={(request) => console.log('Request selected:', request)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des Demandes */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes Assignées à Mes Collecteurs</CardTitle>
          <CardDescription>
            Liste des collectes en cours avec vos employés
          </CardDescription>
        </CardHeader>
        <CardContent>
          {businessData.wasteRequests.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 mb-2">Aucune demande assignée</p>
              <p className="text-sm text-gray-400">
                Les demandes assignées à vos collecteurs apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {businessData.wasteRequests.map((request) => (
                <div key={request._id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{request.wasteType}</h4>
                      <p className="text-sm text-muted-foreground">{request.address}</p>
                    </div>
                    <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                      {request.status}
                    </Badge>
                  </div>
                  {request.assignedCollector && (
                    <div className="text-sm text-muted-foreground">
                      Assigné à: {request.assignedCollector.firstName} {request.assignedCollector.lastName}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
    return (
      <Badge className={`${colors[priority as keyof typeof colors]} text-xs`}>
        {priority === 'high' ? 'Urgent' : priority === 'medium' ? 'Moyen' : 'Faible'}
      </Badge>
    );
  };

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicleFilter === 'all' || vehicle.status === vehicleFilter
  );

  const filteredCollectors = collectors.filter(collector => 
    collectorFilter === 'all' || collector.status === collectorFilter
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded mb-4"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Carte en Temps Réel</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Suivez votre flotte et les collectes en temps réel
          </p>
        </div>
        <Button onClick={loadMapData} variant="outline" className="w-full sm:w-auto">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Map Container */}
      <Card className="h-96">
        <CardContent className="p-0 h-full">
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
            <div className="text-center">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Carte Interactive</h3>
              <p className="text-gray-500 mb-4">
                Intégration avec Google Maps ou OpenStreetMap à venir
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Véhicules actifs ({filteredVehicles.filter(v => v.status === 'active').length})
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Collecteurs en ligne ({filteredCollectors.filter(c => c.status === 'online').length})
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Points en attente ({collectionPoints.filter(p => p.status === 'pending').length})
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres et Affichage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Affichage</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-vehicles"
                    checked={showVehicles}
                    onCheckedChange={setShowVehicles}
                  />
                  <Label htmlFor="show-vehicles" className="text-sm">Véhicules</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-collectors"
                    checked={showCollectors}
                    onCheckedChange={setShowCollectors}
                  />
                  <Label htmlFor="show-collectors" className="text-sm">Collecteurs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-points"
                    checked={showCollectionPoints}
                    onCheckedChange={setShowCollectionPoints}
                  />
                  <Label htmlFor="show-points" className="text-sm">Points de collecte</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Filtre Véhicules</Label>
              <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Filtre Collecteurs</Label>
              <Select value={collectorFilter} onValueChange={setCollectorFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="online">En ligne</SelectItem>
                  <SelectItem value="offline">Hors ligne</SelectItem>
                  <SelectItem value="break">En pause</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Suivi Véhicule</Label>
              <Select value={selectedVehicle || 'none'} onValueChange={(value) => setSelectedVehicle(value === 'none' ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Lists */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Véhicules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Véhicules ({filteredVehicles.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{vehicle.licensePlate}</p>
                    <p className="text-sm text-muted-foreground truncate">{vehicle.type}</p>
                  </div>
                  {getStatusBadge(vehicle.status, 'vehicle')}
                </div>
                
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="text-muted-foreground truncate">{vehicle.location.address}</span>
                  </div>
                  
                  {vehicle.collector && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 flex-shrink-0" />
                      <span className="text-muted-foreground truncate">{vehicle.collector.name}</span>
                    </div>
                  )}
                  
                  {vehicle.route && (
                    <div className="flex items-center gap-1">
                      <Route className="w-3 h-3 flex-shrink-0" />
                      <span className="text-muted-foreground text-xs truncate">
                        Arrêt {vehicle.route.currentStop}/{vehicle.route.totalStops} 
                        - Fin prévue: {vehicle.route.estimatedCompletion}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Collecteurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Collecteurs ({filteredCollectors.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {filteredCollectors.map((collector) => (
              <div key={collector.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{collector.name}</p>
                    <p className="text-sm text-muted-foreground">{collector.phone}</p>
                  </div>
                  {getStatusBadge(collector.status, 'collector')}
                </div>
                
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="text-muted-foreground">{collector.location.address}</span>
                  </div>
                  
                  {collector.assignedVehicle && (
                    <div className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span className="text-muted-foreground">Véhicule: {collector.assignedVehicle}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Points de Collecte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Points de Collecte ({collectionPoints.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {collectionPoints.map((point) => (
              <div key={point.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{point.address}</p>
                    <p className="text-xs text-muted-foreground">
                      {point.scheduledTime} • {point.estimatedDuration}min • {point.wasteType}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {getStatusBadge(point.status, 'point')}
                    {getPriorityBadge(point.priority)}
                  </div>
                </div>
                
                {point.assignedVehicle && (
                  <div className="text-xs">
                    <div className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span className="text-muted-foreground">Assigné à: {point.assignedVehicle}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
