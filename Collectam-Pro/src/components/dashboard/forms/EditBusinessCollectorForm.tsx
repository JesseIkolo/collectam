"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, DollarSign, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { BusinessCollector } from '@/types/business';

interface EditBusinessCollectorFormProps {
  collector: BusinessCollector;
  onCancel: () => void;
  onSuccess: () => void;
  onDelete?: () => void;
}

interface CollectorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  position: string;
  status: string;
  workZone: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  salaryAmount: string;
  paymentFrequency: string;
  notes: string;
}

export default function EditBusinessCollectorForm({ collector, onCancel, onSuccess, onDelete }: EditBusinessCollectorFormProps) {
  const [formData, setFormData] = useState<CollectorFormData>({
    firstName: collector.firstName || '',
    lastName: collector.lastName || '',
    email: collector.email || '',
    phone: collector.phone || '',
    employeeId: collector.employeeId || '',
    position: collector.position || 'Collecteur',
    status: collector.status || 'actif',
    workZone: collector.workZone || '',
    street: collector.address?.street || '',
    city: collector.address?.city || '',
    region: collector.address?.region || '',
    postalCode: collector.address?.postalCode || '',
    salaryAmount: collector.salary?.amount?.toString() || '',
    paymentFrequency: collector.salary?.paymentFrequency || 'mensuel',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        throw new Error('Vous devez être connecté pour modifier un collecteur');
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
        status: formData.status,
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

      console.log('👤 Modification collecteur Business:', collectorData);

      const response = await fetch(`${apiUrl}/api/business-collectors/${collector._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(collectorData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Collecteur modifié:', result);
        toast.success("Collecteur modifié avec succès !");
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification du collecteur');
      }
    } catch (error) {
      console.error('❌ Erreur modification collecteur:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la modification du collecteur");
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
        throw new Error('Vous devez être connecté pour supprimer un collecteur');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const response = await fetch(`${apiUrl}/api/business-collectors/${collector._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success("Collecteur supprimé avec succès !");
        onDelete();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression du collecteur');
      }
    } catch (error) {
      console.error('❌ Erreur suppression collecteur:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression du collecteur");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
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
            <h1 className="text-2xl font-bold">Modifier le Collecteur</h1>
            <p className="text-muted-foreground">
              {collector.firstName} {collector.lastName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge 
            variant={
              collector.status === 'actif' ? 'default' : 
              collector.status === 'inactif' ? 'secondary' : 'destructive'
            }
          >
            {collector.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Embauché le {new Date(collector.hireDate).toLocaleDateString('fr-FR')}
          </span>
        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
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
            {loading ? 'Modification en cours...' : 'Modifier le Collecteur'}
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
                Êtes-vous sûr de vouloir supprimer ce collecteur ? Cette action est irréversible.
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
