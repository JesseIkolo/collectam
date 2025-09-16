"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  User, 
  Edit, 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  Building,
  Calendar,
  Shield
} from "lucide-react";
import { AuthService } from "@/lib/auth";
import { toast } from "sonner";

export function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    companyName: "",
    userType: ""
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        companyName: currentUser.companyName || "",
        userType: currentUser.userType || "menage"
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      // In a real implementation, you would call an API to update the user profile
      toast.success("Profil mis à jour avec succès");
      setEditing(false);
      
      // Update local storage with new data
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'menage': return 'Ménage';
      case 'collecteur': return 'Collecteur';
      case 'collectam-business': return 'Collectam Business';
      case 'entreprise': return 'Entreprise';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Mon Profil</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
        
        <Button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className="flex items-center gap-2"
        >
          {editing ? (
            <>
              <Save className="h-4 w-4" />
              Enregistrer
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Modifier
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                {editing ? (
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                ) : (
                  <p className="text-sm">{user?.firstName || "Non renseigné"}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                {editing ? (
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                ) : (
                  <p className="text-sm">{user?.lastName || "Non renseigné"}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              {editing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              ) : (
                <p className="text-sm">{user?.email || "Non renseigné"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Téléphone
              </Label>
              {editing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              ) : (
                <p className="text-sm">{user?.phone || "Non renseigné"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresse
              </Label>
              {editing ? (
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                />
              ) : (
                <p className="text-sm">{user?.address || "Non renseignée"}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informations du compte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Informations du compte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Type d'utilisateur</Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {getUserTypeLabel(user?.userType || "menage")}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rôle</Label>
              <p className="text-sm capitalize">{user?.role || "user"}</p>
            </div>

            {(user?.userType === 'entreprise' || user?.userType === 'collectam-business') && (
              <div className="space-y-2">
                <Label htmlFor="companyName" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Nom de l'entreprise
                </Label>
                {editing ? (
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                ) : (
                  <p className="text-sm">{user?.companyName || "Non renseigné"}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Membre depuis
              </Label>
              <p className="text-sm">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : "Date inconnue"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Préférences */}
      <Card>
        <CardHeader>
          <CardTitle>Préférences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notifications par email</h4>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications sur les collectes et mises à jour
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurer
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notifications push</h4>
                <p className="text-sm text-muted-foreground">
                  Recevoir des alertes en temps réel sur votre appareil
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
