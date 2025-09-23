"use client";

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Navigation,
  Phone,
  MessageSquare,
  RefreshCw,
  Filter,
  Calendar,
  Package
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HouseholdTrackingMap from '@/components/maps/HouseholdTrackingMap';
import { wasteRequestService } from '@/services/WasteRequestService';
import { mapService } from '@/services/MapService';

interface CollectionRequest {
  id: string;
  wasteType: string;
  quantity: number;
  unit: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  status: 'pending' | 'assigned' | 'en_route' | 'arrived' | 'collecting' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: string;
  scheduledTime: string;
  collector?: {
    id: string;
    name: string;
    phone: string;
    vehicle: string;
    currentLocation: [number, number];
    estimatedArrival?: string;
  };
  createdAt: string;
  completedAt?: string;
}

interface MapStats {
  totalRequests: number;
  activeCollections: number;
  completedToday: number;
  averageResponseTime: string;
}

export default function EnterpriseMapPage() {
  const [requests, setRequests] = useState<CollectionRequest[]>([]);
  const [wasteRequestsForMap, setWasteRequestsForMap] = useState<any[]>([]);
  const [collectors, setCollectors] = useState<any[]>([]);
  const [stats, setStats] = useState<MapStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMapData();
    // Refresh data every 30 seconds for real-time updates
    const interval = setInterval(loadMapData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadUserWasteRequests = async () => {
    try {
      console.log('🏢 Chargement des demandes entreprise...');
      const userRequests = await wasteRequestService.getUserRequests();
      
      if (!userRequests || !Array.isArray(userRequests)) {
        console.warn('⚠️ Aucune demande reçue ou format incorrect');
        return [];
      }
      
      // Convertir au format attendu par la carte avec validation des coordonnées
      const formattedRequests = userRequests.map(request => {
        // Valider les coordonnées
        let validCoordinates = null;
        
        if (request.coordinates && Array.isArray(request.coordinates) && request.coordinates.length === 2) {
          const [lng, lat] = request.coordinates;
          // Vérifier que les coordonnées sont des nombres valides
          if (typeof lng === 'number' && typeof lat === 'number' && 
              !isNaN(lng) && !isNaN(lat) && 
              lng >= -180 && lng <= 180 && 
              lat >= -90 && lat <= 90) {
            validCoordinates = {
              coordinates: [lng, lat]
            };
          } else {
            console.warn(`⚠️ Coordonnées invalides pour la demande ${request._id}:`, request.coordinates);
          }
        } else {
          console.warn(`⚠️ Coordonnées manquantes ou format incorrect pour la demande ${request._id}:`, request.coordinates);
        }

        return {
          _id: request._id,
          wasteType: request.wasteType,
          status: request.status,
          address: request.address,
          coordinates: validCoordinates,
          assignedCollector: request.assignedCollector,
          preferredDate: request.preferredDate,
          preferredTime: request.preferredTime,
          estimatedWeight: request.estimatedWeight,
          description: request.description || ''
        };
      });

      console.log(`📋 ${formattedRequests.length} demandes entreprise chargées pour la carte`);
      return formattedRequests;
    } catch (error) {
      console.error('❌ Erreur chargement demandes entreprise:', error);
      return [];
    }
  };

  const loadMapData = async () => {
    try {
      setRefreshing(true);
      setLoading(true);
      
      console.log('🏢 Chargement des données de la carte entreprise...');
      
      // Charger les collecteurs actifs
      const collectorsData = await mapService.getActiveCollectors();
      console.log('🚛 Collecteurs actifs chargés:', collectorsData.length);
      
      // Charger les demandes de l'utilisateur entreprise
      const wasteRequestsWithCollectors = await loadUserWasteRequests();
      
      // Convertir les demandes au format attendu par l'interface
      const formattedRequests = wasteRequestsWithCollectors.map((request: any) => ({
        id: request._id,
        wasteType: request.wasteType || 'Non spécifié',
        quantity: request.estimatedWeight || 0,
        unit: 'kg',
        address: request.address || 'Adresse non spécifiée',
        coordinates: request.coordinates?.coordinates || [9.7043, 4.0511], // Fallback Douala
        status: mapRequestStatus(request.status),
        priority: mapPriority(request.urgency || 'medium'),
        scheduledDate: request.preferredDate || new Date().toISOString().split('T')[0],
        scheduledTime: request.preferredTime || '10:00',
        collector: request.assignedCollector ? {
          id: request.assignedCollector._id || request.assignedCollector,
          name: request.assignedCollector.firstName && request.assignedCollector.lastName 
            ? `${request.assignedCollector.firstName} ${request.assignedCollector.lastName}`
            : 'Collecteur assigné',
          phone: request.assignedCollector.phone || '+237 XXX XXX XXX',
          vehicle: 'Véhicule de collecte',
          currentLocation: request.assignedCollector.lastLocation?.coordinates || [9.7043, 4.0511],
          estimatedArrival: '15 minutes'
        } : undefined,
        createdAt: request.createdAt || new Date().toISOString()
      }));
      
      // Calculer les statistiques
      const totalRequests = formattedRequests.length;
      const activeCollections = formattedRequests.filter(r => 
        ['assigned', 'en_route', 'arrived', 'collecting'].includes(r.status)
      ).length;
      const completedToday = formattedRequests.filter(r => 
        r.status === 'completed' && 
        new Date(r.createdAt).toDateString() === new Date().toDateString()
      ).length;
      
      setCollectors(collectorsData);
      setWasteRequestsForMap(wasteRequestsWithCollectors);
      setRequests(formattedRequests as CollectionRequest[]);
      setStats({
        totalRequests,
        activeCollections,
        completedToday,
        averageResponseTime: '2h 15min'
      });
      
      console.log(`📊 Statistiques entreprise: ${totalRequests} demandes, ${activeCollections} actives`);
      
    } catch (error) {
      console.error('❌ Erreur chargement données carte entreprise:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fonctions de mapping des statuts
  const mapRequestStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'pending',
      'scheduled': 'assigned',
      'in_progress': 'collecting',
      'completed': 'completed',
      'cancelled': 'completed'
    };
    return statusMap[status] || 'pending';
  };

  const mapPriority = (urgency: string) => {
    const priorityMap: { [key: string]: string } = {
      'low': 'low',
      'medium': 'medium',
      'high': 'high'
    };
    return priorityMap[urgency] || 'medium';
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente', icon: Clock },
      assigned: { color: 'bg-blue-100 text-blue-800', label: 'Assigné', icon: CheckCircle },
      en_route: { color: 'bg-purple-100 text-purple-800', label: 'En route', icon: Truck },
      arrived: { color: 'bg-green-100 text-green-800', label: 'Arrivé', icon: MapPin },
      collecting: { color: 'bg-orange-100 text-orange-800', label: 'Collecte', icon: Package },
      completed: { color: 'bg-green-100 text-green-800', label: 'Terminé', icon: CheckCircle }
    };
    const config = configs[status as keyof typeof configs] || configs.pending;
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
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    const labels = {
      low: 'Faible',
      medium: 'Moyen',
      high: 'Élevé',
      urgent: 'Urgent'
    };
    return (
      <Badge className={`${colors[priority as keyof typeof colors] || colors.medium} text-xs`}>
        {labels[priority as keyof typeof labels] || labels.medium}
      </Badge>
    );
  };

  const filteredRequests = requests.filter(request => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return ['assigned', 'en_route', 'arrived', 'collecting'].includes(request.status);
    return request.status === statusFilter;
  });

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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Suivi en Temps Réel</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Suivez l'avancement de vos collectes de déchets sur la carte
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={loadMapData}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Demandes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRequests}</div>
              <p className="text-xs text-muted-foreground">
                Toutes les demandes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collectes Actives</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCollections}</div>
              <p className="text-xs text-muted-foreground">
                En cours de traitement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terminées Aujourd'hui</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedToday}</div>
              <p className="text-xs text-muted-foreground">
                Collectes finalisées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps de Réponse</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageResponseTime}</div>
              <p className="text-xs text-muted-foreground">
                Temps moyen
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Carte Interactive Pleine Largeur */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Carte Interactive Entreprise
          </CardTitle>
          <CardDescription>
            Suivi en temps réel de vos collectes et collecteurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] rounded-lg overflow-hidden">
            <HouseholdTrackingMap 
              wasteRequests={wasteRequestsForMap}
              onRequestSelect={(request) => setSelectedRequest(request._id)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des Demandes */}
      <div className="grid grid-cols-1 gap-6">

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Demandes de Collecte</CardTitle>
                <CardDescription>
                  Liste des collectes avec statut en temps réel
                </CardDescription>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="active">Actives</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="en_route">En route</SelectItem>
                  <SelectItem value="completed">Terminées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredRequests.map((request) => (
                <div 
                  key={request.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedRequest === request.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{request.wasteType}</h4>
                      <p className="text-sm text-muted-foreground">
                        {request.quantity} {request.unit}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      {getStatusBadge(request.status)}
                      {getPriorityBadge(request.priority)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{request.address}</span>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(request.scheduledDate).toLocaleDateString('fr-FR')} à {request.scheduledTime}
                    </span>
                  </div>

                  {request.collector && (
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{request.collector.name}</p>
                          <p className="text-xs text-muted-foreground">{request.collector.vehicle}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Phone className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {request.collector.estimatedArrival && request.status === 'en_route' && (
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <Navigation className="w-3 h-3" />
                          <span>Arrivée estimée dans {request.collector.estimatedArrival}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedRequest === request.id && (
                    <div className="border-t pt-3 mt-3 space-y-2">
                      <div className="text-sm">
                        <strong>Créée le :</strong> {new Date(request.createdAt).toLocaleDateString('fr-FR')} à {new Date(request.createdAt).toLocaleTimeString('fr-FR')}
                      </div>
                      {request.completedAt && (
                        <div className="text-sm">
                          <strong>Terminée le :</strong> {new Date(request.completedAt).toLocaleDateString('fr-FR')} à {new Date(request.completedAt).toLocaleTimeString('fr-FR')}
                        </div>
                      )}
                      <div className="text-sm">
                        <strong>Coordonnées :</strong> {request.coordinates[0].toFixed(4)}, {request.coordinates[1].toFixed(4)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
