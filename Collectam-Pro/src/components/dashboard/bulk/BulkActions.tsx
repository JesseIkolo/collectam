"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  UserCheck, 
  UserX, 
  UserMinus, 
  Settings, 
  AlertTriangle,
  X,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { BusinessCollector, BusinessVehicle } from '@/types/business';

interface BulkActionsProps {
  type: 'collectors' | 'vehicles';
  items: (BusinessCollector | BusinessVehicle)[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onBulkAction: (action: string, itemIds: string[], data?: any) => Promise<void>;
  isVisible: boolean;
  onClose: () => void;
}

export default function BulkActions({
  type,
  items,
  selectedItems,
  onSelectionChange,
  onBulkAction,
  isVisible,
  onClose
}: BulkActionsProps) {
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [actionData, setActionData] = useState<any>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isVisible || selectedItems.length === 0) return null;

  const selectedCount = selectedItems.length;
  const totalCount = items.length;

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items.map(item => item._id));
    }
  };

  const getAvailableActions = () => {
    if (type === 'collectors') {
      return [
        { value: 'activate', label: 'Activer', icon: UserCheck, color: 'green' },
        { value: 'deactivate', label: 'Désactiver', icon: UserX, color: 'orange' },
        { value: 'suspend', label: 'Suspendre', icon: UserMinus, color: 'red' },
        { value: 'delete', label: 'Supprimer', icon: Trash2, color: 'red', dangerous: true },
      ];
    } else {
      return [
        { value: 'activate', label: 'Activer', icon: UserCheck, color: 'green' },
        { value: 'deactivate', label: 'Désactiver', icon: UserX, color: 'orange' },
        { value: 'maintenance', label: 'Mettre en maintenance', icon: Settings, color: 'orange' },
        { value: 'out_of_service', label: 'Mettre hors service', icon: AlertTriangle, color: 'red' },
        { value: 'delete', label: 'Supprimer', icon: Trash2, color: 'red', dangerous: true },
      ];
    }
  };

  const getActionDescription = (action: string) => {
    const descriptions = {
      activate: `Activer ${selectedCount} ${type === 'collectors' ? 'collecteur(s)' : 'véhicule(s)'}`,
      deactivate: `Désactiver ${selectedCount} ${type === 'collectors' ? 'collecteur(s)' : 'véhicule(s)'}`,
      suspend: `Suspendre ${selectedCount} collecteur(s)`,
      maintenance: `Mettre ${selectedCount} véhicule(s) en maintenance`,
      out_of_service: `Mettre ${selectedCount} véhicule(s) hors service`,
      delete: `Supprimer définitivement ${selectedCount} ${type === 'collectors' ? 'collecteur(s)' : 'véhicule(s)'}`,
    };
    return descriptions[action as keyof typeof descriptions] || '';
  };

  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
    const actionConfig = getAvailableActions().find(a => a.value === action);
    
    if (actionConfig?.dangerous) {
      setShowConfirmation(true);
    } else {
      executeAction(action);
    }
  };

  const executeAction = async (action: string, confirmed = false) => {
    if (getAvailableActions().find(a => a.value === action)?.dangerous && !confirmed) {
      setShowConfirmation(true);
      return;
    }

    setLoading(true);
    setShowConfirmation(false);

    try {
      // Mapper les actions vers les valeurs de statut appropriées
      let statusValue = action;
      if (action === 'activate') {
        statusValue = 'actif';
      } else if (action === 'deactivate') {
        statusValue = 'inactif';
      } else if (action === 'suspend') {
        statusValue = 'suspendu';
      } else if (action === 'maintenance') {
        statusValue = 'maintenance';
      } else if (action === 'out_of_service') {
        statusValue = 'hors_service';
      }

      await onBulkAction(action, selectedItems, { status: statusValue });
      
      toast.success(`Action "${getActionDescription(action)}" exécutée avec succès !`);
      
      // Réinitialiser la sélection après l'action
      onSelectionChange([]);
      setSelectedAction('');
      
    } catch (error) {
      console.error('❌ Erreur action en lot:', error);
      toast.error(`Erreur lors de l'exécution de l'action: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedItemsDetails = items.filter(item => selectedItems.includes(item._id));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Informations de sélection */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="flex items-center gap-2"
              >
                {selectedItems.length === items.length ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                {selectedItems.length === items.length ? 'Tout désélectionner' : 'Tout sélectionner'}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedCount} sur {totalCount} sélectionné(s)
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions disponibles */}
          <div className="flex items-center gap-2">
            <Select value={selectedAction} onValueChange={handleActionSelect}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Choisir une action" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableActions().map((action) => {
                  const Icon = action.icon;
                  return (
                    <SelectItem key={action.value} value={action.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 text-${action.color}-600`} />
                        <span className={action.dangerous ? 'text-red-600' : ''}>
                          {action.label}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Exécution en cours...
              </div>
            )}
          </div>
        </div>

        {/* Aperçu des éléments sélectionnés */}
        {selectedCount > 0 && selectedCount <= 5 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedItemsDetails.map((item) => (
              <Badge key={item._id} variant="outline" className="text-xs">
                {type === 'collectors' 
                  ? `${(item as BusinessCollector).firstName} ${(item as BusinessCollector).lastName}`
                  : (item as BusinessVehicle).licensePlate
                }
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Dialog de confirmation pour actions dangereuses */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Confirmer l'action
              </CardTitle>
              <CardDescription>
                {getActionDescription(selectedAction)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => executeAction(selectedAction, true)}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Exécution...
                      </>
                    ) : (
                      'Confirmer'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
