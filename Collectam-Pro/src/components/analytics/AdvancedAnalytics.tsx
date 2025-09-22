"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Truck, 
  Package, 
  Clock, 
  MapPin,
  Download,
  Calendar,
  Target,
  Award,
  AlertTriangle
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalCollections: number;
    totalCollectors: number;
    totalWeight: number;
    averageRating: number;
    completionRate: number;
    responseTime: number;
  };
  trends: {
    collections: Array<{ date: string; count: number; weight: number }>;
    collectors: Array<{ date: string; active: number; busy: number }>;
    zones: Array<{ name: string; collections: number; efficiency: number }>;
  };
  performance: {
    topCollectors: Array<{
      id: string;
      name: string;
      collections: number;
      rating: number;
      efficiency: number;
    }>;
    topZones: Array<{
      name: string;
      collections: number;
      avgResponseTime: number;
      satisfaction: number;
    }>;
  };
  predictions: {
    nextWeekDemand: number;
    peakHours: Array<{ hour: number; demand: number }>;
    recommendedCollectors: number;
  };
}

interface AdvancedAnalyticsProps {
  className?: string;
}

export function AdvancedAnalytics({ className }: AdvancedAnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'collections' | 'weight' | 'efficiency'>('collections');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API calls
      // const response = await fetch('/api/analytics/dashboard');
      // const data = await response.json();
      
      // For now, start with empty/zero data
      const emptyData: AnalyticsData = {
        overview: {
          totalCollections: 0,
          totalCollectors: 0,
          totalWeight: 0,
          averageRating: 0,
          completionRate: 0,
          responseTime: 0
        },
        trends: {
          collections: [],
          collectors: [],
          zones: []
        },
        performance: {
          topCollectors: [],
          topZones: []
        },
        predictions: {
          nextWeekDemand: 0,
          peakHours: [],
          recommendedCollectors: 0
        }
      };

      setData(emptyData);
    } catch (error) {
      console.error('❌ Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // In production, generate and download PDF/Excel report
    console.log('📊 Exporting analytics report...');
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Chargement des analytics...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Analytics Avancés</h2>
          <p className="text-muted-foreground">Insights et métriques de performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="90d">90 jours</SelectItem>
              <SelectItem value="1y">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collectes totales</p>
                <p className="text-2xl font-bold">{data.overview.totalCollections.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+12.5%</span>
                </div>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collecteurs actifs</p>
                <p className="text-2xl font-bold">{data.overview.totalCollectors}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+8.7%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Poids total (kg)</p>
                <p className="text-2xl font-bold">{data.overview.totalWeight.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+15.2%</span>
                </div>
              </div>
              <Truck className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux de réussite</p>
                <p className="text-2xl font-bold">{data.overview.completionRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-xs text-red-600">-2.1%</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions IA</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Collectors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Collecteurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.performance.topCollectors.map((collector, index) => (
                    <div key={collector.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{collector.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {collector.collections} collectes • ⭐ {collector.rating}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{collector.efficiency}%</p>
                        <Progress value={collector.efficiency} className="w-16 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Métriques Clés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Temps de réponse moyen</span>
                      <span className="text-sm font-medium">{data.overview.responseTime} min</span>
                    </div>
                    <Progress value={(30 - data.overview.responseTime) / 30 * 100} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Satisfaction client</span>
                      <span className="text-sm font-medium">{data.overview.averageRating}/5</span>
                    </div>
                    <Progress value={data.overview.averageRating / 5 * 100} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Taux de complétion</span>
                      <span className="text-sm font-medium">{data.overview.completionRate}%</span>
                    </div>
                    <Progress value={data.overview.completionRate} />
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Alertes Performance</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>3 collecteurs sous la moyenne</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Zone Deido: temps de réponse élevé</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Collections Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Collectes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Graphique des collectes</p>
                    <p className="text-xs text-muted-foreground">
                      {data.trends.collections.length} points de données
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collectors Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Activité des Collecteurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Graphique d'activité</p>
                    <p className="text-xs text-muted-foreground">
                      Collecteurs actifs vs occupés
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Performance par Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.performance.topZones.map((zone, index) => (
                  <div key={zone.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{zone.name}</h4>
                      <Badge variant="outline">{zone.collections} collectes</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Temps de réponse</p>
                        <p className="font-medium">{zone.avgResponseTime} min</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Satisfaction</p>
                        <p className="font-medium">⭐ {zone.satisfaction}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Efficacité</p>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={data.trends.zones.find(z => z.name === zone.name)?.efficiency || 0} 
                            className="flex-1 h-2" 
                          />
                          <span className="text-xs">
                            {data.trends.zones.find(z => z.name === zone.name)?.efficiency || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Prédictions IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Demande Prévue (7 jours)</h4>
                    <p className="text-2xl font-bold text-blue-700">{data.predictions.nextWeekDemand}</p>
                    <p className="text-sm text-blue-600">collectes estimées</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Collecteurs Recommandés</h4>
                    <p className="text-2xl font-bold text-green-700">{data.predictions.recommendedCollectors}</p>
                    <p className="text-sm text-green-600">pour couvrir la demande</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Heures de Pointe</h4>
                    <div className="space-y-2">
                      {data.predictions.peakHours.map((peak) => (
                        <div key={peak.hour} className="flex items-center justify-between">
                          <span className="text-sm">{peak.hour}h00</span>
                          <div className="flex items-center gap-2">
                            <Progress value={peak.demand} className="w-20 h-2" />
                            <span className="text-xs">{peak.demand}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-medium text-blue-900">Optimisation des Tournées</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Regrouper les collectes dans un rayon de 2km peut réduire le temps de trajet de 23%
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-medium text-green-900">Heures Optimales</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Programmer plus de collecteurs entre 14h-16h pour réduire les temps d'attente
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-medium text-orange-900">Formation Requise</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      3 collecteurs nécessitent une formation pour améliorer leur efficacité
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-medium text-purple-900">Expansion Suggérée</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Zone Makepe montre une forte demande non satisfaite (+34% de demandes)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
