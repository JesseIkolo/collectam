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
import AddBusinessCollectorForm from '@/components/dashboard/forms/AddBusinessCollectorForm';
import AddBusinessVehicleForm from '@/components/dashboard/forms/AddBusinessVehicleForm';
import EditBusinessCollectorForm from '@/components/dashboard/forms/EditBusinessCollectorForm';
import VehicleAssignmentModal from '@/components/dashboard/modals/VehicleAssignmentModal';
import { BusinessCollector, BusinessVehicle } from '@/types/business';

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
  businessCollectors: {
    list: BusinessCollector[];
    stats: {
      actif: number;
      inactif: number;
      suspendu: number;
    };
    total: number;
  };
  businessVehicles: {
    list: BusinessVehicle[];
    stats: {
      actif: number;
      inactif: number;
      maintenance: number;
      hors_service: number;
    };
    total: number;
  };
}

export default function FleetPage() {
  const [fleetData, setFleetData] = useState<FleetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddCollectorForm, setShowAddCollectorForm] = useState(false);
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [editingCollector, setEditingCollector] = useState<BusinessCollector | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentTarget, setAssignmentTarget] = useState<{
    collector?: BusinessCollector;
    vehicle?: any;
  }>({});

  useEffect(() => {
    fetchFleetData();
  }, []);

  const fetchFleetData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      // Récupérer les données des collecteurs Business
      const collectorsResponse = await fetch(`${apiUrl}/api/business-collectors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let businessCollectorsData = {
        list: [],
        stats: { actif: 0, inactif: 0, suspendu: 0 },
        total: 0
      };

      if (collectorsResponse.ok) {
        const collectorsResult = await collectorsResponse.json();
        businessCollectorsData = {
          list: collectorsResult.data.collectors || [],
          stats: collectorsResult.data.stats || { actif: 0, inactif: 0, suspendu: 0 },
          total: collectorsResult.data.pagination?.total || 0
        };
      }

      // Récupérer les données des véhicules Business
      const vehiclesResponse = await fetch(`${apiUrl}/api/business-vehicles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let businessVehiclesData = {
        list: [],
        stats: { actif: 0, inactif: 0, maintenance: 0, hors_service: 0 },
        total: 0
      };

      if (vehiclesResponse.ok) {
        const vehiclesResult = await vehiclesResponse.json();
        businessVehiclesData = {
          list: vehiclesResult.data.vehicles || [],
          stats: vehiclesResult.data.stats || { actif: 0, inactif: 0, maintenance: 0, hors_service: 0 },
          total: vehiclesResult.data.pagination?.total || 0
        };
      }

      // Récupérer les données de flotte existantes (si l'API existe)
      let existingFleetData = {
        vehicles: { total: 0, active: 0, list: [] },
        collectors: { available: [], assigned: [], total: 0 },
        businessVehicles: {
          list: [],
          stats: { actif: 0, inactif: 0, maintenance: 0, hors_service: 0 },
          total: 0
        }
      };

      try {
        const fleetResponse = await fetch(`${apiUrl}/api/business-subscription/fleet`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (fleetResponse.ok) {
          const fleetResult = await fleetResponse.json();
          existingFleetData = fleetResult.data;
        }
      } catch (error) {
        console.log('📝 API fleet existante non disponible, utilisation des données par défaut');
      }

      // Combiner toutes les données
      const combinedData = {
        ...existingFleetData,
        businessCollectors: businessCollectorsData,
        businessVehicles: businessVehiclesData
      };

      setFleetData(combinedData);

    } catch (error) {
      console.error('❌ Erreur chargement flotte:', error);
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

  const openAssignmentModal = (collector?: BusinessCollector, vehicle?: any) => {
    setAssignmentTarget({ collector, vehicle });
    setShowAssignmentModal(true);
  };

  const closeAssignmentModal = () => {
    setShowAssignmentModal(false);
    setAssignmentTarget({});
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

  // Afficher le formulaire d'ajout de collecteur si demandé
  if (showAddCollectorForm) {
    return (
      <AddBusinessCollectorForm
        onCancel={() => setShowAddCollectorForm(false)}
        onSuccess={() => {
          setShowAddCollectorForm(false);
          fetchFleetData(); // Recharger les données
        }}
      />
    );
  }

  // Afficher le formulaire d'ajout de véhicule si demandé
  if (showAddVehicleForm) {
    return (
      <AddBusinessVehicleForm
        onCancel={() => setShowAddVehicleForm(false)}
        onSuccess={() => {
          setShowAddVehicleForm(false);
          fetchFleetData(); // Recharger les données
        }}
      />
    );
  }

  // Afficher le formulaire d'édition de collecteur si demandé
  if (editingCollector) {
    return (
      <EditBusinessCollectorForm
        collector={editingCollector}
        onCancel={() => setEditingCollector(null)}
        onSuccess={() => {
          setEditingCollector(null);
          fetchFleetData(); // Recharger les données
        }}
        onDelete={() => {
          setEditingCollector(null);
          fetchFleetData(); // Recharger les données
        }}
      />
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
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            className="w-full sm:w-auto"
            onClick={() => setShowAddVehicleForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter Véhicule
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => setShowAddCollectorForm(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Ajouter Collecteur
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Collecteurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetData?.businessCollectors.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {fleetData?.businessCollectors.stats.actif || 0} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Véhicules</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetData?.businessVehicles.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {fleetData?.businessVehicles.stats.actif || 0} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collecteurs Inactifs</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetData?.businessCollectors.stats.inactif || 0}</div>
            <p className="text-xs text-muted-foreground">
              {fleetData?.businessCollectors.stats.suspendu || 0} suspendus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Véhicules Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetData?.businessVehicles.stats.maintenance || 0}</div>
            <p className="text-xs text-muted-foreground">
              {fleetData?.businessVehicles.stats.hors_service || 0} hors service
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Tabs */}
      <Tabs defaultValue="collectors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="collectors">Mes Collecteurs</TabsTrigger>
          <TabsTrigger value="vehicles">Mes Véhicules</TabsTrigger>
        </TabsList>

        <TabsContent value="collectors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fleetData?.businessCollectors.list.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun collecteur</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par ajouter votre premier collecteur à votre équipe.
                </p>
                <Button onClick={() => setShowAddCollectorForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un Collecteur
                </Button>
              </div>
            ) : (
              fleetData?.businessCollectors.list.map((collector) => (
                <Card key={collector._id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg truncate">
                          {collector.firstName} {collector.lastName}
                        </CardTitle>
                        <CardDescription className="truncate">
                          {collector.position}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={
                          collector.status === 'actif' ? 'default' : 
                          collector.status === 'inactif' ? 'secondary' : 'destructive'
                        } 
                        className="self-start"
                      >
                        {collector.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="truncate ml-2">{collector.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Téléphone:</span>
                      <span>{collector.phone}</span>
                    </div>
                    {collector.employeeId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">ID Employé:</span>
                        <span>{collector.employeeId}</span>
                      </div>
                    )}
                    {collector.workZone && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Zone:</span>
                        <span className="truncate ml-2">{collector.workZone}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Embauché:</span>
                      <span>{new Date(collector.hireDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {collector.assignedVehicleId && (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Véhicule assigné</span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setEditingCollector(collector)}
                      >
                        Modifier
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => openAssignmentModal(collector)}
                      >
                        {collector.assignedVehicleId ? 'Réassigner' : 'Assigner'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fleetData?.businessVehicles.list.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Truck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun véhicule</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par ajouter votre premier véhicule à votre flotte.
                </p>
                <Button onClick={() => setShowAddVehicleForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un Véhicule
                </Button>
              </div>
            ) : (
              fleetData?.businessVehicles.list.map((vehicle) => (
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => openAssignmentModal(undefined, vehicle)}
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Réassigner
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Aucun collecteur assigné</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => openAssignmentModal(undefined, vehicle)}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Assigner Collecteur
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              ))
            )}
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

      {/* Modal d'assignation véhicule-collecteur */}
      <VehicleAssignmentModal
        isOpen={showAssignmentModal}
        onClose={closeAssignmentModal}
        collector={assignmentTarget.collector}
        vehicle={assignmentTarget.vehicle}
        availableVehicles={fleetData?.businessVehicles.list || []}
        availableCollectors={fleetData?.businessCollectors.list || []}
        onAssignmentChange={() => {
          fetchFleetData();
          closeAssignmentModal();
        }}
      />
    </div>
  );
}
