"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Calendar, MapPin, Clock, AlertTriangle, CheckCircle, XCircle, Search } from "lucide-react";
import { CreateWasteRequestForm } from "../forms/CreateWasteRequestForm";
import { useWasteRequests } from "@/contexts/WasteRequestContext";
import { wasteService, WasteRequest } from "@/services/WasteService";
import { wasteRequestService } from "@/services/WasteRequestService";
import useWebSocket from "@/hooks/useWebSocket";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

// Types pour les données
interface WasteRequestData {
  id: string;
  wasteType: string;
  description: string;
  estimatedWeight: number;
  address: string;
  status: "pending" | "scheduled" | "in_progress" | "completed" | "cancelled";
  urgency: "low" | "medium" | "high";
  preferredDate: string;
  preferredTime: string;
  createdAt: string;
}

// Configuration des badges de statut
const statusConfig = {
  pending: { label: "En attente", variant: "secondary" as const, icon: Clock },
  scheduled: { label: "Programmé", variant: "default" as const, icon: Calendar },
  in_progress: { label: "En cours", variant: "default" as const, icon: AlertTriangle },
  completed: { label: "Terminé", variant: "default" as const, icon: CheckCircle },
  cancelled: { label: "Annulé", variant: "destructive" as const, icon: XCircle },
};

const urgencyConfig = {
  low: { label: "Faible", variant: "secondary" as const },
  medium: { label: "Moyenne", variant: "default" as const },
  high: { label: "Élevée", variant: "destructive" as const },
};

export function WasteManagementPage() {
  const { wasteRequests, addWasteRequest, deleteWasteRequest } = useWasteRequests();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tableData, setTableData] = useState<WasteRequestData[]>([]);

  // Charger depuis l'API (fusion des deux modèles) et dédupliquer
  const loadUserRequests = async () => {
    try {
      setLoading(true);
      const requests = await wasteRequestService.getUserRequests();
      const mapped: WasteRequestData[] = (requests || []).map((r: any) => ({
        id: r._id || r.id,
        wasteType: r.wasteType || "",
        description: r.description || "",
        estimatedWeight: r.estimatedWeight || 0,
        address: r.address || "",
        status: r.status || "pending",
        urgency: r.urgency || "medium",
        preferredDate: r.preferredDate || r.createdAt || new Date().toISOString(),
        preferredTime: r.preferredTime || "",
        createdAt: r.createdAt || new Date().toISOString(),
      }));
      setTableData(mapped);
      setError(null);
      console.log(`📋 WasteManagementPage: ${mapped.length} demandes chargées (fusion)`);
    } catch (err) {
      console.error('❌ Erreur chargement demandes (WasteManagementPage):', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // WS: rafraîchir quand assignation/début/fin
  useWebSocket({
    onCollectorAssigned: (data) => {
      try { toast.success('Collecteur assigné à votre demande'); } catch {}
      loadUserRequests();
    },
    onCollectionStarted: (data) => {
      try { toast.info('Votre collecte a démarré'); } catch {}
      loadUserRequests();
    },
    onCollectionCompleted: (data) => {
      try { toast.success('Votre collecte est terminée'); } catch {}
      loadUserRequests();
    },
  });

  // Charger au montage et écouter l'événement personnalisé
  useEffect(() => {
    loadUserRequests();
    const onUpdated = (evt?: Event) => {
      try {
        const detail = (evt as CustomEvent)?.detail;
        if (detail?.reason === 'created') toast.success('Demande créée');
        if (detail?.reason === 'updated') toast.info('Demande mise à jour');
        if (detail?.reason === 'deleted') toast.success('Demande supprimée');
      } catch {}
      loadUserRequests();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('waste_requests_updated', onUpdated as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('waste_requests_updated', onUpdated as EventListener);
      }
    };
  }, []);

  // Colonnes pour la DataTable
  const columns: ColumnDef<WasteRequestData>[] = [
    {
      accessorKey: "wasteType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type de déchet" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("wasteType")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.getValue("description")}>
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "estimatedWeight",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Poids estimé" />
      ),
      cell: ({ row }) => (
        <div>{row.getValue("estimatedWeight")} kg</div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Statut" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusConfig;
        const config = statusConfig[status];
        const Icon = config.icon;
        return (
          <Badge variant={config.variant} className="flex items-center gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
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
        const urgency = row.getValue("urgency") as keyof typeof urgencyConfig;
        const config = urgencyConfig[urgency];
        return (
          <Badge variant={config.variant}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "preferredDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date souhaitée" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("preferredDate"));
        return (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {date.toLocaleDateString("fr-FR")}
          </div>
        );
      },
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Adresse" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 max-w-[150px] truncate" title={row.getValue("address")}>
          <MapPin className="h-3 w-3" />
          {row.getValue("address")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          {row.original.status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await wasteRequestService.assignNearest(row.original.id);
                  toast.success('Collecteur assigné (plus proche)');
                  loadUserRequests();
                } catch (e) {
                  console.error('❌ Assignation échouée:', e);
                  toast.error('Impossible d\'assigner un collecteur pour le moment');
                }
              }}
            >
              Assigner
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Configuration de la table
  const dataSource = tableData.length ? tableData : wasteRequests;
  const table = useReactTable({
    data: dataSource,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  // Les données sont maintenant gérées par le contexte

  const handleEdit = (request: WasteRequestData) => {
    // TODO: Implémenter l'édition
    toast.info("Fonction d'édition à implémenter");
  };

  const handleDelete = async (id: string) => {
    try {
      // Tentative côté serveur si possible
      try {
        await wasteRequestService.deleteRequest(id);
        // Notifier l'app pour rafraîchir autres vues
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('waste_requests_updated', { detail: { reason: 'deleted', id } }));
        }
      } catch {}
      // Mise à jour locale (contexte + table)
      deleteWasteRequest(id);
      setTableData(prev => prev.filter(r => r.id !== id));
      toast.success("Demande supprimée avec succès");
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleCreate = () => {
    setShowCreateForm(true);
  };

  const handleCreateSubmit = async (formData: any) => {
    try {
      await addWasteRequest({
        wasteType: formData.wasteType,
        description: formData.description,
        estimatedWeight: formData.estimatedWeight,
        address: formData.address,
        urgency: formData.urgency,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime
      });
      setShowCreateForm(false);
      toast.success("Demande créée et sauvegardée avec succès!");
    } catch (error) {
      toast.error("Demande créée localement (erreur de connexion au serveur)");
      setShowCreateForm(false);
    }
  };

  const handleCreateCancel = () => {
    setShowCreateForm(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Déchets</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="animate-pulse text-muted-foreground">
                Chargement des données...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Déchets</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32 text-destructive">
              <AlertTriangle className="h-6 w-6 mr-2" />
              {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <CreateWasteRequestForm
        onSubmit={handleCreateSubmit}
        onCancel={handleCreateCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Déchets</h1>
          <p className="text-muted-foreground">
            Gérez vos demandes de collecte de déchets
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataSource.length}</div>
            <p className="text-xs text-muted-foreground">demandes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dataSource.filter((r: any) => r.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">demandes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programmées</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dataSource.filter((r: any) => r.status === "scheduled").length}
            </div>
            <p className="text-xs text-muted-foreground">demandes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dataSource.filter((r: any) => r.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">demandes</p>
          </CardContent>
        </Card>
      </div>

      {/* Table des demandes */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes de collecte</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-8"
              />
            </div>
            <DataTableViewOptions table={table} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <DataTable table={table} columns={columns} />
            <DataTablePagination table={table} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
