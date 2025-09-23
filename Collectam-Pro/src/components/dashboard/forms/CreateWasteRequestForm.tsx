"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { ArrowLeft, Plus, MapPin, Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { wasteRequestService } from "@/services/WasteRequestService";

interface WasteRequestFormData {
  wasteType: string;
  description: string;
  estimatedWeight: number;
  address: string;
  urgency: "low" | "medium" | "high" | "urgent";
  preferredDate: string;
  preferredTime: string;
  contactPhone?: string;
  specialInstructions?: string;
}

interface AssignedCollector {
  id: string;
  name: string;
  phone: string;
  distance: number;
}

interface CreateWasteRequestFormProps {
  onSubmit?: (data: WasteRequestFormData) => void;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function CreateWasteRequestForm({ onSubmit, onCancel, onSuccess }: CreateWasteRequestFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<WasteRequestFormData>({
    wasteType: "",
    description: "",
    estimatedWeight: 0,
    address: "",
    urgency: "medium",
    preferredDate: "",
    preferredTime: "",
    contactPhone: "",
    specialInstructions: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [assignedCollector, setAssignedCollector] = useState<AssignedCollector | null>(null);

  // Get user's location with improved error handling
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
      // Fallback vers Douala
      const defaultCoords: [number, number] = [9.7679, 4.0511];
      setCoordinates(defaultCoords);
      setLocationStatus('success');
      return;
    }

    setLocationStatus('loading');
    
    // Première tentative avec haute précision
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
        setCoordinates(coords);
        setLocationStatus('success');
        console.log('📍 Position obtenue avec haute précision:', coords);
        toast.success('Position obtenue avec succès');
      },
      (error) => {
        console.warn('⚠️ Erreur haute précision, tentative avec précision normale...', error.message);
        
        // Deuxième tentative avec précision normale
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
            setCoordinates(coords);
            setLocationStatus('success');
            console.log('📍 Position obtenue avec précision normale:', coords);
            toast.success('Position obtenue avec succès');
          },
          (error) => {
            console.error('❌ Erreur géolocalisation finale:', error);
            setLocationStatus('error');
            toast.error('Impossible d\'obtenir votre position. Position par défaut utilisée.');
            
            // Fallback vers Douala
            const defaultCoords: [number, number] = [9.7679, 4.0511];
            setCoordinates(defaultCoords);
            setLocationStatus('success');
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 300000
          }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  };

