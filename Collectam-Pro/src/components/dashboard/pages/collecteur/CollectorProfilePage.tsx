"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  Star, 
  Award, 
  Calendar,
  Clock,
  Settings,
  Bell,
  Shield,
  Camera,
  Edit3,
  Save,
  X
} from "lucide-react";

export default function CollectorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Jean",
    lastName: "Mballa",
    email: "jean.mballa@collectam.cm",
    phone: "+237 6XX XX XX XX",
    address: "Douala, Cameroun",
    vehicleId: "CAM-001",
    vehicleType: "Camion 5T",
    licenseNumber: "DLA-2024-001",
    experience: "3 ans",
    rating: 4.8,
    totalCollections: 1247,
    bio: "Collecteur expérimenté spécialisé dans les déchets organiques et plastiques. Passionné par l'environnement et la propreté urbaine."
  });

  const [notifications, setNotifications] = useState({
    newMissions: true,
    urgentAlerts: true,
    weeklyReports: false,
    promotions: true
  });

  const handleSave = () => {
    // Ici, on sauvegarderait les données via l'API
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Réinitialiser les données si nécessaire
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informations personnelles */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Changer photo
                  </Button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informations véhicule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Véhicule Assigné
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vehicleId">ID Véhicule</Label>
                  <Input
                    id="vehicleId"
                    value={profileData.vehicleId}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Type de Véhicule</Label>
                  <Input
                    id="vehicleType"
                    value={profileData.vehicleType}
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Numéro de Permis</Label>
                <Input
                  id="licenseNumber"
                  value={profileData.licenseNumber}
                  onChange={(e) => setProfileData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Préférences notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nouvelles missions</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications pour les nouvelles missions
                  </p>
                </div>
                <Switch
                  checked={notifications.newMissions}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, newMissions: checked }))
                  }
                  disabled={!isEditing}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertes urgentes</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications pour les collectes urgentes
                  </p>
                </div>
                <Switch
                  checked={notifications.urgentAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, urgentAlerts: checked }))
                  }
                  disabled={!isEditing}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rapports hebdomadaires</Label>
                  <p className="text-sm text-muted-foreground">
                    Résumé de vos performances chaque semaine
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                  }
                  disabled={!isEditing}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Promotions</Label>
                  <p className="text-sm text-muted-foreground">
                    Informations sur les bonus et récompenses
                  </p>
                </div>
                <Switch
                  checked={notifications.promotions}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, promotions: checked }))
                  }
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar avec statistiques */}
        <div className="space-y-6">
          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Mes Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{profileData.rating}</span>
                </div>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Collectes totales</span>
                  <Badge variant="secondary">{profileData.totalCollections}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Expérience</span>
                  <Badge variant="outline">{profileData.experience}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Statut</span>
                  <Badge className="bg-green-600">Actif</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges et récompenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Badges Obtenus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 border rounded-lg">
                  <Award className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
                  <p className="text-xs font-medium">Expert</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <Star className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                  <p className="text-xs font-medium">5 étoiles</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <Clock className="h-6 w-6 mx-auto mb-1 text-green-500" />
                  <p className="text-xs font-medium">Ponctuel</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <Shield className="h-6 w-6 mx-auto mb-1 text-purple-500" />
                  <p className="text-xs font-medium">Sécurisé</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Changer mot de passe
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Gérer disponibilités
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Support technique
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
