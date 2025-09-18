"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface AddBusinessCollectorFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

interface CollectorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  position: string;
  workZone: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  salaryAmount: string;
  paymentFrequency: string;
  notes: string;
}

export default function AddBusinessCollectorForm({ onCancel, onSuccess }: AddBusinessCollectorFormProps) {
  const [formData, setFormData] = useState<CollectorFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    position: 'Collecteur',
    workZone: '',
    street: '',
    city: '',
    region: '',
    postalCode: '',
    salaryAmount: '',
    paymentFrequency: 'mensuel',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof CollectorFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      toast.error("Le prénom est obligatoire");
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error("Le nom est obligatoire");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("L'email est obligatoire");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Le numéro de téléphone est obligatoire");
      return false;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Format d'email invalide");
      return false;
    }

    // Validation téléphone (format camerounais)
    const phoneRegex = /^(\+237|237)?[6-9]\d{8}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast.error("Format de téléphone invalide (ex: +237 6XX XXX XXX)");
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
        throw new Error('Vous devez être connecté pour ajouter un collecteur');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      // Préparer les données pour l'API
      const collectorData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        employeeId: formData.employeeId.trim() || undefined,
        position: formData.position.trim(),
        workZone: formData.workZone.trim() || undefined,
        address: {
          street: formData.street.trim() || undefined,
          city: formData.city.trim() || undefined,
          region: formData.region.trim() || undefined,
          postalCode: formData.postalCode.trim() || undefined,
          country: 'Cameroun'
        },
        salary: formData.salaryAmount ? {
          amount: parseFloat(formData.salaryAmount),
          currency: 'XOF',
          paymentFrequency: formData.paymentFrequency
        } : undefined,
        notes: formData.notes.trim() || undefined
      };

      console.log('👤 Création collecteur Business:', collectorData);

      const response = await fetch(`${apiUrl}/api/business-collectors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(collectorData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Collecteur créé:', result);
        toast.success("Collecteur ajouté avec succès !");
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création du collecteur');
      }
    } catch (error) {
      console.error('❌ Erreur création collecteur:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'ajout du collecteur");
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
        <h1 className="text-2xl font-bold">Ajouter un Collecteur</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations Personnelles
            </CardTitle>
            <CardDescription>
              Informations de base du collecteur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Ex: Jean"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Ex: Dupont"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="jean.dupont@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+237 6XX XXX XXX"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations professionnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Informations Professionnelles
            </CardTitle>
            <CardDescription>
              Détails du poste et de l'emploi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">ID Employé</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  placeholder="Ex: EMP001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Poste</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="Ex: Collecteur Senior"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workZone">Zone de Travail</Label>
              <Input
                id="workZone"
                value={formData.workZone}
                onChange={(e) => handleInputChange('workZone', e.target.value)}
                placeholder="Ex: Douala Centre, Bonanjo"
              />
            </div>
          </CardContent>
        </Card>

        {/* Adresse */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Adresse
            </CardTitle>
            <CardDescription>
              Adresse de résidence du collecteur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Rue</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                placeholder="Ex: 123 Rue de la Paix"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Ex: Douala"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Région</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  placeholder="Ex: Littoral"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Code Postal</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="Ex: BP 1234"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Informations Salariales (Optionnel)
            </CardTitle>
            <CardDescription>
              Détails de rémunération
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryAmount">Montant (XOF)</Label>
                <Input
                  id="salaryAmount"
                  type="number"
                  value={formData.salaryAmount}
                  onChange={(e) => handleInputChange('salaryAmount', e.target.value)}
                  placeholder="Ex: 150000"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentFrequency">Fréquence de Paiement</Label>
                <Select
                  value={formData.paymentFrequency}
                  onValueChange={(value) => handleInputChange('paymentFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="horaire">Horaire</SelectItem>
                    <SelectItem value="journalier">Journalier</SelectItem>
                    <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                    <SelectItem value="mensuel">Mensuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              placeholder="Notes sur le collecteur, compétences particulières, etc."
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
            {loading ? 'Ajout en cours...' : 'Ajouter le Collecteur'}
          </Button>
        </div>
      </form>
    </div>
  );
}
