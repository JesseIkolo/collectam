"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { wasteService } from "@/services/WasteService";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  History, 
  Calendar as CalendarIcon, 
  Filter, 
  Download, 
  Search,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Trash2
} from "lucide-react";

export function HistoryPage() {
  const [collections, setCollections] = useState([
    {
      id: 1,
      date: "2024-01-15",
      wasteType: "Plastique",
      weight: 2.5,
      status: "completed",
      collector: "Jean Dupont",
      address: "123 Rue de la Paix, Douala",
      points: 25
    },
    {
      id: 2,
      date: "2024-01-10",
      wasteType: "Organique",
      weight: 5.0,
      status: "completed",
      collector: "Marie Ngono",
      address: "456 Avenue Charles de Gaulle, Douala",
      points: 50
    },
    {
      id: 3,
      date: "2024-01-08",
      wasteType: "Papier",
      weight: 1.2,
      status: "cancelled",
      collector: null,
      address: "789 Boulevard de la Liberté, Douala",
      points: 0
    }
  ]);

  const [filters, setFilters] = useState({
    status: "all",
    wasteType: "all",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    search: ""
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCollections = collections.filter(collection => {
    if (filters.status !== "all" && collection.status !== filters.status) return false;
    if (filters.wasteType !== "all" && collection.wasteType.toLowerCase() !== filters.wasteType) return false;
    if (filters.search && !collection.address.toLowerCase().includes(filters.search.toLowerCase())) return false;
    // Date filtering would be implemented here
    return true;
  });

  const totalWeight = filteredCollections
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + c.weight, 0);

  const totalPoints = filteredCollections
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + c.points, 0);

  const exportData = () => {
    // In a real implementation, this would generate and download a CSV/PDF
    alert("Export en cours... (fonctionnalité à implémenter)");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historique des Collectes</h1>
          <p className="text-muted-foreground">
            Consultez l'historique de toutes vos demandes de collecte
          </p>
        </div>
        
        <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total collectes</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCollections.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collectes réussies</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredCollections.filter(c => c.status === 'completed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Poids total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeight.toFixed(1)} kg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points gagnés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalPoints}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par adresse..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="completed">Terminées</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type de déchet</label>
              <Select value={filters.wasteType} onValueChange={(value) => setFilters({...filters, wasteType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="plastique">Plastique</SelectItem>
                  <SelectItem value="organique">Organique</SelectItem>
                  <SelectItem value="papier">Papier</SelectItem>
                  <SelectItem value="verre">Verre</SelectItem>
                  <SelectItem value="métal">Métal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Période</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Sélectionner
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => setFilters({...filters, dateFrom: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des collectes */}
      <Card>
        <CardHeader>
          <CardTitle>Historique détaillé</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCollections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune collecte trouvée avec ces filtres</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCollections.map((collection) => (
                <div key={collection.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(collection.status)}
                      <h4 className="font-medium">{collection.wasteType}</h4>
                      <Badge className={getStatusColor(collection.status)}>
                        {getStatusLabel(collection.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{collection.address}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{new Date(collection.date).toLocaleDateString('fr-FR')}</span>
                      <span>{collection.weight} kg</span>
                      {collection.collector && <span>Collecteur: {collection.collector}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium text-blue-600">
                      +{collection.points} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
