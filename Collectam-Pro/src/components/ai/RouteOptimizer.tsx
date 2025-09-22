"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Route, 
  Clock, 
  MapPin, 
  Users, 
  TrendingUp, 
  Zap, 
  Target,
  Play,
  Pause,
  RotateCcw,
  Download,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface OptimizationResult {
  success: boolean;
  routes: Array<{
    collectorId: string;
    collectorName: string;
    startLocation: [number, number];
    requests: Array<{
      id: string;
      address: string;
      coordinates: [number, number];
      urgency: string;
      estimatedWeight: number;
    }>;
    totalDistance: number;
    estimatedTime: number;
    efficiency: number;
  }>;
  metrics: {
    totalDistance: number;
    totalTime: number;
    totalRequests: number;
    averageEfficiency: number;
    routesCount: number;
    averageRequestsPerRoute: number;
  };
  algorithm: string;
  optimizedAt: string;
}

interface RouteOptimizerProps {
  className?: string;
}

export function RouteOptimizer({ className }: RouteOptimizerProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  
  // Optimization parameters
  const [algorithm, setAlgorithm] = useState('nearest_neighbor');
  const [maxDistance, setMaxDistance] = useState([50]);
  const [maxRequestsPerCollector, setMaxRequestsPerCollector] = useState([10]);
  const [prioritizeUrgent, setPrioritizeUrgent] = useState(true);
  const [timeWindow, setTimeWindow] = useState({ start: 8, end: 18 });

  // Real data - will be fetched from API
  const [availableRequests, setAvailableRequests] = useState(0);
  const [availableCollectors, setAvailableCollectors] = useState(0);

  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    try {
      // Simulate optimization progress
      const progressInterval = setInterval(() => {
        setOptimizationProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // TODO: Replace with real API call to optimization service
      // const response = await fetch('/api/ai/optimize-routes', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ algorithm, maxDistance, maxRequestsPerCollector, prioritizeUrgent, timeWindow })
      // });
      // const result = await response.json();
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setOptimizationProgress(100);

      // For now, return empty result when no data available
      const emptyResult: OptimizationResult = {
        success: true,
        routes: [],
        metrics: {
          totalDistance: 0,
          totalTime: 0,
          totalRequests: 0,
          averageEfficiency: 0,
          routesCount: 0,
          averageRequestsPerRoute: 0
        },
        algorithm,
        optimizedAt: new Date().toISOString()
      };

      setOptimizationResult(emptyResult);
      toast.info(`Aucune demande disponible pour l'optimisation`);
      
    } catch (error) {
      console.error('❌ Optimization failed:', error);
      toast.error('Erreur lors de l\'optimisation');
    } finally {
      setIsOptimizing(false);
      setOptimizationProgress(0);
    }
  };

  const resetOptimization = () => {
    setOptimizationResult(null);
    setOptimizationProgress(0);
  };

  const exportRoutes = () => {
    if (!optimizationResult) return;
    
    // In production, generate and download route file
    console.log('📄 Exporting optimized routes...');
    toast.success('Tournées exportées avec succès');
  };

  const getAlgorithmDescription = (algo: string) => {
    switch (algo) {
      case 'nearest_neighbor':
        return 'Algorithme rapide et efficace pour des optimisations simples';
      case 'genetic_algorithm':
        return 'Algorithme évolutionnaire pour des optimisations complexes';
      case 'simulated_annealing':
        return 'Optimisation par recuit simulé pour éviter les minima locaux';
      case 'machine_learning':
        return 'IA avancée basée sur l\'apprentissage automatique';
      default:
        return 'Algorithme d\'optimisation';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Algorithm Selection */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Algorithme</Label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nearest_neighbor">Plus Proche Voisin</SelectItem>
                    <SelectItem value="genetic_algorithm">Algorithme Génétique</SelectItem>
                    <SelectItem value="simulated_annealing">Recuit Simulé</SelectItem>
                    <SelectItem value="machine_learning">IA Avancée</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {getAlgorithmDescription(algorithm)}
                </p>
              </div>

              {/* Distance Maximum */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Distance max par collecteur: {maxDistance[0]} km
                </Label>
                <Slider
                  value={maxDistance}
                  onValueChange={setMaxDistance}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Requests per Collector */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Demandes max par collecteur: {maxRequestsPerCollector[0]}
                </Label>
                <Slider
                  value={maxRequestsPerCollector}
                  onValueChange={setMaxRequestsPerCollector}
                  max={20}
                  min={5}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Prioritize Urgent */}
              <div className="flex items-center justify-between">
                <Label htmlFor="prioritize-urgent" className="text-sm font-medium">
                  Prioriser les urgences
                </Label>
                <Switch
                  id="prioritize-urgent"
                  checked={prioritizeUrgent}
                  onCheckedChange={setPrioritizeUrgent}
                />
              </div>

              {/* Time Window */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Fenêtre horaire</Label>
                <div className="flex items-center gap-2">
                  <Select value={timeWindow.start.toString()} onValueChange={(value) => 
                    setTimeWindow(prev => ({ ...prev, start: parseInt(value) }))
                  }>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 6).map(hour => (
                        <SelectItem key={hour} value={hour.toString()}>{hour}h</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm">à</span>
                  <Select value={timeWindow.end.toString()} onValueChange={(value) => 
                    setTimeWindow(prev => ({ ...prev, end: parseInt(value) }))
                  }>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 12).map(hour => (
                        <SelectItem key={hour} value={hour.toString()}>{hour}h</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                État Actuel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Demandes en attente</span>
                  <Badge variant="outline">{availableRequests}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Collecteurs disponibles</span>
                  <Badge variant="outline">{availableCollectors}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ratio demandes/collecteur</span>
                  <Badge variant="outline">{(availableRequests / availableCollectors).toFixed(1)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Control Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Optimiseur de Tournées IA
                </CardTitle>
                <div className="flex items-center gap-2">
                  {optimizationResult && (
                    <>
                      <Button variant="outline" size="sm" onClick={exportRoutes}>
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                      </Button>
                      <Button variant="outline" size="sm" onClick={resetOptimization}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </>
                  )}
                  <Button 
                    onClick={runOptimization} 
                    disabled={isOptimizing}
                    className="min-w-32"
                  >
                    {isOptimizing ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Optimisation...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Optimiser
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {isOptimizing && (
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression de l'optimisation</span>
                    <span>{Math.round(optimizationProgress)}%</span>
                  </div>
                  <Progress value={optimizationProgress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    Analyse des {availableRequests} demandes avec l'algorithme {algorithm}...
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Results */}
          {optimizationResult && (
            <>
              {/* Metrics Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tournées</p>
                        <p className="text-xl font-bold">{optimizationResult.metrics.routesCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Distance</p>
                        <p className="text-xl font-bold">{(optimizationResult.metrics.totalDistance / 1000).toFixed(1)} km</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Temps</p>
                        <p className="text-xl font-bold">{Math.round(optimizationResult.metrics.totalTime / 60)}h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Efficacité</p>
                        <p className="text-xl font-bold">{optimizationResult.metrics.averageEfficiency.toFixed(1)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Optimized Routes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    Tournées Optimisées
                    <Badge variant="outline" className="ml-2">
                      {optimizationResult.algorithm.replace('_', ' ')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optimizationResult.routes.map((route, index) => (
                      <div key={route.collectorId} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="default">Tournée {index + 1}</Badge>
                            <div>
                              <p className="font-medium">{route.collectorName}</p>
                              <p className="text-sm text-muted-foreground">
                                {route.requests.length} demandes • {(route.totalDistance / 1000).toFixed(1)} km • {Math.round(route.estimatedTime)} min
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Efficacité</p>
                            <div className="flex items-center gap-2">
                              <Progress value={route.efficiency} className="w-16 h-2" />
                              <span className="text-sm">{route.efficiency.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {route.requests.map((request, reqIndex) => (
                            <div key={request.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="w-8 h-6 flex items-center justify-center p-0">
                                  {reqIndex + 1}
                                </Badge>
                                <div>
                                  <p className="text-sm font-medium">{request.address}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {request.estimatedWeight} kg
                                  </p>
                                </div>
                              </div>
                              <Badge className={getUrgencyColor(request.urgency)}>
                                {request.urgency}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Empty State */}
          {!optimizationResult && !isOptimizing && (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Prêt pour l'optimisation</h3>
                  <p className="text-muted-foreground mb-4">
                    Configurez les paramètres et lancez l'optimisation IA pour générer les meilleures tournées.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      <span>Optimisation rapide</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Multi-collecteurs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>Haute précision</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
