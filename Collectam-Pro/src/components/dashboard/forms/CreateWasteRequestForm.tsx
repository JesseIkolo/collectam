"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface WasteRequestFormData {
  wasteType: string;
  description: string;
  estimatedWeight: number;
  address: string;
  urgency: "low" | "medium" | "high";
  preferredDate: string;
  preferredTime: string;
}

interface CreateWasteRequestFormProps {
  onSubmit: (data: WasteRequestFormData) => void;
  onCancel: () => void;
}

export function CreateWasteRequestForm({ onSubmit, onCancel }: CreateWasteRequestFormProps) {
  const [formData, setFormData] = useState<WasteRequestFormData>({
    wasteType: "",
    description: "",
    estimatedWeight: 0,
    address: "",
    urgency: "medium",
    preferredDate: "",
    preferredTime: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await onSubmit(formData);
      toast.success("Demande de collecte créée avec succès!");
      
      // Reset form
      setFormData({
        wasteType: "",
        description: "",
        estimatedWeight: 0,
        address: "",
        urgency: "medium",
        preferredDate: "",
        preferredTime: "",
      });
    } catch (error) {
      toast.error("Erreur lors de la création de la demande");
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
                    <SelectItem value="plastic">Plastique</SelectItem>
                    <SelectItem value="paper">Papier</SelectItem>
                    <SelectItem value="glass">Verre</SelectItem>
                    <SelectItem value="metal">Métal</SelectItem>
                    <SelectItem value="electronic">Électronique</SelectItem>
                    <SelectItem value="organic">Organique</SelectItem>
                    <SelectItem value="hazardous">Dangereux</SelectItem>
                    <SelectItem value="mixed">Mixte</SelectItem>
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
                  onValueChange={(value: "low" | "medium" | "high") => handleInputChange("urgency", value)}
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
                    <SelectItem value="08:00-10:00">08:00 - 10:00</SelectItem>
                    <SelectItem value="10:00-12:00">10:00 - 12:00</SelectItem>
                    <SelectItem value="12:00-14:00">12:00 - 14:00</SelectItem>
                    <SelectItem value="14:00-16:00">14:00 - 16:00</SelectItem>
                    <SelectItem value="16:00-18:00">16:00 - 18:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
