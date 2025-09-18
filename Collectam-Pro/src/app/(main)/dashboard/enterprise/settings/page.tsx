"use client";

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Building, 
  Users, 
  Bell,
  Shield,
  CreditCard,
  Trash2,
  Save,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { AuthService } from '@/lib/auth';

interface CompanySettings {
  companyName: string;
  siret: string;
  sector: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  description: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  wasteCollectionReminders: boolean;
  complianceAlerts: boolean;
  reportGeneration: boolean;
  monthlyReports: boolean;
  emergencyAlerts: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  allowedIpAddresses: string[];
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyName: '',
    siret: '',
    sector: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    description: ''
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    wasteCollectionReminders: true,
    complianceAlerts: true,
    reportGeneration: true,
    monthlyReports: true,
    emergencyAlerts: true
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    allowedIpAddresses: []
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // Charger les données réelles de l'utilisateur
    const currentUser = AuthService.getUser();
    
    setTimeout(() => {
      setCompanySettings({
        companyName: currentUser?.companyName || '',
        siret: '12345678901234', // À récupérer depuis le profil utilisateur
        sector: 'Technologie', // À récupérer depuis le profil utilisateur
        address: currentUser?.address || '',
        city: 'Dakar', // À récupérer depuis le profil utilisateur
        postalCode: '10200', // À récupérer depuis le profil utilisateur
        country: 'Sénégal', // À récupérer depuis le profil utilisateur
        phone: currentUser?.phone || '',
        email: currentUser?.email || '',
        website: '', // À récupérer depuis le profil utilisateur
        description: '' // À récupérer depuis le profil utilisateur
      });
      setLoading(false);
    }, 1000);
  };

  const handleCompanySettingsChange = (field: keyof CompanySettings, value: string) => {
    setCompanySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationSettingsChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecuritySettingsChange = (field: keyof SecuritySettings, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = async (section: string) => {
    setSaving(true);
    try {
      // Simuler la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Paramètres ${section} sauvegardés avec succès`);
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      try {
        // Simuler la suppression
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Compte supprimé avec succès");
        // Redirection vers la page d'accueil
        window.location.href = '/';
      } catch (error) {
        toast.error("Erreur lors de la suppression du compte");
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Paramètres Entreprise</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gérez les paramètres de votre compte entreprise
          </p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="company">Entreprise</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="danger">Zone Danger</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informations de l'Entreprise
              </CardTitle>
              <CardDescription>
                Mettez à jour les informations de votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    value={companySettings.companyName}
                    onChange={(e) => handleCompanySettingsChange('companyName', e.target.value)}
                    placeholder="Nom de votre entreprise"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siret">SIRET</Label>
                  <Input
                    id="siret"
                    value={companySettings.siret}
                    onChange={(e) => handleCompanySettingsChange('siret', e.target.value)}
                    placeholder="Numéro SIRET"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">Secteur d'activité</Label>
                  <Select 
                    value={companySettings.sector} 
                    onValueChange={(value) => handleCompanySettingsChange('sector', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technologie">Technologie</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Services">Services</SelectItem>
                      <SelectItem value="Commerce">Commerce</SelectItem>
                      <SelectItem value="Santé">Santé</SelectItem>
                      <SelectItem value="Éducation">Éducation</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={companySettings.phone}
                    onChange={(e) => handleCompanySettingsChange('phone', e.target.value)}
                    placeholder="+221 33 123 45 67"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => handleCompanySettingsChange('email', e.target.value)}
                    placeholder="contact@entreprise.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={companySettings.website}
                    onChange={(e) => handleCompanySettingsChange('website', e.target.value)}
                    placeholder="https://www.entreprise.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={companySettings.address}
                  onChange={(e) => handleCompanySettingsChange('address', e.target.value)}
                  placeholder="Adresse complète"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={companySettings.city}
                    onChange={(e) => handleCompanySettingsChange('city', e.target.value)}
                    placeholder="Dakar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={companySettings.postalCode}
                    onChange={(e) => handleCompanySettingsChange('postalCode', e.target.value)}
                    placeholder="10200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input
                    id="country"
                    value={companySettings.country}
                    onChange={(e) => handleCompanySettingsChange('country', e.target.value)}
                    placeholder="Sénégal"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={companySettings.description}
                  onChange={(e) => handleCompanySettingsChange('description', e.target.value)}
                  placeholder="Description de votre entreprise"
                  rows={3}
                />
              </div>

              <Button onClick={() => saveSettings('entreprise')} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Préférences de Notifications
              </CardTitle>
              <CardDescription>
                Configurez vos préférences de notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir les notifications importantes par email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir les alertes urgentes par SMS
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rappels de collecte</Label>
                    <p className="text-sm text-muted-foreground">
                      Rappels avant les collectes programmées
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.wasteCollectionReminders}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('wasteCollectionReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertes de conformité</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications pour les échéances réglementaires
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.complianceAlerts}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('complianceAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Génération de rapports</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications quand les rapports sont prêts
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.reportGeneration}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('reportGeneration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rapports mensuels</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir automatiquement les rapports mensuels
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.monthlyReports}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('monthlyReports', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertes d'urgence</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications pour les situations d'urgence
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emergencyAlerts}
                    onCheckedChange={(checked) => handleNotificationSettingsChange('emergencyAlerts', checked)}
                  />
                </div>
              </div>

              <Button onClick={() => saveSettings('notifications')} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Paramètres de Sécurité
              </CardTitle>
              <CardDescription>
                Renforcez la sécurité de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Ajouter une couche de sécurité supplémentaire
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSecuritySettingsChange('twoFactorAuth', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
                  <Select 
                    value={securitySettings.sessionTimeout.toString()} 
                    onValueChange={(value) => handleSecuritySettingsChange('sessionTimeout', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="120">2 heures</SelectItem>
                      <SelectItem value="480">8 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Expiration du mot de passe (jours)</Label>
                  <Select 
                    value={securitySettings.passwordExpiry.toString()} 
                    onValueChange={(value) => handleSecuritySettingsChange('passwordExpiry', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 jours</SelectItem>
                      <SelectItem value="60">60 jours</SelectItem>
                      <SelectItem value="90">90 jours</SelectItem>
                      <SelectItem value="180">180 jours</SelectItem>
                      <SelectItem value="365">1 an</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nouveau mot de passe"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirmer le nouveau mot de passe"
                  />
                </div>
              </div>

              <Button onClick={() => saveSettings('sécurité')} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Zone de Danger
              </CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Attention :</strong> Ces actions sont irréversibles et peuvent entraîner la perte définitive de vos données.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-600 mb-2">Supprimer le compte entreprise</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Cette action supprimera définitivement votre compte entreprise, tous vos sites, 
                    données de collecte, rapports et historiques. Cette action ne peut pas être annulée.
                  </p>
                  <Button variant="destructive" onClick={deleteAccount}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer le compte
                  </Button>
                </div>

                <div className="border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-600 mb-2">Réinitialiser les données</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supprimer toutes les données de collecte et rapports tout en conservant le compte.
                  </p>
                  <Button variant="outline" className="border-yellow-300 text-yellow-600 hover:bg-yellow-50">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Réinitialiser les données
                  </Button>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-600 mb-2">Exporter les données</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Télécharger une copie complète de toutes vos données avant suppression.
                  </p>
                  <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Exporter les données
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
