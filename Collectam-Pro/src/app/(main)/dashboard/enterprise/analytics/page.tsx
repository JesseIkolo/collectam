"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Recycle,
  DollarSign,
  Leaf,
  Target,
  Building,
  Package
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AnalyticsData {
  period: string;
  wasteMetrics: {
    totalVolume: number;
    volumeChange: number;
    recyclingRate: number;
    recyclingChange: number;
    costPerKg: number;
    costChange: number;
    carbonReduction: number;
    carbonChange: number;
  };
  sitePerformance: {
    siteId: string;
    siteName: string;
    volume: number;
    recyclingRate: number;
    cost: number;
    compliance: number;
    efficiency: number;
  }[];
  wasteTypes: {
    type: string;
    volume: number;
    percentage: number;
    recyclingRate: number;
    cost: number;
    trend: number;
  }[];
  monthlyTrends: {
    month: string;
    volume: number;
    cost: number;
    recycling: number;
    carbon: number;
  }[];
  sustainability: {
    goals: {
      recyclingTarget: number;
      recyclingCurrent: number;
      carbonTarget: number;
      carbonCurrent: number;
      costTarget: number;
      costCurrent: number;
    };
    certifications: {
      name: string;
      status: 'obtained' | 'in_progress' | 'expired';
      date: string;
    }[];
  };
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('3months');
  const [selectedSite, setSelectedSite] = useState('all');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, selectedSite]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    // Simuler des données
    setTimeout(() => {
      setAnalyticsData({
        period: timeRange,
        wasteMetrics: {
          totalVolume: 2340,
          volumeChange: 12.5,
          recyclingRate: 76.8,
          recyclingChange: 8.2,
          costPerKg: 185,
          costChange: -5.3,
          carbonReduction: 1850,
          carbonChange: 15.7
        },
        sitePerformance: [
          {
            siteId: '1',
            siteName: 'Siège Social',
            volume: 450,
            recyclingRate: 82,
            cost: 83250,
            compliance: 95,
            efficiency: 88
          },
          {
            siteId: '2',
            siteName: 'Usine de Production',
            volume: 1500,
            recyclingRate: 74,
            cost: 277500,
            compliance: 88,
            efficiency: 85
          },
          {
            siteId: '3',
            siteName: 'Entrepôt Logistique',
            volume: 240,
            recyclingRate: 85,
            cost: 44400,
            compliance: 92,
            efficiency: 90
          },
          {
            siteId: '4',
            siteName: 'Showroom Commercial',
            volume: 150,
            recyclingRate: 68,
            cost: 27750,
            compliance: 85,
            efficiency: 78
          }
        ],
        wasteTypes: [
          {
            type: 'Recyclable',
            volume: 1053,
            percentage: 45,
            recyclingRate: 95,
            cost: 158000,
            trend: 8.5
          },
          {
            type: 'Organique',
            volume: 702,
            percentage: 30,
            recyclingRate: 85,
            cost: 105300,
            trend: 12.3
          },
          {
            type: 'Général',
            volume: 468,
            percentage: 20,
            recyclingRate: 25,
            cost: 86580,
            trend: -3.2
          },
          {
            type: 'Dangereux',
            volume: 117,
            percentage: 5,
            recyclingRate: 60,
            cost: 82120,
            trend: 5.8
          }
        ],
        monthlyTrends: [
          { month: 'Oct', volume: 2180, cost: 403300, recycling: 74, carbon: 1620 },
          { month: 'Nov', volume: 2250, cost: 416250, recycling: 75, carbon: 1687 },
          { month: 'Déc', volume: 2340, cost: 432900, recycling: 77, carbon: 1850 },
          { month: 'Jan', volume: 2420, cost: 447700, recycling: 78, carbon: 1920 }
        ],
        sustainability: {
          goals: {
            recyclingTarget: 80,
            recyclingCurrent: 76.8,
            carbonTarget: 2000,
            carbonCurrent: 1850,
            costTarget: 400000,
            costCurrent: 432900
          },
          certifications: [
            { name: 'ISO 14001', status: 'obtained', date: '2023-06-15' },
            { name: 'OHSAS 18001', status: 'obtained', date: '2023-08-20' },
            { name: 'ISO 50001', status: 'in_progress', date: '2024-03-15' },
            { name: 'EMAS', status: 'expired', date: '2023-12-31' }
          ]
        }
      });
      setLoading(false);
    }, 1000);
  };

  const calculateTrend = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4" />;
  };

  const getCertificationBadge = (status: string) => {
    const configs = {
      obtained: { color: 'bg-green-100 text-green-800', label: 'Obtenu' },
      in_progress: { color: 'bg-blue-100 text-blue-800', label: 'En cours' },
      expired: { color: 'bg-red-100 text-red-800', label: 'Expiré' }
    };
    const config = configs[status as keyof typeof configs];
    return (
      <Badge className={`${config.color} text-xs`}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Analytics Entreprise</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Analyses détaillées de la gestion des déchets
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 mois</SelectItem>
              <SelectItem value="3months">3 mois</SelectItem>
              <SelectItem value="6months">6 mois</SelectItem>
              <SelectItem value="1year">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.wasteMetrics.totalVolume} kg</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(analyticsData?.wasteMetrics.volumeChange || 0)}
              <span className="ml-1">+{analyticsData?.wasteMetrics.volumeChange}% vs période précédente</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Recyclage</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.wasteMetrics.recyclingRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(analyticsData?.wasteMetrics.recyclingChange || 0)}
              <span className="ml-1">+{analyticsData?.wasteMetrics.recyclingChange}% vs période précédente</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coût par Kg</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.wasteMetrics.costPerKg} XOF</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(analyticsData?.wasteMetrics.costChange || 0)}
              <span className="ml-1">{analyticsData?.wasteMetrics.costChange}% vs période précédente</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Évité</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.wasteMetrics.carbonReduction} kg</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTrendIcon(analyticsData?.wasteMetrics.carbonChange || 0)}
              <span className="ml-1">+{analyticsData?.wasteMetrics.carbonChange}% vs période précédente</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="sites">Performance Sites</TabsTrigger>
          <TabsTrigger value="waste-types">Types de Déchets</TabsTrigger>
          <TabsTrigger value="sustainability">Durabilité</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution Mensuelle</CardTitle>
                <CardDescription>Tendances des 4 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData?.monthlyTrends.map((month, index) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{month.month}</span>
                        <span className="text-sm text-muted-foreground">{month.volume} kg</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Recyclage: </span>
                          <span className="font-medium">{month.recycling}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Coût: </span>
                          <span className="font-medium">{month.cost.toLocaleString()} XOF</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">CO₂: </span>
                          <span className="font-medium">{month.carbon} kg</span>
                        </div>
                      </div>
                      {index < analyticsData.monthlyTrends.length - 1 && <hr className="my-2" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Objectifs de Durabilité</CardTitle>
                <CardDescription>Progression vers les objectifs 2024</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Taux de Recyclage</span>
                    <span>{analyticsData?.sustainability.goals.recyclingCurrent}% / {analyticsData?.sustainability.goals.recyclingTarget}%</span>
                  </div>
                  <Progress value={(analyticsData?.sustainability.goals.recyclingCurrent || 0) / (analyticsData?.sustainability.goals.recyclingTarget || 1) * 100} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Réduction CO₂</span>
                    <span>{analyticsData?.sustainability.goals.carbonCurrent} / {analyticsData?.sustainability.goals.carbonTarget} kg</span>
                  </div>
                  <Progress value={(analyticsData?.sustainability.goals.carbonCurrent || 0) / (analyticsData?.sustainability.goals.carbonTarget || 1) * 100} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget Mensuel</span>
                    <span>{analyticsData?.sustainability.goals.costCurrent?.toLocaleString()} / {analyticsData?.sustainability.goals.costTarget?.toLocaleString()} XOF</span>
                  </div>
                  <Progress 
                    value={(analyticsData?.sustainability.goals.costCurrent || 0) / (analyticsData?.sustainability.goals.costTarget || 1) * 100}
                    className="bg-red-100"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sites" className="space-y-4">
          <div className="grid gap-4">
            {analyticsData?.sitePerformance.map((site) => (
              <Card key={site.siteId}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <Building className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">{site.siteName}</h3>
                        <p className="text-sm text-muted-foreground">{site.volume} kg ce mois</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Recyclage</p>
                        <p className="font-medium">{site.recyclingRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Coût</p>
                        <p className="font-medium">{site.cost.toLocaleString()} XOF</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conformité</p>
                        <p className="font-medium">{site.compliance}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Efficacité</p>
                        <p className="font-medium">{site.efficiency}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <Progress value={site.recyclingRate} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <Progress value={site.compliance} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <Progress value={site.efficiency} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="waste-types" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {analyticsData?.wasteTypes.map((wasteType) => (
              <Card key={wasteType.type}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{wasteType.type}</CardTitle>
                      <CardDescription>{wasteType.volume} kg ({wasteType.percentage}%)</CardDescription>
                    </div>
                    <div className="flex items-center text-sm">
                      {getTrendIcon(wasteType.trend)}
                      <span className="ml-1">{wasteType.trend > 0 ? '+' : ''}{wasteType.trend}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux de recyclage</span>
                      <span>{wasteType.recyclingRate}%</span>
                    </div>
                    <Progress value={wasteType.recyclingRate} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coût total:</span>
                    <span className="font-medium">{wasteType.cost.toLocaleString()} XOF</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coût par kg:</span>
                    <span className="font-medium">{Math.round(wasteType.cost / wasteType.volume)} XOF</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Objectifs 2024
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Recyclage</span>
                    <span>{analyticsData?.sustainability.goals.recyclingCurrent}% / {analyticsData?.sustainability.goals.recyclingTarget}%</span>
                  </div>
                  <Progress value={(analyticsData?.sustainability.goals.recyclingCurrent || 0) / (analyticsData?.sustainability.goals.recyclingTarget || 1) * 100} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Réduction CO₂</span>
                    <span>{analyticsData?.sustainability.goals.carbonCurrent} / {analyticsData?.sustainability.goals.carbonTarget} kg</span>
                  </div>
                  <Progress value={(analyticsData?.sustainability.goals.carbonCurrent || 0) / (analyticsData?.sustainability.goals.carbonTarget || 1) * 100} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget</span>
                    <span>{analyticsData?.sustainability.goals.costCurrent?.toLocaleString()} / {analyticsData?.sustainability.goals.costTarget?.toLocaleString()} XOF</span>
                  </div>
                  <Progress 
                    value={(analyticsData?.sustainability.goals.costCurrent || 0) / (analyticsData?.sustainability.goals.costTarget || 1) * 100}
                    className="bg-red-100"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
                <CardDescription>Statut des certifications environnementales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsData?.sustainability.certifications.map((cert) => (
                  <div key={cert.name} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(cert.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    {getCertificationBadge(cert.status)}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
