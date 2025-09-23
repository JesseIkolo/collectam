"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  MapPin, 
  Package, 
  Phone, 
  User, 
  Play, 
  CheckCircle, 
  AlertTriangle,
  Route,
  Weight,
  Calendar,
  StickyNote
} from "lucide-react";
import { wasteRequestService, WasteRequest } from "@/services/WasteRequestService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/hooks/useWebSocket";

interface AssignedRequestsSectionProps {
  className?: string;
  onUpdate?: () => void;
}

export function AssignedRequestsSection({ className, onUpdate }: AssignedRequestsSectionProps) {
  const [requests, setRequests] = useState<WasteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();
  const { notifyCollectionStarted, notifyCollectionCompleted } = useWebSocket();

  useEffect(() => {
    loadAssignedRequests();
  }, []);

  const loadAssignedRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await wasteRequestService.getAssignedRequests();
      setRequests(data);
      console.log(`📋 ${data.length} demandes assignées chargées`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
      console.error('❌ Erreur chargement demandes assignées:', err);
      toast.error('Erreur lors du chargement des demandes assignées');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCollection = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      await wasteRequestService.startCollection(requestId);
      
      // Update the request in the local state
      setRequests(prev => prev.map(req => 
        req._id === requestId 
          ? { ...req, status: 'in_progress' as const }
          : req
      ));
      
      toast.success('Collecte démarrée avec succès');
      console.log('🚛 Collecte démarrée:', requestId);
      // WebSocket notification pour le ménage
      try { notifyCollectionStarted(requestId); } catch {}
      // Notify parent to refresh stats
      onUpdate?.();
      // Rediriger vers la carte collecteur, centrée sur la collecte
      router.push(`/dashboard/collector/map?focus=${requestId}`);
    } catch (err) {
      console.error('❌ Erreur démarrage collecte:', err);
      toast.error('Erreur lors du démarrage de la collecte');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteCollection = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      
      // For now, complete with estimated weight
      // In a real app, you'd show a form to collect actual weight and notes
      const request = requests.find(r => r._id === requestId);
      await wasteRequestService.completeCollection(requestId, {
        actualWeight: request?.estimatedWeight,
        notes: 'Collecte terminée par le collecteur'
      });
      
      // Remove the completed request from the list
      setRequests(prev => prev.filter(req => req._id !== requestId));
      
      toast.success('Collecte terminée avec succès');
      console.log('✅ Collecte terminée:', requestId);
      // WebSocket notification pour le ménage
      try { notifyCollectionCompleted(requestId, request?.estimatedWeight); } catch {}
      // Notify parent to refresh stats
      onUpdate?.();
    } catch (err) {
      console.error('❌ Erreur finalisation collecte:', err);
      toast.error('Erreur lors de la finalisation de la collecte');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Mes demandes assignées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/3 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Mes demandes assignées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={loadAssignedRequests} 
            variant="outline" 
            className="mt-4"
          >
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Mes demandes assignées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune demande assignée</h3>
            <p className="text-muted-foreground mb-4">
              Vous n'avez actuellement aucune demande de collecte assignée.
            </p>
            <Button onClick={loadAssignedRequests} variant="outline">
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Mes demandes assignées
          </div>
          <Badge variant="secondary">
            {requests.length} demande{requests.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="border rounded-lg p-4 space-y-4">
              {/* Header with status and urgency */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={wasteRequestService.getStatusVariant(request.status)}>
                    {wasteRequestService.getStatusLabel(request.status)}
                  </Badge>
                  <Badge variant={wasteRequestService.getUrgencyVariant(request.urgency)}>
                    {wasteRequestService.getUrgencyLabel(request.urgency)}
                  </Badge>
                </div>
                <Badge variant="outline">
                  {wasteRequestService.getWasteTypeLabel(request.wasteType)}
                </Badge>
              </div>

              {/* Customer info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {request.userId.firstName} {request.userId.lastName}
                  </span>
                  <Phone className="h-4 w-4 text-muted-foreground ml-4" />
                  <span className="text-sm text-muted-foreground">
                    {request.userId.phone}
                  </span>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    {request.address}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Request details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date préférée</p>
                    <p className="text-muted-foreground">
                      {formatDate(request.preferredDate)} à {formatTime(request.preferredTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Poids estimé</p>
                    <p className="text-muted-foreground">
                      {request.estimatedWeight} kg
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Créé le</p>
                    <p className="text-muted-foreground">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {request.description && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Description</span>
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                    {request.description}
                  </p>
                </div>
              )}

              {/* Notes */}
              {request.notes && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Notes</span>
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                    {request.notes}
                  </p>
                </div>
              )}

              <Separator />

              {/* Action buttons */}
              <div className="flex gap-2">
                {request.status === 'scheduled' && (
                  <Button
                    onClick={() => handleStartCollection(request._id)}
                    disabled={actionLoading === request._id}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {actionLoading === request._id ? 'Démarrage...' : 'Démarrer la collecte'}
                  </Button>
                )}

                {request.status === 'in_progress' && (
                  <Button
                    onClick={() => handleCompleteCollection(request._id)}
                    disabled={actionLoading === request._id}
                    variant="default"
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {actionLoading === request._id ? 'Finalisation...' : 'Marquer comme terminé'}
                  </Button>
                )}

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push(`/dashboard/collector/map?focus=${request._id}`)}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Voir sur la carte
                </Button>

                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button onClick={loadAssignedRequests} variant="outline">
            Actualiser les demandes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
