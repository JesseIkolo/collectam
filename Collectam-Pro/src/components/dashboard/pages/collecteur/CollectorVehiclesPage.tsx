"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Truck, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Crown
} from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  _id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  capacity: number;
  vehicleType: string;
  status: string;
  isVerified: boolean;
  createdAt: string;
}

interface VehicleLimit {
  current: number;
  max: number | string;
  canAddMore: boolean;
  upgradeRequired: boolean;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [limit, setLimit] = useState<VehicleLimit>({ current: 0, max: 2, canAddMore: true, upgradeRequired: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');
  
  const [formData, setFormData] = useState({
    licensePlate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    capacity: 0,
    vehicleType: 'camionnette'
  });

  const vehicleTypes = [
    { value: 'camion', label: 'Camion' },
    { value: 'camionnette', label: 'Camionnette' },
    { value: 'moto', label: 'Moto' },
    { value: 'velo', label: 'Vélo' },
    { value: 'tricycle', label: 'Tricycle' }
  ];

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/vehicles/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setVehicles(result.data.vehicles);
        setLimit(result.data.limit);
      } else {
        toast.error('Erreur lors du chargement des véhicules');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const url = editingVehicle 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/vehicles/${editingVehicle._id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/vehicles/register`;
      
      const method = editingVehicle ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setIsDialogOpen(false);
        setEditingVehicle(null);
        resetForm();
        fetchVehicles();
      } else {
        if (response.status === 403 && result.upgrade) {
          // Show upgrade modal with logout option
          setShowUpgradeModal(true);
          setUpgradeMessage(result.message);
        } else {
          toast.error(result.message || 'Erreur lors de l\'enregistrement');
        }
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (vehicleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        fetchVehicles();
      } else {
        toast.error(result.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    }
  };

  const resetForm = () => {
    setFormData({
      licensePlate: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      capacity: 0,
      vehicleType: 'camionnette'
    });
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      licensePlate: vehicle.licensePlate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType
    });
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'actif': { variant: 'default' as const, label: 'Actif' },
      'inactif': { variant: 'secondary' as const, label: 'Inactif' },
      'maintenance': { variant: 'destructive' as const, label: 'Maintenance' },
      'hors_service': { variant: 'outline' as const, label: 'Hors service' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.actif;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handleLogoutAndUpgrade = () => {
    // Show loading state immediately
    toast.success("Redirection vers l'inscription Business...");
    
    // Clear all authentication data
    localStorage.clear();
    
    // Clear cookies
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Immediate redirect
    window.location.href = '/auth/v2/register';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Véhicules</h1>
          <p className="text-muted-foreground">
            Gérez vos véhicules de collecte ({limit.current}/{limit.max === Infinity ? '∞' : limit.max})
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              disabled={!limit.canAddMore}
              onClick={() => {
                setEditingVehicle(null);
                resetForm();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter Véhicule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">Plaque d'immatriculation</Label>
                  <Input
                    id="licensePlate"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData(prev => ({ ...prev, licensePlate: e.target.value.toUpperCase() }))}
                    placeholder="ABC-123-DEF"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Type de véhicule</Label>
                  <Select value={formData.vehicleType} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marque</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="Toyota"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modèle</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="Hilux"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Année</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacité (tonnes)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseFloat(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Enregistrement...' : editingVehicle ? 'Modifier' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Limite d'upgrade */}
      {limit.upgradeRequired && (
        <Alert>
          <Crown className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Vous avez atteint la limite de 2 véhicules. Creez un compte <strong>Collectam Business</strong> pour enregistrer plus de véhicules.
            </span>
            <Button 
              onClick={handleLogoutAndUpgrade} 
              className="ml-4 bg-yellow-600 hover:bg-yellow-700"
              size="sm"
            >
              <Crown className="h-4 w-4 mr-2" />
              Passer à Collectam Business
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Liste des véhicules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Véhicules Enregistrés
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun véhicule enregistré</p>
              <p className="text-sm">Ajoutez votre premier véhicule pour commencer</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plaque</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Vérification</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle._id}>
                      <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                      <TableCell>{vehicle.brand} {vehicle.model} ({vehicle.year})</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {vehicleTypes.find(t => t.value === vehicle.vehicleType)?.label || vehicle.vehicleType}
                        </Badge>
                      </TableCell>
                      <TableCell>{vehicle.capacity}T</TableCell>
                      <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                      <TableCell>
                        {vehicle.isVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(vehicle)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(vehicle._id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Limite atteinte
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {upgradeMessage}
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              Pour continuer à ajouter des véhicules, vous devez créer un compte Collectam Business. 
              Vous serez déconnecté et redirigé vers la page d'inscription Business.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleLogoutAndUpgrade} className="bg-yellow-600 hover:bg-yellow-700">
                <Crown className="h-4 w-4 mr-2" />
                Créer un compte Business
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
