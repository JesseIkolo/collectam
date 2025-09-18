"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Truck, Fuel, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface AddBusinessVehicleFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

interface VehicleFormData {
  licensePlate: string;
  brand: string;
  model: string;
  year: string;
  capacity: string;
  vehicleType: string;
  fuelType: string;
  acquisitionType: string;
  purchasePrice: string;
  mileage: string;
  notes: string;
}

export default function AddBusinessVehicleForm({ onCancel, onSuccess }: AddBusinessVehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    licensePlate: '',
    brand: '',
    model: '',
    year: '',
    capacity: '',
    vehicleType: 'camion',
    fuelType: 'diesel',
    acquisitionType: 'achat',
    purchasePrice: '',
    mileage: '0',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

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
    if (!formData.year.trim()) {
      toast.error("L'année est obligatoire");
      return false;
    }
    if (!formData.capacity.trim()) {
      toast.error("La capacité est obligatoire");
      return false;
    }

    // Validation année
    const year = parseInt(formData.year);
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 1) {
      toast.error(`L'année doit être entre 1900 et ${currentYear + 1}`);
      return false;
    }

    // Validation capacité
    const capacity = parseFloat(formData.capacity);
    if (capacity <= 0) {
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
        throw new Error('Vous devez être connecté pour ajouter un véhicule');
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
        fuelType: formData.fuelType,
        acquisitionType: formData.acquisitionType,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
        mileage: parseInt(formData.mileage) || 0,
        notes: formData.notes.trim() || undefined
      };

      console.log('🚛 Création véhicule Business:', vehicleData);

      const response = await fetch(`${apiUrl}/api/business-vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vehicleData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Véhicule créé:', result);
        toast.success("Véhicule ajouté avec succès !");
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création du véhicule');
      }
    } catch (error) {
      console.error('❌ Erreur création véhicule:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'ajout du véhicule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Ajouter un Véhicule</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Informations du Véhicule
            </CardTitle>
            <CardDescription>
              Informations de base du véhicule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licensePlate">Plaque d'Immatriculation *</Label>
                <Input
                  id="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                  placeholder="Ex: LT 123 AB"
                  className="uppercase"
                  required
                />
              </div>
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
                <Label htmlFor="capacity">Capacité (tonnes) *</Label>
                <Input
                  id="capacity"
                  type="number"
                  step="0.1"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  placeholder="Ex: 3.5"
                  min="0.1"
                  required
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
          </CardContent>
        </Card>

        {/* Informations techniques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Informations Techniques
            </CardTitle>
            <CardDescription>
              Détails techniques et carburant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Coûts et informations financières
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Ajout en cours...' : 'Ajouter le Véhicule'}
          </Button>
        </div>
      </form>
    </div>
  );
}
