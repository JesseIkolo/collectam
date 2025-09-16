"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  History, 
  Search, 
  Filter, 
  Calendar,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  Star,
  Download,
  Eye
} from "lucide-react";

interface CollectionHistory {
  id: string;
  date: string;
  time: string;
  address: string;
  wasteType: string;
  weight: number;
  status: 'completed' | 'cancelled';
  rating: number;
  distance: number;
  duration: string;
  earnings: number;
}

export default function CollectorHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const [historyData] = useState<CollectionHistory[]>([
    {
      id: "COL-2024-001",
      date: "2024-01-15",
      time: "09:30",
      address: "123 Rue de la Paix, Douala",
      wasteType: "Plastique",
      weight: 15.5,
      status: "completed",
      rating: 5,
      distance: 2.3,
      duration: "45 min",
      earnings: 2500
    },
    {
      id: "COL-2024-002",
      date: "2024-01-15",
      time: "11:15",
      address: "45 Avenue Kennedy, Douala",
      wasteType: "Organique",
      weight: 8.2,
      status: "completed",
      rating: 4,
      distance: 1.8,
      duration: "30 min",
      earnings: 1800
    },
    {
      id: "COL-2024-003",
      date: "2024-01-14",
      time: "14:00",
      address: "78 Bd de la Liberté, Douala",
      wasteType: "Mixte",
      weight: 12.0,
      status: "completed",
      rating: 5,
      distance: 3.1,
      duration: "1h 10min",
      earnings: 3200
    },
    {
      id: "COL-2024-004",
      date: "2024-01-14",
      time: "16:30",
      address: "12 Rue du Commerce, Douala",
      wasteType: "Électronique",
      weight: 5.8,
      status: "cancelled",
      rating: 0,
      distance: 0,
      duration: "0 min",
      earnings: 0
    },
    {
      id: "COL-2024-005",
      date: "2024-01-13",
      time: "08:45",
      address: "34 Place de l'Indépendance, Douala",
      wasteType: "Plastique",
      weight: 22.1,
      status: "completed",
      rating: 5,
      distance: 4.2,
      duration: "1h 25min",
      earnings: 4500
    }
  ]);

  const filteredHistory = historyData.filter(item => {
    const matchesSearch = item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    const matchesDate = dateFilter === "all" || 
                       (dateFilter === "today" && item.date === "2024-01-15") ||
                       (dateFilter === "week" && new Date(item.date) >= new Date("2024-01-09")) ||
                       (dateFilter === "month" && new Date(item.date) >= new Date("2024-01-01"));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalCollections = historyData.filter(h => h.status === 'completed').length;
  const totalWeight = historyData.filter(h => h.status === 'completed').reduce((sum, h) => sum + h.weight, 0);
  const totalEarnings = historyData.filter(h => h.status === 'completed').reduce((sum, h) => sum + h.earnings, 0);
  const averageRating = historyData.filter(h => h.status === 'completed' && h.rating > 0)
    .reduce((sum, h, _, arr) => sum + h.rating / arr.length, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">Terminée</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historique des Collectes</h1>
          <p className="text-muted-foreground">
            Consultez vos collectes passées et vos performances
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collectes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCollections}</div>
            <p className="text-xs text-muted-foreground">
              Collectes terminées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Poids Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeight.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">
              Déchets collectés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gains Totaux</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarnings.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">
              Revenus générés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">
              Satisfaction client
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par adresse, type de déchet ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les dates</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des collectes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique Détaillé ({filteredHistory.length} résultats)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Poids</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Gains</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell className="font-medium">{collection.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(collection.date).toLocaleDateString('fr-FR')}
                        <Clock className="h-3 w-3 ml-2" />
                        {collection.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm max-w-[200px] truncate">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {collection.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{collection.wasteType}</Badge>
                    </TableCell>
                    <TableCell>{collection.weight} kg</TableCell>
                    <TableCell>{getStatusBadge(collection.status)}</TableCell>
                    <TableCell>
                      {collection.status === 'completed' ? renderStars(collection.rating) : '-'}
                    </TableCell>
                    <TableCell>
                      {collection.status === 'completed' 
                        ? `${collection.earnings.toLocaleString()} FCFA`
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune collecte trouvée avec ces critères de recherche.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
