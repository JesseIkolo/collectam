"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Truck, 
  Plus, 
  Settings, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  UserMinus,
  UserPlus,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    phone: string;
  };
}

interface Collector {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  onDuty: boolean;
  lastSeenAt?: string;
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

const BusinessDashboard: React.FC = () => {
  const [fleetData, setFleetData] = useState<FleetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

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
        const responseText = await response.text();
        console.error('Fleet data error:', responseText);
        throw new Error('Erreur lors du chargement des données');
      }
    } catch (error) {
      console.error('Fleet fetch error:', error);
      if (error instanceof Error && error.message.includes('<!DOCTYPE')) {
        toast.error("Erreur de connexion au serveur. Vérifiez que le serveur backend est démarré.");
      } else {
        toast.error("Impossible de charger les données de la flotte");
      }
    } finally {
      setLoading(false);
    }
  };

  const assignCollector = async (vehicleId: string, collectorId: string) => {
    try {
      const response = await fetch('/api/business-subscription/fleet/assign-collector', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ vehicleId, collectorId })
      });

      if (response.ok) {
        toast.success("Collecteur assigné avec succès");
        fetchFleetData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'assignation");
    }
  };

  const removeCollector = async (vehicleId: string) => {
    try {
      const response = await fetch(`/api/business-subscription/fleet/vehicles/${vehicleId}/collector`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success("Collecteur retiré avec succès");
        fetchFleetData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors du retrait");
    }
  };

  const deleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Veuillez saisir votre mot de passe");
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch('/api/business-subscription/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ password: deletePassword })
      });

      if (response.ok) {
        toast.success("Votre compte a été supprimé avec succès");
        
        // Clear localStorage and redirect
        localStorage.clear();
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setDeletePassword('');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'actif': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'inactif': { color: 'bg-gray-100 text-gray-800', icon: Clock },
      'maintenance': { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      'hors_service': { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactif;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Business</h1>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Business
          </h1>
          <p className="text-muted-foreground">
            Gérez votre flotte de collecteurs et véhicules
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Rapports
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer le compte
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Supprimer le compte</DialogTitle>
                <DialogDescription>
                  Cette action est irréversible. Tous vos véhicules et données seront supprimés.
                  Veuillez saisir votre mot de passe pour confirmer.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={deleteAccount}
                  disabled={deleting}
                >
                  {deleting ? 'Suppression...' : 'Supprimer définitivement'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
            <CardTitle className="text-sm font-medium">Collecteurs Assignés</CardTitle>
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
            <p className="text-xs text-muted-foreground">
              En service actuellement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Assignation</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fleetData?.vehicles.total ? 
                Math.round((fleetData.collectors.total / fleetData.vehicles.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Véhicules avec collecteur
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="vehicles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vehicles">Véhicules</TabsTrigger>
          <TabsTrigger value="collectors">Collecteurs</TabsTrigger>
          <TabsTrigger value="assignments">Assignations</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Mes Véhicules</h2>
            <Button onClick={() => window.location.href = '/vehicles/register'}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un véhicule
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fleetData?.vehicles.list.map((vehicle) => (
              <Card key={vehicle._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{vehicle.licensePlate}</CardTitle>
                      <CardDescription>
                        {vehicle.brand} {vehicle.model} ({vehicle.year})
                      </CardDescription>
                    </div>
                    {getStatusBadge(vehicle.status)}
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
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Collecteur:</span>
                        <span className="font-medium">
                          {vehicle.assignedCollectorId.firstName} {vehicle.assignedCollectorId.lastName}
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => removeCollector(vehicle._id)}
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Retirer le collecteur
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Aucun collecteur assigné</p>
                      {fleetData.collectors.available.length > 0 && (
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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Collecteurs Disponibles</h2>
            <p className="text-sm text-muted-foreground">
              {fleetData?.collectors.available.length} collecteurs disponibles pour assignation
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fleetData?.collectors.available.map((collector) => (
              <Card key={collector._id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {collector.firstName} {collector.lastName}
                  </CardTitle>
                  <CardDescription>{collector.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Téléphone:</span>
                    <span>{collector.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Statut:</span>
                    <Badge className={collector.onDuty ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {collector.onDuty ? 'En service' : 'Hors service'}
                    </Badge>
                  </div>
                  {collector.lastSeenAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dernière activité:</span>
                      <span>{new Date(collector.lastSeenAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <h2 className="text-xl font-semibold">Assignations Actives</h2>
          
          <div className="space-y-4">
            {fleetData?.vehicles.list
              .filter(vehicle => vehicle.assignedCollectorId)
              .map((vehicle) => (
                <Card key={vehicle._id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 rounded-full p-2">
                        <Truck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{vehicle.licensePlate}</h3>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.brand} {vehicle.model}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 rounded-full p-2">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {vehicle.assignedCollectorId?.firstName} {vehicle.assignedCollectorId?.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.assignedCollectorId?.email}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeCollector(vehicle._id)}
                    >
                      <UserMinus className="w-4 h-4 mr-2" />
                      Retirer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            
            {fleetData?.vehicles.list.filter(v => v.assignedCollectorId).length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune assignation active</h3>
                  <p className="text-muted-foreground">
                    Assignez des collecteurs à vos véhicules pour commencer
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessDashboard;
