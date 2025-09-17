"use client";

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Subscription {
  id: string;
  planName: string;
  price: number;
  period: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  downloadUrl?: string;
}

interface BillingData {
  subscription: Subscription;
  invoices: Invoice[];
  nextPayment: {
    date: string;
    amount: number;
  };
}

export default function BillingPage() {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      // Simuler des données pour l'instant
      setTimeout(() => {
        setBillingData({
          subscription: {
            id: 'sub_123',
            planName: 'Trimestriel',
            price: 25000,
            period: '3 mois',
            status: 'active',
            startDate: '2024-01-15',
            endDate: '2024-04-15',
            autoRenew: true
          },
          invoices: [
            {
              id: 'inv_001',
              date: '2024-01-15',
              amount: 25000,
              status: 'paid',
              description: 'Abonnement Trimestriel - Q1 2024'
            },
            {
              id: 'inv_002',
              date: '2023-10-15',
              amount: 25000,
              status: 'paid',
              description: 'Abonnement Trimestriel - Q4 2023'
            },
            {
              id: 'inv_003',
              date: '2023-07-15',
              amount: 10000,
              status: 'paid',
              description: 'Abonnement Mensuel - Juillet 2023'
            }
          ],
          nextPayment: {
            date: '2024-04-15',
            amount: 25000
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast.error("Impossible de charger les données de facturation");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0
    }).format(price) + ' XOF';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'active': { color: 'bg-green-100 text-green-800', label: 'Actif', icon: CheckCircle },
      'expired': { color: 'bg-red-100 text-red-800', label: 'Expiré', icon: AlertCircle },
      'cancelled': { color: 'bg-gray-100 text-gray-800', label: 'Annulé', icon: AlertCircle },
      'paid': { color: 'bg-green-100 text-green-800', label: 'Payé', icon: CheckCircle },
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente', icon: AlertCircle },
      'overdue': { color: 'bg-red-100 text-red-800', label: 'En retard', icon: AlertCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const handleCancelSubscription = async () => {
    if (confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) {
      try {
        // API call to cancel subscription
        toast.success("Abonnement annulé avec succès");
        fetchBillingData();
      } catch (error) {
        toast.error("Erreur lors de l'annulation");
      }
    }
  };

  const toggleAutoRenew = async () => {
    try {
      // API call to toggle auto-renew
      toast.success("Renouvellement automatique mis à jour");
      fetchBillingData();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facturation</h1>
          <p className="text-muted-foreground">Gérez votre abonnement et vos factures</p>
        </div>
        <Button variant="outline" onClick={fetchBillingData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Subscription Overview */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span>Abonnement Actuel</span>
              {getStatusBadge(billingData?.subscription.status || 'active')}
            </CardTitle>
            <CardDescription>
              Plan {billingData?.subscription.planName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="text-muted-foreground">Prix:</span>
              <span className="font-medium">
                {formatPrice(billingData?.subscription.price || 0)} / {billingData?.subscription.period}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="text-muted-foreground">Date de début:</span>
              <span>{formatDate(billingData?.subscription.startDate || '')}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="text-muted-foreground">Date de fin:</span>
              <span>{formatDate(billingData?.subscription.endDate || '')}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="text-muted-foreground">Renouvellement auto:</span>
              <span>{billingData?.subscription.autoRenew ? 'Activé' : 'Désactivé'}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button variant="outline" size="sm" onClick={toggleAutoRenew} className="w-full sm:w-auto">
                {billingData?.subscription.autoRenew ? 'Désactiver' : 'Activer'} le renouvellement
              </Button>
              <Button variant="destructive" size="sm" onClick={handleCancelSubscription} className="w-full sm:w-auto">
                Annuler l'abonnement
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Prochain Paiement
            </CardTitle>
            <CardDescription>
              Votre prochain prélèvement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-primary">
                {formatPrice(billingData?.nextPayment.amount || 0)}
              </div>
              <div className="text-muted-foreground">
                le {formatDate(billingData?.nextPayment.date || '')}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Mettre à jour le moyen de paiement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
          <TabsTrigger value="plans">Changer de Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Factures</CardTitle>
              <CardDescription>
                Toutes vos factures et paiements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingData?.invoices.map((invoice) => (
                  <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{invoice.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(invoice.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="text-left sm:text-right">
                        <p className="font-medium">{formatPrice(invoice.amount)}</p>
                        <div className="mt-1">
                          {getStatusBadge(invoice.status)}
                        </div>
                      </div>
                      
                      {invoice.status === 'paid' && (
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Changer de Plan</CardTitle>
              <CardDescription>
                Modifiez votre abonnement selon vos besoins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-semibold mb-2">Mensuel</h3>
                  <div className="text-2xl font-bold mb-2">10 000 XOF</div>
                  <div className="text-sm text-muted-foreground mb-4">par mois</div>
                  <Button variant="outline" className="w-full">
                    Choisir ce plan
                  </Button>
                </div>
                
                <div className="border-2 border-primary rounded-lg p-4 text-center">
                  <Badge className="mb-2">Actuel</Badge>
                  <h3 className="font-semibold mb-2">Trimestriel</h3>
                  <div className="text-2xl font-bold mb-2">25 000 XOF</div>
                  <div className="text-sm text-muted-foreground mb-4">pour 3 mois</div>
                  <Button disabled className="w-full">
                    Plan actuel
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="font-semibold mb-2">Annuel</h3>
                  <div className="text-2xl font-bold mb-2">72 000 XOF</div>
                  <div className="text-sm text-muted-foreground mb-4">par an</div>
                  <Button className="w-full">
                    Choisir ce plan
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
