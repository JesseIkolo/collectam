"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Package, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Truck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateWasteRequestForm } from '@/components/dashboard/forms/CreateWasteRequestForm';

interface CollectionRequest {
  id: string;
  wasteType: string;
  quantity: number;
  unit: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  preferredDate: string;
  preferredTime: string;
  address: string;
  description: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  assignedCollector?: string;
  estimatedCost?: number;
}

export default function WasteCollectionPage() {
  const [requests, setRequests] = useState<CollectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    // Simuler des données
    setTimeout(() => {
      setRequests([
        {
          id: '1',
          wasteType: 'Papier/Carton',
          quantity: 50,
          unit: 'kg',
          urgency: 'medium',
          preferredDate: '2024-01-25',
          preferredTime: '14:00',
          address: 'Avenue Léopold Sédar Senghor, Dakar',
          description: 'Cartons d\'emballage et papiers de bureau',
          status: 'confirmed',
          createdAt: '2024-01-20T10:00:00Z',
          assignedCollector: 'Mamadou Diallo',
          estimatedCost: 15000
        },
        {
          id: '2',
          wasteType: 'Électronique',
          quantity: 10,
          unit: 'unités',
          urgency: 'high',
          preferredDate: '2024-01-22',
          preferredTime: '09:00',
          address: 'Zone Industrielle, Dakar',
          description: 'Ordinateurs et équipements électroniques obsolètes',
          status: 'pending',
          createdAt: '2024-01-21T14:30:00Z',
          estimatedCost: 25000
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleNewRequest = (requestData: any) => {
    const newRequest: CollectionRequest = {
      id: Date.now().toString(),
      wasteType: requestData.wasteType,
      quantity: requestData.estimatedWeight, // Le formulaire existant utilise estimatedWeight
      unit: 'kg',
      urgency: requestData.urgency,
      preferredDate: requestData.preferredDate,
      preferredTime: requestData.preferredTime,
      address: requestData.address,
      description: requestData.description,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setRequests(prev => [newRequest, ...prev]);
    setShowForm(false);
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmé', icon: CheckCircle },
      in_progress: { color: 'bg-purple-100 text-purple-800', label: 'En cours', icon: Truck },
      completed: { color: 'bg-green-100 text-green-800', label: 'Terminé', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Annulé', icon: AlertTriangle }
    };
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1 text-xs`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    const labels = {
      low: 'Faible',
      medium: 'Moyen',
      high: 'Élevé',
      urgent: 'Urgent'
    };
    return (
      <Badge className={`${colors[urgency as keyof typeof colors]} text-xs`}>
        {labels[urgency as keyof typeof labels]}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Gestion des Déchets</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gérez vos demandes de collecte et le suivi de vos déchets
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Demande
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes Actives</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.filter(r => ['pending', 'confirmed', 'in_progress'].includes(r.status)).length}</div>
            <p className="text-xs text-muted-foreground">
              En cours de traitement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ce Mois</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">
              Demandes créées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coût Estimé</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.reduce((sum, r) => sum + (r.estimatedCost || 0), 0).toLocaleString()} XOF
            </div>
            <p className="text-xs text-muted-foreground">
              Total estimé
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Collection Requests */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <Package className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="font-semibold truncate">{request.wasteType}</h3>
                          <div className="flex gap-2">
                            {getStatusBadge(request.status)}
                            {getUrgencyBadge(request.urgency)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Quantité:</p>
                            <p className="font-medium">{request.quantity} {request.unit}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Date souhaitée:</p>
                            <p className="font-medium">
                              {new Date(request.preferredDate).toLocaleDateString('fr-FR')} à {request.preferredTime}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Adresse:</p>
                            <p className="font-medium truncate">{request.address}</p>
                          </div>
                          {request.estimatedCost && (
                            <div>
                              <p className="text-muted-foreground">Coût estimé:</p>
                              <p className="font-medium">{request.estimatedCost.toLocaleString()} XOF</p>
                            </div>
                          )}
                          {request.assignedCollector && (
                            <div>
                              <p className="text-muted-foreground">Collecteur assigné:</p>
                              <p className="font-medium">{request.assignedCollector}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-muted-foreground">Créée le:</p>
                            <p className="font-medium">{new Date(request.createdAt).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      {request.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          Annuler
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="space-y-4">
            {requests.filter(r => r.status === 'pending').map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  {/* Same content as above but filtered */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{request.wasteType}</h3>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          <div className="space-y-4">
            {requests.filter(r => r.status === 'confirmed').map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{request.wasteType}</h3>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="space-y-4">
            {requests.filter(r => r.status === 'completed').map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{request.wasteType}</h3>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Nouvelle Demande de Ramassage</h2>
                <Button variant="ghost" onClick={() => setShowForm(false)}>
                  ×
                </Button>
              </div>
              <CreateWasteRequestForm 
                onSubmit={handleNewRequest}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
