"use client";

import React, { useMemo, useState, useEffect } from 'react';
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

type OverviewStats = {
  totalCollections: number;
  totalWeight: number;
  averageResponseTime: number;
  customerSatisfaction: number;
};

type TopCollector = { id: string; name: string; collections: number; weight: number };

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewStats>({
    totalCollections: 0,
    totalWeight: 0,
    averageResponseTime: 0,
    customerSatisfaction: 0
  });
  const [prevOverview, setPrevOverview] = useState<OverviewStats | null>(null);
  const [topCollectors, setTopCollectors] = useState<TopCollector[]>([]);
  const [timeRange, setTimeRange] = useState<'7d'|'30d'|'90d'|'1y'>('30d');
  const [customFrom, setCustomFrom] = useState<string>('');
  const [customTo, setCustomTo] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('scheduled,in_progress,completed');

  const { from, to } = useMemo(() => {
    if (customFrom && customTo) return { from: new Date(customFrom), to: new Date(customTo) };
    const now = new Date();
    const end = now;
    const start = new Date(now);
    if (timeRange === '7d') start.setDate(start.getDate() - 7);
    else if (timeRange === '30d') start.setDate(start.getDate() - 30);
    else if (timeRange === '90d') start.setDate(start.getDate() - 90);
    else start.setFullYear(start.getFullYear() - 1);
    return { from: start, to: end };
  }, [timeRange, customFrom, customTo]);

  const prevPeriod = useMemo(() => {
    const duration = to.getTime() - from.getTime();
    const prevTo = new Date(from.getTime());
    const prevFrom = new Date(from.getTime() - duration);
    return { prevFrom, prevTo };
  }, [from, to]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const headers = { 'Authorization': `Bearer ${token}` } as any;
        const qs = (d: Date) => encodeURIComponent(d.toISOString());

        // Overview for current period
        const statsRes = await fetch(`/api/business-subscription/stats?from=${qs(from)}&to=${qs(to)}`, { headers });
        if (statsRes.ok) {
          const data = await statsRes.json();
          setOverview({
            totalCollections: data.data?.totalCollections || 0,
            totalWeight: data.data?.totalWeight || 0,
            averageResponseTime: data.data?.averageResponseTime || 0,
            customerSatisfaction: data.data?.customerSatisfaction || 0,
          });
        }

        // Overview for previous period (for trends)
        const prevRes = await fetch(`/api/business-subscription/stats?from=${qs(prevPeriod.prevFrom)}&to=${qs(prevPeriod.prevTo)}`, { headers });
        if (prevRes.ok) {
          const pdata = await prevRes.json();
          setPrevOverview({
            totalCollections: pdata.data?.totalCollections || 0,
            totalWeight: pdata.data?.totalWeight || 0,
            averageResponseTime: pdata.data?.averageResponseTime || 0,
            customerSatisfaction: pdata.data?.customerSatisfaction || 0,
          });
        }

        // Assigned collections (for top collectors)
        const collRes = await fetch(`/api/business-collectors/assigned-collections?status=${encodeURIComponent(statusFilter)}&from=${qs(from)}&to=${qs(to)}`, { headers });
        if (collRes.ok) {
          const list = (await collRes.json()).data || [];
          // Group by assignedCollector
          const map = new Map<string, TopCollector>();
          list.forEach((r: any) => {
            const id = r.assignedCollector?._id || r.assignedCollector;
            const key = id ? String(id) : 'unknown';
            const name = r.assignedCollector ? `${r.assignedCollector.firstName || ''} ${r.assignedCollector.lastName || ''}`.trim() : 'Inconnu';
            const weight = Number(r.estimatedWeight || 0);
            const curr = map.get(key) || { id: key, name, collections: 0, weight: 0 };
            curr.collections += 1;
            curr.weight += weight;
            map.set(key, curr);
          });
          const arr = Array.from(map.values()).filter(c => c.id !== 'unknown').sort((a, b) => b.collections - a.collections).slice(0, 5);
          setTopCollectors(arr);
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [from, to, prevPeriod.prevFrom, prevPeriod.prevTo, statusFilter]);

  const calculateTrend = (current: number, previous: number) => {
    const base = previous === 0 ? 1 : previous;
    const change = ((current - previous) / base) * 100;
    return { value: Math.abs(change).toFixed(1), isPositive: change >= 0 };
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

  const collectionsTrend = calculateTrend(overview.totalCollections, prevOverview?.totalCollections || 0);
  const weightTrend = calculateTrend(overview.totalWeight, prevOverview?.totalWeight || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Analytics & Rapports</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Suivez les performances de votre flotte</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            <select 
              value={timeRange} 
              onChange={(e) => { setTimeRange(e.target.value as any); setCustomFrom(''); setCustomTo(''); }}
              className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">3 derniers mois</option>
              <option value="1y">Dernière année</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto"
              title="Filtrer par statut"
            >
              <option value="scheduled,in_progress,completed">Programmées / En cours / Terminées</option>
              <option value="scheduled">Programmées</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminées</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="date" className="px-3 py-2 border rounded-md text-sm" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
            <span className="text-muted-foreground text-sm">au</span>
            <input type="date" className="px-3 py-2 border rounded-md text-sm" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
          </div>
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
            <div className="text-2xl font-bold">{overview.totalCollections}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {collectionsTrend.isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={collectionsTrend.isPositive ? 'text-green-500' : 'text-red-500'}>
                {collectionsTrend.isPositive ? '+' : '-'}{collectionsTrend.value}%
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
            <div className="text-2xl font-bold">{overview.totalWeight} kg</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {weightTrend.isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={weightTrend.isPositive ? 'text-green-500' : 'text-red-500'}>
                {weightTrend.isPositive ? '+' : '-'}{weightTrend.value}%
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
            <div className="text-2xl font-bold">{overview.averageResponseTime}h</div>
            <p className="text-xs text-muted-foreground">Temps moyen de réponse</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Client</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.customerSatisfaction}/5</div>
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
                {topCollectors.map((collector, index) => (
                  <div key={collector.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{collector.name || 'Collecteur'}</p>
                        <p className="text-sm text-muted-foreground truncate">{collector.collections} collectes • {collector.weight} kg</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            {/* Top véhicules: à venir quand on consolidera les données véhiculeUsed */}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution de la période</CardTitle>
              <CardDescription>Comparaison avec la période précédente de même durée</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Collectes (période)</span>
                    <span className="text-sm">{overview.totalCollections}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="text-sm">Période précédente</span>
                    <span className="text-sm">{prevOverview?.totalCollections ?? 0}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Poids (période)</span>
                    <span className="text-sm">{overview.totalWeight} kg</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="text-sm">Période précédente</span>
                    <span className="text-sm">{prevOverview?.totalWeight ?? 0} kg</span>
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
