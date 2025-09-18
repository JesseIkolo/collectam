"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar,
  Filter,
  Eye,
  Share,
  Plus,
  BarChart3,
  TrendingUp,
  Building,
  Package,
  Recycle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Report {
  id: string;
  title: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  category: 'waste' | 'compliance' | 'sustainability' | 'financial';
  status: 'generated' | 'pending' | 'scheduled';
  generatedDate: string;
  period: string;
  fileSize: string;
  format: 'PDF' | 'Excel' | 'CSV';
  description: string;
  metrics: {
    totalWaste: number;
    recyclingRate: number;
    cost: number;
    carbonReduction: number;
  };
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    // Simuler des données
    setTimeout(() => {
      setReports([
        {
          id: '1',
          title: 'Rapport Mensuel Janvier 2024',
          type: 'monthly',
          category: 'waste',
          status: 'generated',
          generatedDate: '2024-02-01T10:00:00Z',
          period: 'Janvier 2024',
          fileSize: '2.3 MB',
          format: 'PDF',
          description: 'Rapport complet de gestion des déchets pour le mois de janvier',
          metrics: {
            totalWaste: 2340,
            recyclingRate: 76.8,
            cost: 432900,
            carbonReduction: 1850
          }
        },
        {
          id: '2',
          title: 'Audit Conformité Q4 2023',
          type: 'quarterly',
          category: 'compliance',
          status: 'generated',
          generatedDate: '2024-01-15T14:30:00Z',
          period: 'Q4 2023',
          fileSize: '5.7 MB',
          format: 'PDF',
          description: 'Audit de conformité réglementaire du quatrième trimestre',
          metrics: {
            totalWaste: 7200,
            recyclingRate: 74.2,
            cost: 1330000,
            carbonReduction: 5400
          }
        },
        {
          id: '3',
          title: 'Bilan Carbone Annuel 2023',
          type: 'annual',
          category: 'sustainability',
          status: 'generated',
          generatedDate: '2024-01-10T09:15:00Z',
          period: '2023',
          fileSize: '8.1 MB',
          format: 'PDF',
          description: 'Bilan complet des émissions et réductions carbone',
          metrics: {
            totalWaste: 28800,
            recyclingRate: 75.5,
            cost: 5320000,
            carbonReduction: 21600
          }
        },
        {
          id: '4',
          title: 'Analyse Coûts Décembre 2023',
          type: 'monthly',
          category: 'financial',
          status: 'generated',
          generatedDate: '2024-01-05T16:45:00Z',
          period: 'Décembre 2023',
          fileSize: '1.8 MB',
          format: 'Excel',
          description: 'Analyse détaillée des coûts de gestion des déchets',
          metrics: {
            totalWaste: 2180,
            recyclingRate: 73.1,
            cost: 403300,
            carbonReduction: 1630
          }
        },
        {
          id: '5',
          title: 'Rapport Personnalisé Sites',
          type: 'custom',
          category: 'waste',
          status: 'pending',
          generatedDate: '2024-01-20T11:20:00Z',
          period: 'Jan 2024',
          fileSize: '-',
          format: 'PDF',
          description: 'Rapport personnalisé pour analyse comparative des sites',
          metrics: {
            totalWaste: 0,
            recyclingRate: 0,
            cost: 0,
            carbonReduction: 0
          }
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      generated: { color: 'bg-green-100 text-green-800', label: 'Généré' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En cours' },
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Programmé' }
    };
    const config = configs[status as keyof typeof configs];
    return (
      <Badge className={`${config.color} text-xs`}>
        {config.label}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      waste: Package,
      compliance: FileText,
      sustainability: Recycle,
      financial: TrendingUp
    };
    const Icon = icons[category as keyof typeof icons] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      waste: 'bg-blue-100 text-blue-800',
      compliance: 'bg-purple-100 text-purple-800',
      sustainability: 'bg-green-100 text-green-800',
      financial: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredReports = reports.filter(report => {
    if (filterType !== 'all' && report.type !== filterType) return false;
    if (filterCategory !== 'all' && report.category !== filterCategory) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Rapports & Analyses</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Générez et consultez vos rapports de gestion des déchets
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Programmer
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Rapport
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapports Générés</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter(r => r.status === 'generated').length}</div>
            <p className="text-xs text-muted-foreground">
              Ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter(r => r.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">
              Génération en cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taille Totale</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17.9 MB</div>
            <p className="text-xs text-muted-foreground">
              Stockage utilisé
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de Rapport</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="quarterly">Trimestriel</SelectItem>
                  <SelectItem value="annual">Annuel</SelectItem>
                  <SelectItem value="custom">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="waste">Gestion des Déchets</SelectItem>
                  <SelectItem value="compliance">Conformité</SelectItem>
                  <SelectItem value="sustainability">Durabilité</SelectItem>
                  <SelectItem value="financial">Financier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste des Rapports</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="scheduled">Programmés</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getCategoryIcon(report.category)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="font-semibold truncate">{report.title}</h3>
                          <div className="flex gap-2">
                            {getStatusBadge(report.status)}
                            <Badge className={`${getCategoryColor(report.category)} text-xs`}>
                              {report.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {report.format}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Période:</p>
                            <p className="font-medium">{report.period}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Généré le:</p>
                            <p className="font-medium">{new Date(report.generatedDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Taille:</p>
                            <p className="font-medium">{report.fileSize}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Type:</p>
                            <p className="font-medium capitalize">{report.type}</p>
                          </div>
                        </div>

                        {report.status === 'generated' && (
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Déchets:</p>
                              <p className="font-medium">{report.metrics.totalWaste} kg</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Recyclage:</p>
                              <p className="font-medium">{report.metrics.recyclingRate}%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Coût:</p>
                              <p className="font-medium">{report.metrics.cost.toLocaleString()} XOF</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">CO₂ évité:</p>
                              <p className="font-medium">{report.metrics.carbonReduction} kg</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {report.status === 'generated' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="w-4 h-4 mr-2" />
                            Partager
                          </Button>
                        </>
                      )}
                      {report.status === 'pending' && (
                        <Button variant="outline" size="sm" disabled>
                          Génération en cours...
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Modèles de Rapports</CardTitle>
              <CardDescription>Créez des rapports à partir de modèles prédéfinis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'Rapport Mensuel Standard', category: 'waste', description: 'Rapport complet mensuel de gestion des déchets' },
                  { name: 'Audit de Conformité', category: 'compliance', description: 'Vérification de la conformité réglementaire' },
                  { name: 'Bilan Carbone', category: 'sustainability', description: 'Calcul des émissions et réductions CO₂' },
                  { name: 'Analyse Financière', category: 'financial', description: 'Analyse des coûts et économies' },
                  { name: 'Performance par Site', category: 'waste', description: 'Comparaison des performances entre sites' },
                  { name: 'Rapport Personnalisé', category: 'custom', description: 'Créez votre propre modèle de rapport' }
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        {getCategoryIcon(template.category)}
                        {template.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                      <Button size="sm" className="w-full">
                        Utiliser ce Modèle
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapports Programmés</CardTitle>
              <CardDescription>Automatisez la génération de vos rapports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Aucun rapport programmé</h3>
                <p className="text-muted-foreground mb-4">
                  Configurez des rapports automatiques pour recevoir vos analyses régulièrement
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Programmer un Rapport
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
