"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Truck, 
  Plus, 
  UserMinus,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Vehicle {
  _id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  capacity: number;
  vehicleType: string;
  status: string;
  assignedCollectorId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Collector {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  onDuty: boolean;
}

interface FleetData {
  vehicles: {
    total: number;
    active: number;
    list: Vehicle[];
  };
  collectors: {
    available: Collector[];
    assigned: Collector[];
    total: number;
  };
}

export default function FleetPage() {
  const [fleetData, setFleetData] = useState<FleetData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFleetData();
  }, []);

  const fetchFleetData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/business-subscription/fleet`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFleetData(data.data);
      } else {
        throw new Error('Erreur lors du chargement');
      }
    } catch (error) {
      toast.error("Impossible de charger les données de la flotte");
    } finally {
      setLoading(false);
    }
  };

  const assignCollector = async (vehicleId: string, collectorId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/business-subscription/fleet/assign-collector`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ vehicleId, collectorId })
      });

      if (response.ok) {
        toast.success("Collecteur assigné avec succès");
        fetchFleetData();
      } else {
        throw new Error('Erreur lors de l\'assignation');
      }
    } catch (error) {
      toast.error("Erreur lors de l'assignation");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Gestion de Flotte</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Gérez vos véhicules et collecteurs</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter Véhicule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Véhicules</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetData?.vehicles.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {fleetData?.vehicles.active || 0} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collecteurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetData?.collectors.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {fleetData?.collectors.available.length || 0} disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Véhicules Actifs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetData?.vehicles.active || 0}</div>
            <p className="text-xs text-muted-foreground">En service</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Assignation</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fleetData?.vehicles.total ? 
                Math.round((fleetData.collectors.assigned.length / fleetData.vehicles.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Véhicules assignés</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="vehicles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vehicles">Véhicules</TabsTrigger>
          <TabsTrigger value="collectors">Collecteurs</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fleetData?.vehicles.list.map((vehicle) => (
              <Card key={vehicle._id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg truncate">{vehicle.licensePlate}</CardTitle>
                      <CardDescription className="truncate">
                        {vehicle.brand} {vehicle.model} ({vehicle.year})
                      </CardDescription>
                    </div>
                    <Badge variant={vehicle.status === 'actif' ? 'default' : 'secondary'} className="self-start">
                      {vehicle.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">{vehicle.vehicleType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Capacité:</span>
                    <span>{vehicle.capacity} m³</span>
                  </div>
                  
                  {vehicle.assignedCollectorId ? (
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                        <span className="text-muted-foreground">Collecteur:</span>
                        <span className="font-medium truncate">
                          {vehicle.assignedCollectorId.firstName} {vehicle.assignedCollectorId.lastName}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <UserMinus className="w-4 h-4 mr-2" />
                        Retirer
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Aucun collecteur assigné</p>
                      {fleetData?.collectors.available.length > 0 && (
                        <select 
                          className="w-full p-2 border rounded-md text-sm"
                          onChange={(e) => {
                            if (e.target.value) {
                              assignCollector(vehicle._id, e.target.value);
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="">Assigner un collecteur</option>
                          {fleetData.collectors.available.map((collector) => (
                            <option key={collector._id} value={collector._id}>
                              {collector.firstName} {collector.lastName}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collectors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fleetData?.collectors.available.map((collector) => (
              <Card key={collector._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {collector.firstName} {collector.lastName}
                      </CardTitle>
                      <CardDescription>{collector.email}</CardDescription>
                    </div>
                    <Badge variant={collector.onDuty ? 'default' : 'secondary'}>
                      {collector.onDuty ? 'En service' : 'Hors service'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Téléphone:</span>
                    <span>{collector.phone}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
