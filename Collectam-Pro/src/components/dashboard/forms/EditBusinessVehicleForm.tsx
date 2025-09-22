"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Truck, Info, Wrench, DollarSign, AlertTriangle, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { BusinessVehicle } from '@/types/business';

interface EditBusinessVehicleFormProps {
  vehicle: BusinessVehicle;
  onCancel: () => void;
  onSuccess: () => void;
  onDelete?: () => void;
}

interface VehicleFormData {
  licensePlate: string;
  brand: string;
  model: string;
  year: string;
  capacity: string;
  vehicleType: string;
  status: string;
  fuelType: string;
  fuelLevel: string;
  mileage: string;
  acquisitionType: string;
  purchaseDate: string;
  purchasePrice: string;
  operationZone: string;
  monthlyOperatingCost: string;
  notes: string;
}

export default function EditBusinessVehicleForm({ vehicle, onCancel, onSuccess, onDelete }: EditBusinessVehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    licensePlate: vehicle.licensePlate || '',
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    year: vehicle.year?.toString() || '',
    capacity: vehicle.capacity?.toString() || '',
    vehicleType: vehicle.vehicleType || 'camion',
    status: vehicle.status || 'actif',
    fuelType: vehicle.fuelType || 'diesel',
    fuelLevel: vehicle.fuelLevel?.toString() || '100',
    mileage: vehicle.mileage?.toString() || '0',
    acquisitionType: vehicle.acquisitionType || 'achat',
    purchaseDate: vehicle.purchaseDate ? new Date(vehicle.purchaseDate).toISOString().split('T')[0] : '',
    purchasePrice: vehicle.purchasePrice?.toString() || '',
    operationZone: vehicle.operationZone || '',
    monthlyOperatingCost: vehicle.monthlyOperatingCost?.toString() || '',
    notes: vehicle.notes || ''
  });

  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.licensePlate.trim()) {
      toast.error("La plaque d'immatriculation est obligatoire");
      return false;
    }
    if (!formData.brand.trim()) {
      toast.error("La marque est obligatoire");
      return false;
    }
    if (!formData.model.trim()) {
      toast.error("Le modèle est obligatoire");
      return false;
    }
    if (!formData.year || parseInt(formData.year) < 1900 || parseInt(formData.year) > new Date().getFullYear() + 1) {
      toast.error("L'année doit être valide");
      return false;
    }
    if (!formData.capacity || parseFloat(formData.capacity) <= 0) {
      toast.error("La capacité doit être supérieure à 0");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Vous devez être connecté pour modifier un véhicule');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Préparer les données pour l'API
      const vehicleData = {
        licensePlate: formData.licensePlate.trim().toUpperCase(),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        year: parseInt(formData.year),
        capacity: parseFloat(formData.capacity),
        vehicleType: formData.vehicleType,
        status: formData.status,
        fuelType: formData.fuelType,
        fuelLevel: parseFloat(formData.fuelLevel),
        mileage: parseFloat(formData.mileage),
        acquisitionType: formData.acquisitionType,
        purchaseDate: formData.purchaseDate || undefined,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
        operationZone: formData.operationZone.trim() || undefined,
        monthlyOperatingCost: formData.monthlyOperatingCost ? parseFloat(formData.monthlyOperatingCost) : undefined,
        notes: formData.notes.trim() || undefined
      };

      console.log('🚛 Modification véhicule Business:', vehicleData);

      const response = await fetch(`${apiUrl}/api/business-vehicles/${vehicle._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vehicleData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Véhicule modifié:', result);
        toast.success("Véhicule modifié avec succès !");
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification du véhicule');
      }
    } catch (error) {
      console.error('❌ Erreur modification véhicule:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la modification du véhicule");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Vous devez être connecté pour supprimer un véhicule');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const response = await fetch(`${apiUrl}/api/business-vehicles/${vehicle._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success("Véhicule supprimé avec succès !");
        onDelete();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression du véhicule');
      }
    } catch (error) {
      console.error('❌ Erreur suppression véhicule:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression du véhicule");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif': return 'default';
      case 'inactif': return 'secondary';
      case 'maintenance': return 'destructive';
      case 'hors_service': return 'destructive';
      case 'en_mission': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Modifier le Véhicule</h1>
            <p className="text-muted-foreground">
              {vehicle.licensePlate} - {vehicle.brand} {vehicle.model}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={getStatusColor(vehicle.status)}>
            {vehicle.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Ajouté le {new Date(vehicle.createdAt).toLocaleDateString('fr-FR')}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Informations de Base
            </CardTitle>
            <CardDescription>
              Informations principales du véhicule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licensePlate">Plaque d'Immatriculation *</Label>
                <Input
                  id="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => handleInputChange('licensePlate', e.target.value.toUpperCase())}
                  placeholder="Ex: CE-123-AB"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                    <SelectItem value="maintenance">En Maintenance</SelectItem>
                    <SelectItem value="hors_service">Hors Service</SelectItem>
                    <SelectItem value="en_mission">En Mission</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Marque *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="Ex: Toyota"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Modèle *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="Ex: Hilux"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Année *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  placeholder="Ex: 2020"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Type de Véhicule *</Label>
                <Select
                  value={formData.vehicleType}
                  onValueChange={(value) => handleInputChange('vehicleType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="camion">Camion</SelectItem>
                    <SelectItem value="camionnette">Camionnette</SelectItem>
                    <SelectItem value="benne">Benne</SelectItem>
                    <SelectItem value="compacteur">Compacteur</SelectItem>
                    <SelectItem value="moto">Moto</SelectItem>
                    <SelectItem value="velo">Vélo</SelectItem>
                    <SelectItem value="tricycle">Tricycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacité (m³) *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  placeholder="Ex: 5.5"
                  min="0"
                  step="0.1"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations techniques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Informations Techniques
            </CardTitle>
            <CardDescription>
              Détails techniques et opérationnels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelType">Type de Carburant</Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => handleInputChange('fuelType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="essence">Essence</SelectItem>
                    <SelectItem value="electrique">Électrique</SelectItem>
                    <SelectItem value="hybride">Hybride</SelectItem>
                    <SelectItem value="gaz">Gaz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelLevel">Niveau Carburant (%)</Label>
                <Input
                  id="fuelLevel"
                  type="number"
                  value={formData.fuelLevel}
                  onChange={(e) => handleInputChange('fuelLevel', e.target.value)}
                  placeholder="Ex: 75"
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Kilométrage</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  placeholder="Ex: 50000"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operationZone">Zone d'Opération</Label>
              <Input
                id="operationZone"
                value={formData.operationZone}
                onChange={(e) => handleInputChange('operationZone', e.target.value)}
                placeholder="Ex: Douala Centre, Bonanjo"
              />
            </div>
          </CardContent>
        </Card>

        {/* Informations financières */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Informations Financières (Optionnel)
            </CardTitle>
            <CardDescription>
              Détails d'acquisition et coûts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="acquisitionType">Type d'Acquisition</Label>
                <Select
                  value={formData.acquisitionType}
                  onValueChange={(value) => handleInputChange('acquisitionType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="achat">Achat</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="leasing">Leasing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Date d'Acquisition</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Prix d'Achat (XOF)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                  placeholder="Ex: 15000000"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyOperatingCost">Coût Opérationnel Mensuel (XOF)</Label>
              <Input
                id="monthlyOperatingCost"
                type="number"
                value={formData.monthlyOperatingCost}
                onChange={(e) => handleInputChange('monthlyOperatingCost', e.target.value)}
                placeholder="Ex: 500000"
                min="0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes Internes</CardTitle>
            <CardDescription>
              Informations supplémentaires (optionnel)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notes sur le véhicule, équipements spéciaux, historique, etc."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Annuler
          </Button>
          
          {onDelete && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full sm:w-auto"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          )}
          
          <Button type="submit" disabled={loading} className="w-full sm:w-auto ml-auto">
            {loading ? 'Modification en cours...' : 'Modifier le Véhicule'}
          </Button>
        </div>
      </form>

      {/* Dialog de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Confirmer la suppression
              </CardTitle>
              <CardDescription>
                Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Suppression...' : 'Supprimer'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
