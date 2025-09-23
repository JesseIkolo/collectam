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
import { wasteRequestService, WasteRequest as ServiceWasteRequest } from '@/services/WasteRequestService';

// Interface that matches what HouseholdTrackingMap expects
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

  // Transform service data to map component format
  const transformWasteRequest = (serviceRequest: ServiceWasteRequest, collectors: BusinessCollector[]): WasteRequest => {
    // Find the assigned collector details
    let assignedCollectorDetails = undefined;
    if (serviceRequest.assignedCollector) {
      const collector = collectors.find(c => c._id === serviceRequest.assignedCollector);
      if (collector) {
        assignedCollectorDetails = {
          _id: collector._id,
          firstName: collector.firstName,
          lastName: collector.lastName,
          phone: collector.phone,
          lastLocation: collector.lastLocation ? {
            coordinates: collector.lastLocation.coordinates
          } : undefined
        };
      }
    }

    return {
      _id: serviceRequest._id,
      wasteType: serviceRequest.wasteType,
      status: serviceRequest.status,
      address: serviceRequest.address,
      coordinates: serviceRequest.coordinates,
      assignedCollector: assignedCollectorDetails,
      preferredDate: serviceRequest.preferredDate,
      preferredTime: serviceRequest.preferredTime,
      estimatedWeight: serviceRequest.estimatedWeight,
      description: serviceRequest.description
    };
  };

  const loadBusinessWasteRequests = async (collectors: BusinessCollector[]): Promise<WasteRequest[]> => {
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
      
      // Transform to map component format
      return businessRequests.map((request: ServiceWasteRequest) => 
        transformWasteRequest(request, collectors)
      );
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
