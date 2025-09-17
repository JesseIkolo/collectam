"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface AnalyticsData {
  overview: {
    totalCollections: number;
    totalWeight: number;
    averageResponseTime: number;
    customerSatisfaction: number;
  };
  trends: {
    collectionsThisMonth: number;
    collectionsLastMonth: number;
    weightThisMonth: number;
    weightLastMonth: number;
  };
  topPerformers: {
    collectors: Array<{
      id: string;
      name: string;
      collections: number;
      weight: number;
    }>;
    vehicles: Array<{
      id: string;
      licensePlate: string;
      collections: number;
      efficiency: number;
    }>;
  };
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      // Simuler des données pour l'instant
      setTimeout(() => {
        setAnalyticsData({
          overview: {
            totalCollections: 1247,
            totalWeight: 8945,
            averageResponseTime: 24,
            customerSatisfaction: 4.7
          },
          trends: {
            collectionsThisMonth: 387,
            collectionsLastMonth: 342,
            weightThisMonth: 2890,
            weightLastMonth: 2654
          },
          topPerformers: {
            collectors: [
              { id: '1', name: 'Jean Dupont', collections: 89, weight: 645 },
              { id: '2', name: 'Marie Martin', collections: 76, weight: 589 },
              { id: '3', name: 'Pierre Durand', collections: 68, weight: 512 }
            ],
            vehicles: [
              { id: '1', licensePlate: 'AB-123-CD', collections: 156, efficiency: 94 },
              { id: '2', licensePlate: 'EF-456-GH', collections: 142, efficiency: 91 },
              { id: '3', licensePlate: 'IJ-789-KL', collections: 134, efficiency: 88 }
            ]
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  const calculateTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const collectionsTrend = calculateTrend(
    analyticsData?.trends.collectionsThisMonth || 0,
    analyticsData?.trends.collectionsLastMonth || 1
  );

  const weightTrend = calculateTrend(
    analyticsData?.trends.weightThisMonth || 0,
    analyticsData?.trends.weightLastMonth || 1
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Analytics & Rapports</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Suivez les performances de votre flotte</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">3 derniers mois</option>
            <option value="1y">Dernière année</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collectes</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.overview.totalCollections}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {collectionsTrend.isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={collectionsTrend.isPositive ? 'text-green-500' : 'text-red-500'}>
                +{collectionsTrend.value}%
              </span>
              <span className="ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Poids Total</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.overview.totalWeight} kg</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {weightTrend.isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={weightTrend.isPositive ? 'text-green-500' : 'text-red-500'}>
                +{weightTrend.value}%
              </span>
              <span className="ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de Réponse</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.overview.averageResponseTime}h</div>
            <p className="text-xs text-muted-foreground">Temps moyen de réponse</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Client</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.overview.customerSatisfaction}/5</div>
            <p className="text-xs text-muted-foreground">Note moyenne</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="geography">Géographie</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Collecteurs</CardTitle>
                <CardDescription>Meilleurs performeurs ce mois</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData?.topPerformers.collectors.map((collector, index) => (
                  <div key={collector.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{collector.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {collector.collections} collectes • {collector.weight} kg
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Véhicules</CardTitle>
                <CardDescription>Véhicules les plus efficaces</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData?.topPerformers.vehicles.map((vehicle, index) => (
                  <div key={vehicle.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{vehicle.licensePlate}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {vehicle.collections} collectes • {vehicle.efficiency}% efficacité
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution Mensuelle</CardTitle>
              <CardDescription>Comparaison avec le mois précédent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Collectes ce mois</span>
                    <span className="text-sm">{analyticsData?.trends.collectionsThisMonth}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="text-sm">Mois précédent</span>
                    <span className="text-sm">{analyticsData?.trends.collectionsLastMonth}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Poids ce mois</span>
                    <span className="text-sm">{analyticsData?.trends.weightThisMonth} kg</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="text-sm">Mois précédent</span>
                    <span className="text-sm">{analyticsData?.trends.weightLastMonth} kg</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Répartition Géographique</CardTitle>
              <CardDescription>Zones de collecte les plus actives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-4" />
                  <p>Carte géographique à venir</p>
                  <p className="text-sm">Intégration avec les données de localisation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
