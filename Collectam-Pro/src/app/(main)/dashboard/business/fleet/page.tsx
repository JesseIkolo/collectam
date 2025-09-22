"use client";

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Users,
  Truck,
  UserMinus,
  UserCheck,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import AddBusinessCollectorForm from '@/components/dashboard/forms/AddBusinessCollectorForm';
import AddBusinessVehicleForm from '@/components/dashboard/forms/AddBusinessVehicleForm';
import EditBusinessCollectorForm from '@/components/dashboard/forms/EditBusinessCollectorForm';
import EditBusinessVehicleForm from '@/components/dashboard/forms/EditBusinessVehicleForm';
import VehicleAssignmentModal from '@/components/dashboard/modals/VehicleAssignmentModal';
import FleetFilters from '@/components/dashboard/filters/FleetFilters';
import FilteredStats from '@/components/dashboard/stats/FilteredStats';
import BulkActions from '@/components/dashboard/bulk/BulkActions';
import SelectableCard from '@/components/dashboard/bulk/SelectableCard';
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
  const [editingVehicle, setEditingVehicle] = useState<BusinessVehicle | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentTarget, setAssignmentTarget] = useState<{
    collector?: BusinessCollector;
    vehicle?: any;
  }>({});

  // États pour les filtres
  const [collectorFilters, setCollectorFilters] = useState({
    search: '',
    status: 'all',
    workZone: 'all'
  });

  const [vehicleFilters, setVehicleFilters] = useState({
    search: '',
    status: 'all',
    type: 'all'
  });

  // États pour les actions en lot
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedCollectors, setSelectedCollectors] = useState<string[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);

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

  // Fonctions de filtrage
  const filterCollectors = (collectors: BusinessCollector[]) => {
    return collectors.filter(collector => {
      const matchesSearch = !collectorFilters.search || 
        collector.firstName.toLowerCase().includes(collectorFilters.search.toLowerCase()) ||
        collector.lastName.toLowerCase().includes(collectorFilters.search.toLowerCase()) ||
        collector.email.toLowerCase().includes(collectorFilters.search.toLowerCase()) ||
        (collector.employeeId && collector.employeeId.toLowerCase().includes(collectorFilters.search.toLowerCase()));

      const matchesStatus = collectorFilters.status === 'all' || collector.status === collectorFilters.status;
      
      const matchesWorkZone = collectorFilters.workZone === 'all' || 
        (collector.workZone && collector.workZone === collectorFilters.workZone);

      return matchesSearch && matchesStatus && matchesWorkZone;
    });
  };

  const filterVehicles = (vehicles: BusinessVehicle[]) => {
    return vehicles.filter(vehicle => {
      const matchesSearch = !vehicleFilters.search || 
        vehicle.licensePlate.toLowerCase().includes(vehicleFilters.search.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(vehicleFilters.search.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(vehicleFilters.search.toLowerCase());

      const matchesStatus = vehicleFilters.status === 'all' || vehicle.status === vehicleFilters.status;
      
      const matchesType = vehicleFilters.type === 'all' || vehicle.vehicleType === vehicleFilters.type;

      return matchesSearch && matchesStatus && matchesType;
    });
  };

  // Obtenir les zones de travail disponibles
  const getAvailableWorkZones = () => {
    const zones = fleetData?.businessCollectors.list
      .map(collector => collector.workZone)
      .filter(zone => zone && zone.trim() !== '') as string[];
    return [...new Set(zones)].sort();
  };

  // Données filtrées
  const filteredCollectors = fleetData ? filterCollectors(fleetData.businessCollectors.list) : [];
  const filteredVehicles = fleetData ? filterVehicles(fleetData.businessVehicles.list) : [];

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = collectorFilters.search !== '' || 
                          collectorFilters.status !== 'all' || 
                          collectorFilters.workZone !== 'all' ||
                          vehicleFilters.search !== '' || 
                          vehicleFilters.status !== 'all' || 
                          vehicleFilters.type !== 'all';

  // Fonctions pour les actions en lot
  const handleBulkAction = async (action: string, itemIds: string[], data?: any) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Vous devez être connecté');
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    if (action === 'delete') {
      // Supprimer les éléments un par un
      for (const id of itemIds) {
        const endpoint = selectedCollectors.includes(id) 
          ? `/api/business-collectors/${id}`
          : `/api/business-vehicles/${id}`;
        
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de la suppression de l'élément ${id}`);
        }
      }
    } else {
      // Mettre à jour le statut des éléments
      for (const id of itemIds) {
        const endpoint = selectedCollectors.includes(id) 
          ? `/api/business-collectors/${id}`
          : `/api/business-vehicles/${id}`;
        
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: data.status })
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de la mise à jour de l'élément ${id}`);
        }
      }
    }

    // Recharger les données après l'action
    await fetchFleetData();
  };

  const toggleBulkMode = () => {
    setBulkMode(!bulkMode);
    setSelectedCollectors([]);
    setSelectedVehicles([]);
  };

  const closeBulkMode = () => {
    setBulkMode(false);
    setSelectedCollectors([]);
    setSelectedVehicles([]);
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

  // Afficher le formulaire d'édition de véhicule si demandé
  if (editingVehicle) {
    return (
      <EditBusinessVehicleForm
        vehicle={editingVehicle}
        onCancel={() => setEditingVehicle(null)}
        onSuccess={() => {
          setEditingVehicle(null);
          fetchFleetData(); // Recharger les données
        }}
        onDelete={() => {
          setEditingVehicle(null);
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
            variant={bulkMode ? "secondary" : "outline"}
            className="w-full sm:w-auto"
            onClick={toggleBulkMode}
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            {bulkMode ? 'Quitter sélection' : 'Sélection multiple'}
          </Button>
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

      {/* Statistiques filtrées */}
      {fleetData && (
        <FilteredStats
          collectors={fleetData.businessCollectors.list}
          vehicles={fleetData.businessVehicles.list}
          filteredCollectors={filteredCollectors}
          filteredVehicles={filteredVehicles}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* Tabs */}
      <Tabs defaultValue="collectors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="collectors">Mes Collecteurs</TabsTrigger>
          <TabsTrigger value="vehicles">Mes Véhicules</TabsTrigger>
        </TabsList>

        <TabsContent value="collectors" className="space-y-4">
          {/* Filtres pour collecteurs */}
          {fleetData && fleetData.businessCollectors.list.length > 0 && (
            <FleetFilters
              type="collectors"
              searchQuery={collectorFilters.search}
              onSearchChange={(query) => setCollectorFilters(prev => ({ ...prev, search: query }))}
              statusFilter={collectorFilters.status}
              onStatusChange={(status) => setCollectorFilters(prev => ({ ...prev, status }))}
              workZoneFilter={collectorFilters.workZone}
              onWorkZoneChange={(zone) => setCollectorFilters(prev => ({ ...prev, workZone: zone }))}
              availableWorkZones={getAvailableWorkZones()}
              onClearFilters={() => setCollectorFilters({ search: '', status: 'all', workZone: 'all' })}
              resultCount={filteredCollectors.length}
              totalCount={fleetData.businessCollectors.list.length}
            />
          )}

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
              filteredCollectors.map((collector) => (
                <SelectableCard
                  key={collector._id}
                  isSelected={selectedCollectors.includes(collector._id)}
                  onSelectionChange={(selected) => {
                    if (selected) {
                      setSelectedCollectors(prev => [...prev, collector._id]);
                    } else {
                      setSelectedCollectors(prev => prev.filter(id => id !== collector._id));
                    }
                  }}
                  selectionMode={bulkMode}
                >
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
                </SelectableCard>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          {/* Filtres pour véhicules */}
          {fleetData && fleetData.businessVehicles.list.length > 0 && (
            <FleetFilters
              type="vehicles"
              searchQuery={vehicleFilters.search}
              onSearchChange={(query) => setVehicleFilters(prev => ({ ...prev, search: query }))}
              statusFilter={vehicleFilters.status}
              onStatusChange={(status) => setVehicleFilters(prev => ({ ...prev, status }))}
              typeFilter={vehicleFilters.type}
              onTypeChange={(type) => setVehicleFilters(prev => ({ ...prev, type }))}
              onClearFilters={() => setVehicleFilters({ search: '', status: 'all', type: 'all' })}
              resultCount={filteredVehicles.length}
              totalCount={fleetData.businessVehicles.list.length}
            />
          )}

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
              filteredVehicles.map((vehicle) => (
              <SelectableCard
                key={vehicle._id}
                isSelected={selectedVehicles.includes(vehicle._id)}
                onSelectionChange={(selected) => {
                  if (selected) {
                    setSelectedVehicles(prev => [...prev, vehicle._id]);
                  } else {
                    setSelectedVehicles(prev => prev.filter(id => id !== vehicle._id));
                  }
                }}
                selectionMode={bulkMode}
              >
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

                  {/* Boutons d'action */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setEditingVehicle(vehicle)}
                    >
                      Modifier
                    </Button>
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
              </SelectableCard>
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

      {/* Actions en lot pour collecteurs */}
      <BulkActions
        type="collectors"
        items={filteredCollectors}
        selectedItems={selectedCollectors}
        onSelectionChange={setSelectedCollectors}
        onBulkAction={handleBulkAction}
        isVisible={bulkMode && selectedCollectors.length > 0}
        onClose={closeBulkMode}
      />

      {/* Actions en lot pour véhicules */}
      <BulkActions
        type="vehicles"
        items={filteredVehicles}
        selectedItems={selectedVehicles}
        onSelectionChange={setSelectedVehicles}
        onBulkAction={handleBulkAction}
        isVisible={bulkMode && selectedVehicles.length > 0}
        onClose={closeBulkMode}
      />
    </div>
  );
}
