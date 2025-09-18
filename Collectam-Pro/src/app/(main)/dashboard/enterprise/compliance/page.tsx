"use client";

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  FileText,
  Calendar,
  Download,
  Upload,
  Eye,
  Plus,
  Building,
  Gavel,
  Award
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ComplianceItem {
  id: string;
  title: string;
  category: 'environmental' | 'safety' | 'legal' | 'certification';
  status: 'compliant' | 'non_compliant' | 'pending' | 'expired';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  lastUpdate: string;
  description: string;
  requirements: string[];
  documents: {
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    status: 'approved' | 'pending' | 'rejected';
  }[];
  responsibleSite?: string;
  nextAudit?: string;
}

interface ComplianceOverview {
  overallScore: number;
  totalItems: number;
  compliant: number;
  nonCompliant: number;
  pending: number;
  expired: number;
  upcomingDeadlines: number;
  criticalIssues: number;
}

export default function CompliancePage() {
  const [complianceData, setComplianceData] = useState<ComplianceItem[]>([]);
  const [overview, setOverview] = useState<ComplianceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    // Simuler des données
    setTimeout(() => {
      const items: ComplianceItem[] = [
        {
          id: '1',
          title: 'Certification ISO 14001',
          category: 'certification',
          status: 'compliant',
          priority: 'high',
          dueDate: '2024-06-15',
          lastUpdate: '2024-01-10',
          description: 'Système de management environnemental',
          requirements: [
            'Audit annuel obligatoire',
            'Formation du personnel',
            'Suivi des indicateurs environnementaux',
            'Plan d\'amélioration continue'
          ],
          documents: [
            { id: '1', name: 'Certificat ISO 14001.pdf', type: 'certificate', uploadDate: '2023-06-15', status: 'approved' },
            { id: '2', name: 'Rapport audit 2023.pdf', type: 'audit', uploadDate: '2023-12-20', status: 'approved' }
          ],
          nextAudit: '2024-06-01'
        },
        {
          id: '2',
          title: 'Déclaration Déchets Dangereux',
          category: 'legal',
          status: 'pending',
          priority: 'critical',
          dueDate: '2024-01-31',
          lastUpdate: '2024-01-15',
          description: 'Déclaration annuelle obligatoire des déchets dangereux',
          requirements: [
            'Inventaire complet des déchets dangereux',
            'Bordereaux de suivi des déchets',
            'Certificats de traitement',
            'Déclaration en ligne sur le portail gouvernemental'
          ],
          documents: [
            { id: '3', name: 'Inventaire déchets 2023.xlsx', type: 'inventory', uploadDate: '2024-01-10', status: 'pending' },
            { id: '4', name: 'Bordereaux BSD.pdf', type: 'tracking', uploadDate: '2024-01-12', status: 'pending' }
          ],
          responsibleSite: 'Usine de Production'
        },
        {
          id: '3',
          title: 'Plan de Prévention des Risques',
          category: 'safety',
          status: 'non_compliant',
          priority: 'high',
          dueDate: '2024-02-15',
          lastUpdate: '2023-11-20',
          description: 'Plan de prévention des risques environnementaux et de sécurité',
          requirements: [
            'Analyse des risques par site',
            'Mesures de prévention définies',
            'Formation du personnel',
            'Exercices d\'évacuation',
            'Mise à jour annuelle'
          ],
          documents: [
            { id: '5', name: 'Plan prévention v2.pdf', type: 'plan', uploadDate: '2023-11-20', status: 'rejected' }
          ],
          responsibleSite: 'Tous les sites'
        },
        {
          id: '4',
          title: 'Autorisation Exploitation ICPE',
          category: 'legal',
          status: 'compliant',
          priority: 'critical',
          dueDate: '2025-03-30',
          lastUpdate: '2024-01-05',
          description: 'Autorisation d\'exploitation Installation Classée pour la Protection de l\'Environnement',
          requirements: [
            'Respect des prescriptions techniques',
            'Contrôles périodiques obligatoires',
            'Déclarations d\'incidents',
            'Surveillance des émissions'
          ],
          documents: [
            { id: '6', name: 'Autorisation ICPE.pdf', type: 'authorization', uploadDate: '2020-03-30', status: 'approved' },
            { id: '7', name: 'Contrôle 2023.pdf', type: 'inspection', uploadDate: '2023-09-15', status: 'approved' }
          ],
          responsibleSite: 'Usine de Production',
          nextAudit: '2024-09-15'
        },
        {
          id: '5',
          title: 'Formation Sécurité Personnel',
          category: 'safety',
          status: 'expired',
          priority: 'medium',
          dueDate: '2023-12-31',
          lastUpdate: '2023-06-15',
          description: 'Formation obligatoire du personnel aux règles de sécurité',
          requirements: [
            'Formation initiale pour nouveaux employés',
            'Recyclage annuel obligatoire',
            'Certification des formateurs',
            'Registre de formation à jour'
          ],
          documents: [
            { id: '8', name: 'Certificats formation 2023.pdf', type: 'training', uploadDate: '2023-06-15', status: 'approved' }
          ],
          responsibleSite: 'Tous les sites'
        }
      ];

      setComplianceData(items);
      
      setOverview({
        overallScore: 78,
        totalItems: items.length,
        compliant: items.filter(i => i.status === 'compliant').length,
        nonCompliant: items.filter(i => i.status === 'non_compliant').length,
        pending: items.filter(i => i.status === 'pending').length,
        expired: items.filter(i => i.status === 'expired').length,
        upcomingDeadlines: items.filter(i => {
          const dueDate = new Date(i.dueDate);
          const now = new Date();
          const diffTime = dueDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 30 && diffDays > 0;
        }).length,
        criticalIssues: items.filter(i => i.priority === 'critical' && i.status !== 'compliant').length
      });
      
      setLoading(false);
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      compliant: { color: 'bg-green-100 text-green-800', label: 'Conforme', icon: CheckCircle },
      non_compliant: { color: 'bg-red-100 text-red-800', label: 'Non conforme', icon: AlertTriangle },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente', icon: Clock },
      expired: { color: 'bg-gray-100 text-gray-800', label: 'Expiré', icon: Clock }
    };
    const config = configs[status as keyof typeof configs] || configs.pending; // Fallback to pending if status not found
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1 text-xs`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    const labels = {
      low: 'Faible',
      medium: 'Moyen',
      high: 'Élevé',
      critical: 'Critique'
    };
    const color = colors[priority as keyof typeof colors] || colors.medium;
    const label = labels[priority as keyof typeof labels] || labels.medium;
    return (
      <Badge className={`${color} text-xs`}>
        {label}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      environmental: Shield,
      safety: AlertTriangle,
      legal: Gavel,
      certification: Award
    };
    const Icon = icons[category as keyof typeof icons] || Shield;
    return <Icon className="w-4 h-4" />;
  };

  const getDocumentStatusBadge = (status: string) => {
    const configs = {
      approved: { color: 'bg-green-100 text-green-800', label: 'Approuvé', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente', icon: Clock },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejeté', icon: AlertTriangle }
    };
    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1 text-xs`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredData = complianceData.filter(item => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Conformité Réglementaire</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Suivi de la conformité environnementale et réglementaire
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Rapport
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Élément
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {overview && overview.criticalIssues > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{overview.criticalIssues} problème(s) critique(s)</strong> nécessitent une attention immédiate.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Global</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.overallScore}%</div>
            <Progress value={overview?.overallScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Éléments Conformes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overview?.compliant}</div>
            <p className="text-xs text-muted-foreground">
              sur {overview?.totalItems} éléments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Échéances Proches</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{overview?.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground">
              dans les 30 prochains jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problèmes Critiques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overview?.criticalIssues}</div>
            <p className="text-xs text-muted-foreground">
              nécessitent une action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie</label>
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="all">Toutes les catégories</option>
                <option value="environmental">Environnemental</option>
                <option value="safety">Sécurité</option>
                <option value="legal">Légal</option>
                <option value="certification">Certification</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="all">Tous les statuts</option>
                <option value="compliant">Conforme</option>
                <option value="non_compliant">Non conforme</option>
                <option value="pending">En attente</option>
                <option value="expired">Expiré</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Items */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste Détaillée</TabsTrigger>
          <TabsTrigger value="calendar">Vue Calendrier</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="space-y-4">
            {filteredData.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="font-semibold truncate">{item.title}</h3>
                          <div className="flex gap-2">
                            {getStatusBadge(item.status)}
                            {getPriorityBadge(item.priority)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Échéance:</p>
                            <p className="font-medium">{new Date(item.dueDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Dernière mise à jour:</p>
                            <p className="font-medium">{new Date(item.lastUpdate).toLocaleDateString('fr-FR')}</p>
                          </div>
                          {item.responsibleSite && (
                            <div>
                              <p className="text-muted-foreground">Site responsable:</p>
                              <p className="font-medium">{item.responsibleSite}</p>
                            </div>
                          )}
                          {item.nextAudit && (
                            <div>
                              <p className="text-muted-foreground">Prochain audit:</p>
                              <p className="font-medium">{new Date(item.nextAudit).toLocaleDateString('fr-FR')}</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Exigences:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {item.requirements.map((req, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-xs mt-1">•</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {item.documents.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Documents ({item.documents.length}):</p>
                            <div className="flex flex-wrap gap-2">
                              {item.documents.map((doc) => (
                                <Badge key={doc.id} variant="outline" className="text-xs">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {doc.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Documents
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Échéances à Venir</CardTitle>
              <CardDescription>Prochaines échéances de conformité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredData
                  .filter(item => new Date(item.dueDate) > new Date())
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .slice(0, 10)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(item.category)}
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.dueDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(item.priority)}
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Documents</CardTitle>
              <CardDescription>Tous les documents de conformité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceData.flatMap(item => 
                  item.documents.map(doc => ({
                    ...doc,
                    complianceTitle: item.title,
                    category: item.category
                  }))
                ).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.complianceTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploadé le {new Date(doc.uploadDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getDocumentStatusBadge(doc.status)}
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
