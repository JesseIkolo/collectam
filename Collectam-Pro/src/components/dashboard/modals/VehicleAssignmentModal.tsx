"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Truck, User, MapPin, Calendar, X, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { BusinessCollector, BusinessVehicle } from '@/types/business';

interface VehicleAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  collector?: BusinessCollector;
  vehicle?: BusinessVehicle;
  availableVehicles: BusinessVehicle[];
  availableCollectors: BusinessCollector[];
  onAssignmentChange: () => void;
}

export default function VehicleAssignmentModal({
  isOpen,
  onClose,
  collector,
  vehicle,
  availableVehicles,
  availableCollectors,
  onAssignmentChange
}: VehicleAssignmentModalProps) {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedCollectorId, setSelectedCollectorId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'assign' | 'reassign' | 'unassign'>('assign');

  useEffect(() => {
    if (isOpen) {
      // Déterminer le mode basé sur les props
      if (collector && collector.assignedVehicleId) {
        setMode('reassign');
        setSelectedVehicleId('');
      } else if (vehicle && vehicle.assignedCollectorId) {
        setMode('reassign');
        setSelectedCollectorId('');
      } else {
        setMode('assign');
      }

      // Pré-sélectionner les valeurs existantes
      if (collector) {
        setSelectedCollectorId(collector._id);
        setSelectedVehicleId(collector.assignedVehicleId || '');
      } else if (vehicle) {
        setSelectedVehicleId(vehicle._id);
        setSelectedCollectorId(vehicle.assignedCollectorId?._id || '');
      }
    }
  }, [isOpen, collector, vehicle]);

  const handleAssign = async () => {
    if (!selectedVehicleId || !selectedCollectorId) {
      toast.error("Veuillez sélectionner un véhicule et un collecteur");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Vous devez être connecté');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // Assigner le collecteur au véhicule
      const response = await fetch(`${apiUrl}/api/business-vehicles/assign-collector`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicleId: selectedVehicleId,
          collectorId: selectedCollectorId
        })
      });

      if (response.ok) {
        toast.success("Assignation réalisée avec succès !");
        onAssignmentChange();
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'assignation');
      }
    } catch (error) {
      console.error('❌ Erreur assignation:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'assignation");
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Vous devez être connecté');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const vehicleIdToUnassign = collector?.assignedVehicleId || vehicle?._id;

      if (!vehicleIdToUnassign) {
        throw new Error('Aucun véhicule à désassigner');
      }

      // Désassigner en envoyant null comme collecteur
      const response = await fetch(`${apiUrl}/api/business-vehicles/assign-collector`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicleId: vehicleIdToUnassign,
          collectorId: null
        })
      });

      if (response.ok) {
        toast.success("Désassignation réalisée avec succès !");
        onAssignmentChange();
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la désassignation');
      }
    } catch (error) {
      console.error('❌ Erreur désassignation:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la désassignation");
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    if (collector) {
      return collector.assignedVehicleId ? 'Réassigner le Véhicule' : 'Assigner un Véhicule';
    } else if (vehicle) {
      return vehicle.assignedCollectorId ? 'Réassigner le Collecteur' : 'Assigner un Collecteur';
    }
    return 'Gérer l\'Assignation';
  };

  const getModalDescription = () => {
    if (collector) {
      return `Gérer l'assignation de véhicule pour ${collector.firstName} ${collector.lastName}`;
    } else if (vehicle) {
      return `Gérer l'assignation de collecteur pour ${vehicle.licensePlate}`;
    }
    return 'Gérer les assignations véhicule-collecteur';
  };

  const currentAssignment = collector?.assignedVehicleId || vehicle?.assignedCollectorId;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {getModalTitle()}
          </DialogTitle>
          <DialogDescription>
            {getModalDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assignation actuelle */}
          {currentAssignment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Assignation Actuelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                {collector && collector.assignedVehicleId && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Véhicule assigné</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {collector.assignedVehicleId}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUnassign}
                      disabled={loading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Désassigner
                    </Button>
                  </div>
                )}

                {vehicle && vehicle.assignedCollectorId && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {vehicle.assignedCollectorId.firstName} {vehicle.assignedCollectorId.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.assignedCollectorId.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUnassign}
                      disabled={loading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Désassigner
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Nouvelle assignation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {currentAssignment ? 'Nouvelle Assignation' : 'Assignation'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sélection du collecteur */}
              {!collector && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Collecteur</label>
                  <Select
                    value={selectedCollectorId}
                    onValueChange={setSelectedCollectorId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un collecteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCollectors
                        .filter(c => c.status === 'actif' && !c.assignedVehicleId)
                        .map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{c.firstName} {c.lastName}</span>
                              {c.workZone && (
                                <Badge variant="outline" className="ml-2">
                                  {c.workZone}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sélection du véhicule */}
              {!vehicle && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Véhicule</label>
                  <Select
                    value={selectedVehicleId}
                    onValueChange={setSelectedVehicleId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un véhicule" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVehicles
                        .filter(v => v.status === 'actif' && !v.assignedCollectorId)
                        .map((v) => (
                          <SelectItem key={v._id} value={v._id}>
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4" />
                              <span>{v.licensePlate}</span>
                              <span className="text-muted-foreground">
                                {v.brand} {v.model}
                              </span>
                              <Badge variant="outline" className="ml-2">
                                {v.vehicleType}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Informations sur la sélection */}
              {selectedCollectorId && selectedVehicleId && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <Check className="h-4 w-4" />
                    <span className="font-medium">Assignation prête</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Le collecteur et le véhicule sélectionnés sont compatibles pour l'assignation.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button
              onClick={handleAssign}
              disabled={loading || !selectedCollectorId || !selectedVehicleId}
              className="flex-1"
            >
              {loading ? 'Assignation...' : 'Confirmer l\'Assignation'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
