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
import { AuthService } from '@/lib/auth';

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

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  popular?: boolean;
  features: string[];
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
  const [showPlanChange, setShowPlanChange] = useState(false);
  const [changingPlan, setChangingPlan] = useState<string | null>(null);

  // Plans disponibles (synchronisés avec BusinessPricing.tsx)
  const availablePlans: Plan[] = [
    {
      id: 'business-monthly',
      name: 'Mensuel',
      price: 10000,
      period: '1 mois',
      features: [
        'Véhicules illimités',
        'Collecteurs illimités', 
        'Tableau de bord avancé',
        'Support prioritaire'
      ]
    },
    {
      id: 'business-quarterly',
      name: 'Trimestriel',
      price: 25000,
      period: '3 mois',
      popular: true,
      features: [
        'Véhicules illimités',
        'Collecteurs illimités',
        'Tableau de bord avancé', 
        'Support prioritaire',
        'Économie de 5 000 XOF'
      ]
    },
    {
      id: 'business-yearly',
      name: 'Annuel',
      price: 72000,
      period: '1 an',
      features: [
        'Véhicules illimités',
        'Collecteurs illimités',
        'Tableau de bord avancé',
        'Support prioritaire',
        'Économie de 48 000 XOF'
      ]
    }
  ];

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      // Récupérer les données réelles de l'utilisateur
      const currentUser = AuthService.getUser();
      console.log('🔍 Current user data:', currentUser);
      const userSubscription = currentUser?.subscription;
      console.log('🔍 User subscription:', userSubscription);
      
      // Debug: Vérifier le localStorage brut
      const rawUserData = localStorage.getItem('user');
      console.log('🔍 Raw localStorage user data:', rawUserData);
      
      // Si pas de planId dans subscription, essayer de le déduire du localStorage
      let actualPlanId = userSubscription?.planId;
      if (!actualPlanId && rawUserData) {
        try {
          const parsedData = JSON.parse(rawUserData);
          actualPlanId = parsedData?.subscription?.planId;
          console.log('🔍 Plan ID from raw localStorage:', actualPlanId);
        } catch (e) {
          console.warn('⚠️ Erreur parsing localStorage:', e);
        }
      }
      
      // Mapping des plans depuis BusinessPricing
      const planMapping = {
        'business-monthly': { name: 'Mensuel', price: 10000, period: '1 mois' },
        'business-quarterly': { name: 'Trimestriel', price: 25000, period: '3 mois' },
        'business-yearly': { name: 'Annuel', price: 72000, period: '1 an' }
      };
      
      setTimeout(() => {
        console.log('🔍 Plan ID trouvé:', userSubscription?.planId);
        console.log('🔍 Subscription complète:', userSubscription);
        
        // Utiliser le planId trouvé (soit depuis subscription, soit depuis localStorage)
        const finalPlanId = actualPlanId || 'business-monthly';
        console.log('🔍 Final Plan ID utilisé:', finalPlanId);
        
        const planInfo = planMapping[finalPlanId as keyof typeof planMapping] || planMapping['business-monthly'];
        
        console.log('📋 Plan info sélectionné:', planInfo);
        
        setBillingData({
          subscription: {
            id: userSubscription?.id || 'sub_default',
            planName: planInfo?.name || 'Mensuel',
            price: planInfo?.price || 10000,
            period: planInfo?.period || '1 mois',
            status: userSubscription?.status || 'active',
            startDate: userSubscription?.startDate || '2024-01-15',
            endDate: userSubscription?.endDate || '2024-04-15',
            autoRenew: userSubscription?.autoRenew ?? true
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
    const confirmMessage = `⚠️ ATTENTION - Annulation d'abonnement

Êtes-vous sûr de vouloir annuler votre abonnement ?

Conséquences :
• Votre abonnement restera actif jusqu'à la fin de la période payée
• Vous perdrez l'accès aux fonctionnalités Business après expiration
• Aucun remboursement ne sera effectué pour la période en cours
• Vous pourrez vous réabonner à tout moment

Cette action est irréversible.`;

    if (confirm(confirmMessage)) {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('Vous devez être connecté pour annuler votre abonnement');
        }

        console.log('🚫 Tentative d\'annulation d\'abonnement...');
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/business-subscription/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Mettre à jour les données utilisateur
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          if (userData.subscription) {
            userData.subscription.status = 'cancelled';
            userData.subscription.autoRenew = false;
            localStorage.setItem('user', JSON.stringify(userData));
          }

          toast.success("Abonnement annulé avec succès. Il restera actif jusqu'à la fin de la période payée.");
          fetchBillingData(); // Recharger les données
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de l\'annulation');
        }
      } catch (error) {
        console.error('❌ Erreur annulation:', error);
        toast.error(error instanceof Error ? error.message : "Erreur lors de l'annulation de l'abonnement");
      }
    }
  };

  const handleChangePlan = async (newPlanId: string) => {
    setChangingPlan(newPlanId);
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Aucun token d\'authentification trouvé. Veuillez vous reconnecter.');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/business-subscription/change-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPlanId })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Mettre à jour les données utilisateur dans localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        userData.subscription = data.data.subscription;
        localStorage.setItem('user', JSON.stringify(userData));

        toast.success("Votre plan a été changé avec succès");
        setShowPlanChange(false);
        fetchBillingData(); // Recharger les données
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors du changement de plan');
      }
    } catch (error) {
      console.error('Plan change error:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors du changement de plan");
    } finally {
      setChangingPlan(null);
    }
  };

  const getCurrentPlanId = () => {
    const currentUser = AuthService.getUser();
    
    // Essayer plusieurs sources comme dans fetchBillingData
    let planId = currentUser?.subscription?.planId;
    
    if (!planId) {
      const rawUserData = localStorage.getItem('user');
      if (rawUserData) {
        try {
          const parsedData = JSON.parse(rawUserData);
          planId = parsedData?.subscription?.planId;
        } catch (e) {
          console.warn('⚠️ Erreur parsing localStorage dans getCurrentPlanId:', e);
        }
      }
    }
    
    const finalPlanId = planId || 'business-monthly';
    console.log('🔍 getCurrentPlanId - Plan ID final:', finalPlanId);
    console.log('🔍 Raw user data check:', currentUser);
    return finalPlanId;
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
            
            <div className="flex flex-col gap-2 pt-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="default" size="sm" onClick={() => {
                  const plansTab = document.querySelector('[value="plans"]') as HTMLElement;
                  plansTab?.click();
                }} className="w-full sm:w-auto">
                  Changer de Plan
                </Button>
                <Button variant="outline" size="sm" onClick={toggleAutoRenew} className="w-full sm:w-auto text-xs sm:text-sm">
                  {billingData?.subscription.autoRenew ? 'Désactiver' : 'Activer'} le renouvellement
                </Button>
              </div>
              <Button variant="destructive" size="sm" onClick={handleCancelSubscription} className="w-full">
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
                {availablePlans.map((plan) => {
                  const currentPlanId = getCurrentPlanId();
                  const isCurrentPlan = currentPlanId === plan.id;
                  const isChanging = changingPlan === plan.id;
                  
                  console.log(`🔍 Plan ${plan.name} (${plan.id}): isCurrentPlan=${isCurrentPlan}, currentPlanId=${currentPlanId}, popular=${plan.popular}, shouldShowGrayRing=${plan.popular && !isCurrentPlan}`);
                  
                  return (
                    <div 
                      key={plan.id}
                      className={`border rounded-lg p-4 text-center ${
                        isCurrentPlan ? 'border-2 border-blue-500 bg-blue-50 ring-2 ring-blue-500' : ''
                      } ${plan.popular && !isCurrentPlan ? 'ring-2 ring-gray-400 border-gray-300' : ''}`}
                    >
                      <div className="mb-2 flex justify-center gap-2">
                        {isCurrentPlan && <Badge variant="secondary">Plan Actuel</Badge>}
                        {plan.popular && <Badge variant="default">Populaire</Badge>}
                      </div>
                      
                      <h3 className="font-semibold mb-2">{plan.name}</h3>
                      <div className="text-2xl font-bold mb-1">{formatPrice(plan.price)}</div>
                      <div className="text-sm text-muted-foreground mb-4">par {plan.period}</div>
                      
                      <ul className="text-sm text-left mb-4 space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        variant={isCurrentPlan ? "secondary" : "default"}
                        className="w-full"
                        disabled={isCurrentPlan || isChanging}
                        onClick={() => handleChangePlan(plan.id)}
                      >
                        {isChanging ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Changement...
                          </>
                        ) : isCurrentPlan ? (
                          "Plan Actuel"
                        ) : (
                          "Choisir ce plan"
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Information importante</h4>
                <p className="text-sm text-blue-800">
                  Le changement de plan prendra effet immédiatement. 
                  Si vous passez à un plan plus cher, la différence sera facturée au prorata. 
                  Si vous passez à un plan moins cher, le crédit sera appliqué à votre prochaine facture.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