  // Mapping des types de déchets français vers anglais
  const mapWasteType = (frontendType: string): string => {
    const wasteTypeMapping: { [key: string]: string } = {
      'Papier/Carton': 'paper',
      'Plastique': 'plastic',
      'Verre': 'glass',
      'Métal': 'metal',
      'Organique': 'organic',
      'Électronique': 'electronic',
      'Textile': 'textile',
      'Bois': 'wood',
      'Déchets Dangereux': 'hazardous',
      'Encombrants': 'bulky',
      'Autre': 'mixed'
    };
    
    const mapped = wasteTypeMapping[frontendType] || 'mixed';
    console.log('🔄 Mapping type déchet:', frontendType, '→', mapped);
    return mapped;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.wasteType || !formData.address || !formData.preferredDate || !formData.preferredTime || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (formData.description.length < 10) {
      toast.error("La description doit contenir au moins 10 caractères");
      return;
    }

    if (formData.address.length < 5) {
      toast.error("L'adresse doit contenir au moins 5 caractères");
      return;
    }

    if (formData.estimatedWeight <= 0) {
      toast.error("Le poids estimé doit être supérieur à 0");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare data for API avec mapping des types
      const requestData = {
        wasteType: mapWasteType(formData.wasteType),
        description: formData.description,
        estimatedWeight: formData.estimatedWeight,
        address: formData.address,
        urgency: formData.urgency,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        notes: formData.specialInstructions,
        coordinates: coordinates || undefined
      };

      console.log('🗑️ Création de la demande avec les données:', requestData);

      // Create request using our service
      const result = await wasteRequestService.createRequest(requestData);
      
      console.log('✅ Demande créée:', result);
      
      // Check if a collector was assigned (from API response)
      // The API returns assignedCollector as a separate field in the response
      const response = result as any; // The service returns created request object
      if (response?.assignedCollector) {
        setAssignedCollector(response.assignedCollector);
        toast.success(`Demande créée et assignée au collecteur ${response.assignedCollector.firstName ? `${response.assignedCollector.firstName} ${response.assignedCollector.lastName}` : response.assignedCollector.name || ''} !`);
      } else {
        toast.success("Demande créée avec succès - en attente d'assignation");
      }

      // Call callbacks
      if (onSubmit) {
        onSubmit(formData);
      }
      if (onSuccess) {
        onSuccess();
      }

      // Redirect user to the real-time map to track their request
      try {
        const createdId = (response && (response._id || response.id)) || '';
        const targetUrl = createdId ? `/dashboard/user/map?focus=${createdId}` : `/dashboard/user/map`;
        router.push(targetUrl);
      } catch (e) {
        console.warn('⚠️ Redirection map échouée, ouverture simple de la carte');
        router.push('/dashboard/user/map');
      }
      
      // Reset form
      setFormData({
        wasteType: "",
        description: "",
        estimatedWeight: 0,
        address: "",
        urgency: "medium",
        preferredDate: "",
        preferredTime: "",
        contactPhone: "",
        specialInstructions: "",
      });
      setCoordinates(null);
      setLocationStatus('idle');
      setAssignedCollector(null);
      
    } catch (err) {
      console.error('❌ Erreur création demande:', err);
      
      // Afficher l'erreur spécifique si disponible
      if (err instanceof Error) {
        if (err.message.includes('Données invalides')) {
          toast.error('Données invalides - Vérifiez tous les champs obligatoires');
        } else {
          toast.error(`Erreur: ${err.message}`);
        }
      } else {
        toast.error('Erreur lors de la création de la demande');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof WasteRequestFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Nouvelle demande de collecte</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Informations de la demande
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wasteType">Type de déchet *</Label>
                <Select
                  value={formData.wasteType}
                  onValueChange={(value) => handleInputChange("wasteType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Papier/Carton">Papier/Carton</SelectItem>
                    <SelectItem value="Plastique">Plastique</SelectItem>
                    <SelectItem value="Verre">Verre</SelectItem>
                    <SelectItem value="Métal">Métal</SelectItem>
                    <SelectItem value="Organique">Organique</SelectItem>
                    <SelectItem value="Électronique">Électronique</SelectItem>
                    <SelectItem value="Textile">Textile</SelectItem>
                    <SelectItem value="Bois">Bois</SelectItem>
                    <SelectItem value="Déchets Dangereux">Déchets Dangereux</SelectItem>
                    <SelectItem value="Encombrants">Encombrants</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedWeight">Poids estimé (kg) *</Label>
                <Input
                  id="estimatedWeight"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.estimatedWeight || ""}
                  onChange={(e) => handleInputChange("estimatedWeight", parseFloat(e.target.value) || 0)}
                  placeholder="Ex: 5.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse de collecte *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Adresse complète où récupérer les déchets (minimum 5 caractères)"
                minLength={5}
              />
            </div>

            {/* Géolocalisation */}
            <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Géolocalisation</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getUserLocation}
                  disabled={locationStatus === 'loading'}
                >
                  {locationStatus === 'loading' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {locationStatus === 'success' && <CheckCircle className="h-4 w-4 mr-2 text-green-600" />}
                  {locationStatus === 'loading' ? 'Localisation...' : locationStatus === 'success' ? 'Position obtenue' : 'Obtenir ma position'}
                </Button>
              </div>
              
              {locationStatus === 'success' && coordinates && (
                <div className="text-xs text-muted-foreground">
                  📍 Position: {coordinates[1].toFixed(4)}, {coordinates[0].toFixed(4)}
                  <br />
                  💡 Cela nous aide à trouver le collecteur le plus proche de vous
                </div>
              )}
              
              {locationStatus === 'error' && (
                <Alert>
                  <AlertDescription className="text-sm">
                    Impossible d'obtenir votre position. La demande sera créée sans géolocalisation.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Détails supplémentaires sur les déchets à collecter (minimum 10 caractères)..."
                rows={3}
                minLength={10}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgence</Label>
                <Select
                  value={formData.urgency}
                  onValueChange={(value: "low" | "medium" | "high" | "urgent") => handleInputChange("urgency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredDate">Date préférée *</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTime">Heure préférée *</Label>
                <Select
                  value={formData.preferredTime}
                  onValueChange={(value) => handleInputChange("preferredTime", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir l'heure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">08:00 - 10:00</SelectItem>
                    <SelectItem value="10:00">10:00 - 12:00</SelectItem>
                    <SelectItem value="12:00">12:00 - 14:00</SelectItem>
                    <SelectItem value="14:00">14:00 - 16:00</SelectItem>
                    <SelectItem value="16:00">16:00 - 18:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Téléphone de contact (optionnel)</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone || ""}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                placeholder="+221 XX XXX XX XX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Instructions spéciales (optionnel)</Label>
              <Textarea
                id="specialInstructions"
                value={formData.specialInstructions || ""}
                onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                placeholder="Instructions particulières pour la collecte..."
                rows={2}
              />
            </div>

            {/* Collecteur assigné */}
            {assignedCollector && (
              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Collecteur assigné !</span>
                </div>
                <div className="space-y-1 text-sm text-green-700">
                  <p><strong>Nom :</strong> {assignedCollector.name}</p>
                  <p><strong>Téléphone :</strong> {assignedCollector.phone}</p>
                  <p><strong>Distance :</strong> ~{assignedCollector.distance}m de vous</p>
                </div>
                <div className="mt-2 text-xs text-green-600">
                  💡 Le collecteur a été automatiquement notifié de votre demande
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Création en cours..." : "Créer la demande"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
