"use client";

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Truck, 
  Users, 
  Navigation,
  Filter,
  Eye,
  EyeOff,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Route
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface MapVehicle {
  id: string;
  licensePlate: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  collector: {
    name: string;
    phone: string;
  } | null;
  lastUpdate: string;
  route?: {
    currentStop: number;
    totalStops: number;
    estimatedCompletion: string;
  };
}

interface MapCollector {
  id: string;
  name: string;
  phone: string;
  status: 'online' | 'offline' | 'break';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  assignedVehicle?: string;
  lastUpdate: string;
}

interface CollectionPoint {
  id: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  scheduledTime: string;
  estimatedDuration: number;
  wasteType: string;
  assignedVehicle?: string;
}

export default function MapPage() {
  const [vehicles, setVehicles] = useState<MapVehicle[]>([]);
  const [collectors, setCollectors] = useState<MapCollector[]>([]);
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and view options
  const [showVehicles, setShowVehicles] = useState(true);
  const [showCollectors, setShowCollectors] = useState(true);
  const [showCollectionPoints, setShowCollectionPoints] = useState(true);
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [collectorFilter, setCollectorFilter] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  useEffect(() => {
    loadMapData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadMapData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMapData = async () => {
    try {
      // Simuler des données pour l'instant
      setTimeout(() => {
        setVehicles([
          {
            id: '1',
            licensePlate: 'AB-123-CD',
            type: 'Camion',
            status: 'active',
            location: {
              lat: 14.6928,
              lng: -17.4467,
              address: 'Avenue Cheikh Anta Diop, Dakar'
            },
            collector: {
              name: 'Mamadou Diallo',
              phone: '+221 77 123 45 67'
            },
            lastUpdate: new Date().toISOString(),
            route: {
              currentStop: 3,
              totalStops: 8,
              estimatedCompletion: '14:30'
            }
          },
          {
            id: '2',
            licensePlate: 'EF-456-GH',
            type: 'Fourgon',
            status: 'active',
            location: {
              lat: 14.7167,
              lng: -17.4677,
              address: 'Plateau, Dakar'
            },
            collector: {
              name: 'Fatou Sall',
              phone: '+221 76 987 65 43'
            },
            lastUpdate: new Date().toISOString(),
            route: {
              currentStop: 1,
              totalStops: 5,
              estimatedCompletion: '16:00'
            }
          },
          {
            id: '3',
            licensePlate: 'IJ-789-KL',
            type: 'Camion',
            status: 'maintenance',
            location: {
              lat: 14.6892,
              lng: -17.4394,
              address: 'Garage Central, Dakar'
            },
            collector: null,
            lastUpdate: new Date().toISOString()
          }
        ]);

        setCollectors([
          {
            id: '1',
            name: 'Mamadou Diallo',
            phone: '+221 77 123 45 67',
            status: 'online',
            location: {
              lat: 14.6928,
              lng: -17.4467,
              address: 'Avenue Cheikh Anta Diop, Dakar'
            },
            assignedVehicle: 'AB-123-CD',
            lastUpdate: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Fatou Sall',
            phone: '+221 76 987 65 43',
            status: 'online',
            location: {
              lat: 14.7167,
              lng: -17.4677,
              address: 'Plateau, Dakar'
            },
            assignedVehicle: 'EF-456-GH',
            lastUpdate: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Ousmane Ba',
            phone: '+221 78 456 78 90',
            status: 'break',
            location: {
              lat: 14.6937,
              lng: -17.4441,
              address: 'Point E, Dakar'
            },
            lastUpdate: new Date().toISOString()
          }
        ]);

        setCollectionPoints([
          {
            id: '1',
            address: 'Marché Sandaga, Dakar',
            location: { lat: 14.6759, lng: -17.4459 },
            status: 'pending',
            priority: 'high',
            scheduledTime: '09:00',
            estimatedDuration: 45,
            wasteType: 'Organique',
            assignedVehicle: 'AB-123-CD'
          },
          {
            id: '2',
            address: 'Université Cheikh Anta Diop',
            location: { lat: 14.6928, lng: -17.4467 },
            status: 'in_progress',
            priority: 'medium',
            scheduledTime: '10:30',
            estimatedDuration: 30,
            wasteType: 'Recyclable',
            assignedVehicle: 'AB-123-CD'
          },
          {
            id: '3',
            address: 'Almadies, Dakar',
            location: { lat: 14.7444, lng: -17.5156 },
            status: 'completed',
            priority: 'low',
            scheduledTime: '08:00',
            estimatedDuration: 25,
            wasteType: 'Général'
          }
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Erreur lors du chargement des données de la carte");
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, type: 'vehicle' | 'collector' | 'point') => {
    const vehicleConfigs = {
      active: { color: 'bg-green-100 text-green-800', label: 'Actif', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactif', icon: Clock },
      maintenance: { color: 'bg-yellow-100 text-yellow-800', label: 'Maintenance', icon: AlertTriangle }
    };

    const collectorConfigs = {
      online: { color: 'bg-green-100 text-green-800', label: 'En ligne', icon: CheckCircle },
      offline: { color: 'bg-gray-100 text-gray-800', label: 'Hors ligne', icon: Clock },
      break: { color: 'bg-yellow-100 text-yellow-800', label: 'Pause', icon: Clock }
    };

    const pointConfigs = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente', icon: Clock },
      in_progress: { color: 'bg-blue-100 text-blue-800', label: 'En cours', icon: Navigation },
      completed: { color: 'bg-green-100 text-green-800', label: 'Terminé', icon: CheckCircle }
    };

    let config;
    
    if (type === 'vehicle') {
      config = vehicleConfigs[status as keyof typeof vehicleConfigs];
    } else if (type === 'collector') {
      config = collectorConfigs[status as keyof typeof collectorConfigs];
    } else if (type === 'point') {
      config = pointConfigs[status as keyof typeof pointConfigs];
    }
    
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1 text-xs`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
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
              <Select value={selectedVehicle || ''} onValueChange={setSelectedVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
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
