"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Truck, 
  Navigation, 
  Clock, 
  Phone, 
  RefreshCw,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { mapService, CollectorLocation, WasteCollection } from "@/services/MapService";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

interface MapFilters {
  status: string;
  wasteType: string;
  urgency: string;
}

export function RealTimeMapPage() {
  const [collectors, setCollectors] = useState<CollectorLocation[]>([]);
  const [collections, setCollections] = useState<WasteCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MapFilters>({
    status: "all",
    wasteType: "all",
    urgency: "all"
  });
  const [searchAddress, setSearchAddress] = useState("");
  const [selectedCollector, setSelectedCollector] = useState<CollectorLocation | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    loadMapData();
    
    // Auto-refresh every 30 seconds
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(loadMapData, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadMapData = async () => {
    try {
      setLoading(true);
      // Utiliser des données mock en attendant l'API
      const mockCollectors: CollectorLocation[] = [
        {
          id: "1",
          name: "Jean Dupont",
          vehicleType: "Camion",
          currentLocation: "Akwa, Douala",
          coordinates: { lat: 4.0511, lng: 9.7679 },
          onDuty: true,
          phone: "+237123456789",
          lastUpdate: new Date().toISOString()
        },
        {
          id: "2",
          name: "Marie Ngono",
          vehicleType: "Tricycle",
          currentLocation: "Bonanjo, Douala",
          coordinates: { lat: 4.0483, lng: 9.7671 },
          onDuty: true,
          phone: "+237987654321",
          lastUpdate: new Date(Date.now() - 300000).toISOString()
        }
      ];
      
      const mockCollections: WasteCollection[] = [
        {
          id: "1",
          wasteType: "Plastique",
          address: "123 Rue de la Paix, Douala",
          coordinates: { lat: 4.0511, lng: 9.7679 },
          status: "pending",
          urgency: "medium",
          scheduledDate: "2024-01-20",
          scheduledTime: "14:00",
          distance: 2.5,
          assignedCollector: {
            id: "1",
            name: "Jean Dupont",
            phone: "+237123456789",
            estimatedArrival: new Date(Date.now() + 1800000).toISOString()
          }
        },
        {
          id: "2",
          wasteType: "Organique",
          address: "456 Avenue Charles de Gaulle, Douala",
          coordinates: { lat: 4.0483, lng: 9.7671 },
          status: "scheduled",
          urgency: "low",
          scheduledDate: "2024-01-18",
          scheduledTime: "09:00",
          distance: 1.8
        },
        {
          id: "3",
          wasteType: "Électronique",
          address: "789 Boulevard de la Liberté, Douala",
          coordinates: { lat: 4.0495, lng: 9.7685 },
          status: "completed",
          urgency: "high",
          scheduledDate: "2024-01-16",
          scheduledTime: "11:30",
          distance: 3.2,
          completedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      setCollectors(mockCollectors);
      setCollections(mockCollections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la carte');
    } finally {
      setLoading(false);
    }
  };

  const filteredCollections = collections.filter(collection => {
    if (filters.status !== "all" && collection.status !== filters.status) return false;
    if (filters.wasteType !== "all" && collection.wasteType !== filters.wasteType) return false;
    if (filters.urgency !== "all" && collection.urgency !== filters.urgency) return false;
    if (searchAddress && !collection.address.toLowerCase().includes(searchAddress.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCallCollector = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  // Colonnes pour la table des collecteurs
  const collectorsColumns: ColumnDef<CollectorLocation>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nom" />
      ),
    },
    {
      accessorKey: "vehicleType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Véhicule" />
      ),
    },
    {
      accessorKey: "currentLocation",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Position" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="truncate max-w-48">{row.getValue("currentLocation")}</span>
        </div>
      ),
    },
    {
      accessorKey: "onDuty",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Statut" />
      ),
      cell: ({ row }) => {
        const onDuty = row.getValue("onDuty") as boolean;
        return (
          <Badge className={onDuty ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {onDuty ? 'En service' : 'Hors service'}
          </Badge>
        );
      },
    },
    {
      accessorKey: "lastUpdate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dernière MAJ" />
      ),
      cell: ({ row }) => {
        const lastUpdate = row.getValue("lastUpdate") as string;
        return (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{new Date(lastUpdate).toLocaleTimeString()}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const collector = row.original;
        return (
          <div className="flex items-center gap-2">
            {collector.phone && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCallCollector(collector.phone!)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  // Colonnes pour la table des collectes
  const collectionsColumns: ColumnDef<WasteCollection>[] = [
    {
      accessorKey: "wasteType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type de déchet" />
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Adresse" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="truncate max-w-48">{row.getValue("address")}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Statut" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={getStatusColor(status)}>
            {status === 'pending' && 'En attente'}
            {status === 'scheduled' && 'Programmée'}
            {status === 'in_progress' && 'En cours'}
            {status === 'completed' && 'Terminée'}
          </Badge>
        );
      },
    },
    {
      accessorKey: "urgency",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Urgence" />
      ),
      cell: ({ row }) => {
        const urgency = row.getValue("urgency") as string;
        return (
          <Badge className={getUrgencyColor(urgency)}>
            {urgency === 'high' && 'Urgent'}
            {urgency === 'medium' && 'Moyen'}
            {urgency === 'low' && 'Faible'}
          </Badge>
        );
      },
    },
    {
      accessorKey: "scheduledDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date prévue" />
      ),
      cell: ({ row }) => {
        const scheduledDate = row.getValue("scheduledDate") as string;
        const scheduledTime = row.original.scheduledTime;
        return (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{new Date(scheduledDate).toLocaleDateString()} à {scheduledTime}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "distance",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Distance" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          <span>{row.getValue("distance")}km</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const collection = row.original;
        return (
          <div className="flex items-center gap-2">
            {collection.assignedCollector?.phone && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCallCollector(collection.assignedCollector!.phone!)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Contacter
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const collectorsTable = useReactTable({
    data: collectors,
    columns: collectorsColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const collectionsTable = useReactTable({
    data: filteredCollections,
    columns: collectionsColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (loading && collectors.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Carte en Temps Réel</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement de la carte: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Carte en Temps Réel</h1>
          <p className="text-muted-foreground">
            Suivez les collecteurs et vos demandes de ramassage en temps réel
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadMapData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            Auto-refresh {autoRefresh ? "ON" : "OFF"}
          </Button>
        </div>
      </div>

      {/* Filters */}
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
              <label className="text-sm font-medium">Recherche par adresse</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une adresse..."
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
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
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="scheduled">Programmée</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
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
                  <SelectItem value="organic">Organique</SelectItem>
                  <SelectItem value="plastic">Plastique</SelectItem>
                  <SelectItem value="paper">Papier</SelectItem>
                  <SelectItem value="glass">Verre</SelectItem>
                  <SelectItem value="metal">Métal</SelectItem>
                  <SelectItem value="electronic">Électronique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Urgence</label>
              <Select value={filters.urgency} onValueChange={(value) => setFilters({...filters, urgency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes urgences</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Collectors Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Collecteurs Actifs ({collectors.length})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un collecteur..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <DataTableViewOptions table={collectorsTable} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <DataTable table={collectorsTable} columns={collectorsColumns} />
            <DataTablePagination table={collectorsTable} />
          </div>
        </CardContent>
      </Card>

      {/* Collections Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Collectes à Proximité ({filteredCollections.length})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <DataTableViewOptions table={collectionsTable} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <DataTable table={collectionsTable} columns={collectionsColumns} />
            <DataTablePagination table={collectionsTable} />
          </div>
        </CardContent>
      </Card>

      {/* Map Placeholder - In a real implementation, this would be an interactive map */}
      <Card>
        <CardHeader>
          <CardTitle>Vue Cartographique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Carte interactive à venir</p>
              <p className="text-sm text-muted-foreground">
                Intégration avec Google Maps ou Mapbox pour visualiser les collecteurs et collectes en temps réel
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
