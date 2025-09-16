"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const [collections, setCollections] = useState<CollectionPoint[]>([
    {
      id: '1',
      address: '123 Rue de la Paix, Douala',
      wasteType: 'Plastique',
      priority: 'high',
      estimatedWeight: 15.5,
      status: 'pending',
      coordinates: [9.7043, 4.0511],
      timeSlot: '09:30',
      distance: 0.8
    },
    {
      id: '2',
      address: '45 Avenue Kennedy, Douala',
      wasteType: 'Organique',
      priority: 'medium',
      estimatedWeight: 8.2,
      status: 'in_progress',
      coordinates: [9.7083, 4.0531],
      timeSlot: '10:15',
      distance: 1.2
    },
    {
      id: '3',
      address: '78 Bd de la Liberté, Douala',
      wasteType: 'Mixte',
      priority: 'low',
      estimatedWeight: 12.0,
      status: 'completed',
      coordinates: [9.7023, 4.0491],
      timeSlot: '11:00',
      distance: 2.1
    },
    {
      id: '4',
      address: '12 Rue du Commerce, Douala',
      wasteType: 'Électronique',
      priority: 'high',
      estimatedWeight: 5.8,
      status: 'pending',
      coordinates: [9.7063, 4.0521],
      timeSlot: '11:45',
      distance: 1.5
    }
  ]);

  const [currentLocation, setCurrentLocation] = useState<[number, number]>([9.7043, 4.0511]);
  const [selectedCollection, setSelectedCollection] = useState<CollectionPoint | null>(null);

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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Carte interactive */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Carte Interactive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[4/3] bg-muted rounded-lg relative overflow-hidden">
                {/* Simulation d'une carte */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
                  {/* Points de collecte sur la carte */}
                  {collections.map((collection, index) => (
                    <div
                      key={collection.id}
                      className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-2 -translate-y-2 ${getPriorityColor(collection.priority)}`}
                      style={{
                        left: `${20 + index * 15}%`,
                        top: `${30 + (index % 2) * 20}%`
                      }}
                      onClick={() => setSelectedCollection(collection)}
                    />
                  ))}
                  
                  {/* Position actuelle */}
                  <div 
                    className="absolute w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg animate-pulse"
                    style={{ left: '25%', top: '40%' }}
                  />
                  
                  {/* Légende */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span>Ma position</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Urgent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Normal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Faible</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedCollection && (
                <Alert className="mt-4">
                  <MapPin className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">{selectedCollection.address}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Type: {selectedCollection.wasteType}</span>
                        <span>Poids: {selectedCollection.estimatedWeight} kg</span>
                        <span>Distance: {selectedCollection.distance} km</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex items-center gap-1">
                          <Navigation className="h-3 w-3" />
                          Navigation
                        </Button>
                        {selectedCollection.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => startCollection(selectedCollection.id)}
                          >
                            Démarrer
                          </Button>
                        )}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

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
