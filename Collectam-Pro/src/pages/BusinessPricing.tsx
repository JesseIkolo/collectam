"use client";

import React, { useState } from 'react';
import { Check, Crown, Users, Truck, BarChart3, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  popular?: boolean;
  features: string[];
}

const BusinessPricing: React.FC = () => {
  const [subscribing, setSubscribing] = useState<string | null>(null);

  // Prix fixes comme demandé
  const plans: Plan[] = [
    {
      id: 'business-monthly',
      name: 'Mensuel',
      price: 10000,
      period: 'mois',
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
      period: 'an',
      features: [
        'Véhicules illimités',
        'Collecteurs illimités',
        'Tableau de bord avancé',
        'Support prioritaire',
        'Économie de 48 000 XOF'
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    setSubscribing(planId);
    
    try {
      // Debug token information
      const token = localStorage.getItem('accessToken');
      console.log('Token exists:', !!token);
      console.log('Token length:', token?.length);
      console.log('Token preview:', token?.substring(0, 50) + '...');
      
      if (!token) {
        throw new Error('Aucun token d\'authentification trouvé. Veuillez vous reconnecter.');
      }

      // Decode JWT to check expiration
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const now = Math.floor(Date.now() / 1000);
          const exp = payload.exp;
          
          console.log('Token payload:', payload);
          console.log('Token expires at:', new Date(exp * 1000));
          console.log('Current time:', new Date(now * 1000));
          console.log('Token is expired:', now > exp);
          
          if (now > exp) {
            throw new Error('Token expiré. Veuillez vous reconnecter.');
          }
        }
      } catch (decodeError) {
        console.warn('Could not decode token:', decodeError);
      }

      // Use environment variable for API URL or fallback to localhost:5000
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/business-subscription/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        
        // Update user data in localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        userData.userType = 'collectam-business';
        userData.subscription = data.data.subscription;
        console.log('💾 Saving subscription data:', data.data.subscription);
        console.log('💾 Updated user data:', userData);
        localStorage.setItem('user', JSON.stringify(userData));

        toast.success("Votre abonnement Business a été activé avec succès");

        // Redirect to business dashboard
        window.location.href = '/dashboard/business';
      } else {
        const responseText = await response.text();
        console.error('Error response:', responseText);
        
        // Try to parse as JSON, fallback to text
        let errorMessage = 'Erreur lors de l\'abonnement';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      
      if (error instanceof Error && error.message.includes('<!DOCTYPE')) {
        toast.error("Erreur de connexion au serveur. Vérifiez que le serveur backend est démarré.");
      } else {
        toast.error(error instanceof Error ? error.message : "Erreur lors de l'abonnement");
      }
    } finally {
      setSubscribing(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0
    }).format(price) + ' XOF';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 relative">
          {/* Logout button for testing */}
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute top-0 right-0"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/auth/v2/login';
            }}
          >
            Se déconnecter
          </Button>
          
          <h1 className="text-4xl font-bold mb-4">
            Collectam Business
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Véhicules et collecteurs illimités. Outils professionnels.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-primary border-2' : ''} hover:shadow-lg transition-shadow`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Crown className="w-3 h-3 mr-1" />
                  Populaire
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <div className="text-3xl font-bold">
                    {formatPrice(plan.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    / {plan.period}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={subscribing === plan.id}
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {subscribing === plan.id ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Activation...
                    </div>
                  ) : (
                    'Choisir ce plan'
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">
            Pourquoi Collectam Business ?
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Flotte illimitée</h3>
              <p className="text-sm text-muted-foreground">Ajoutez tous vos véhicules</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Équipe étendue</h3>
              <p className="text-sm text-muted-foreground">Gérez tous vos collecteurs</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Analytics</h3>
              <p className="text-sm text-muted-foreground">Suivez vos performances</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Headphones className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Support prioritaire</h3>
              <p className="text-sm text-muted-foreground">Assistance dédiée</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPricing;
