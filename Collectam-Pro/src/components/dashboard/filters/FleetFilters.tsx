"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Users, Truck } from 'lucide-react';

interface FleetFiltersProps {
  type: 'collectors' | 'vehicles';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  typeFilter?: string;
  onTypeChange?: (type: string) => void;
  workZoneFilter?: string;
  onWorkZoneChange?: (zone: string) => void;
  availableWorkZones?: string[];
  onClearFilters: () => void;
  resultCount: number;
  totalCount: number;
}

export default function FleetFilters({
  type,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  workZoneFilter,
  onWorkZoneChange,
  availableWorkZones = [],
  onClearFilters,
  resultCount,
  totalCount
}: FleetFiltersProps) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || workZoneFilter !== 'all';

  const getStatusOptions = () => {
    if (type === 'collectors') {
      return [
        { value: 'all', label: 'Tous les statuts' },
        { value: 'actif', label: 'Actif' },
        { value: 'inactif', label: 'Inactif' },
        { value: 'suspendu', label: 'Suspendu' }
      ];
    } else {
      return [
        { value: 'all', label: 'Tous les statuts' },
        { value: 'actif', label: 'Actif' },
        { value: 'inactif', label: 'Inactif' },
        { value: 'maintenance', label: 'En Maintenance' },
        { value: 'hors_service', label: 'Hors Service' },
        { value: 'en_mission', label: 'En Mission' }
      ];
    }
  };

  const getTypeOptions = () => {
    if (type === 'vehicles') {
      return [
        { value: 'all', label: 'Tous les types' },
        { value: 'camion', label: 'Camion' },
        { value: 'camionnette', label: 'Camionnette' },
        { value: 'benne', label: 'Benne' },
        { value: 'compacteur', label: 'Compacteur' },
        { value: 'moto', label: 'Moto' },
        { value: 'velo', label: 'Vélo' },
        { value: 'tricycle', label: 'Tricycle' }
      ];
    }
    return [];
  };

  return (
    <div className="space-y-4">
      {/* Barre de recherche et filtres principaux */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={
              type === 'collectors' 
                ? "Rechercher par nom, email, ID employé..." 
                : "Rechercher par plaque, marque, modèle..."
            }
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          {/* Filtre statut */}
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getStatusOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtre type (pour véhicules) */}
          {type === 'vehicles' && onTypeChange && (
            <Select value={typeFilter} onValueChange={onTypeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getTypeOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Filtre zone de travail (pour collecteurs) */}
          {type === 'collectors' && onWorkZoneChange && availableWorkZones.length > 0 && (
            <Select value={workZoneFilter} onValueChange={onWorkZoneChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Zone de travail" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les zones</SelectItem>
                {availableWorkZones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Bouton effacer filtres */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Effacer
            </Button>
          )}
        </div>
      </div>

      {/* Résultats et badges de filtres actifs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Compteur de résultats */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {type === 'collectors' ? (
            <Users className="h-4 w-4" />
          ) : (
            <Truck className="h-4 w-4" />
          )}
          <span>
            {resultCount === totalCount 
              ? `${totalCount} ${type === 'collectors' ? 'collecteur(s)' : 'véhicule(s)'}`
              : `${resultCount} sur ${totalCount} ${type === 'collectors' ? 'collecteur(s)' : 'véhicule(s)'}`
            }
          </span>
        </div>

        {/* Badges des filtres actifs */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Search className="h-3 w-3" />
                "{searchQuery}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                {getStatusOptions().find(opt => opt.value === statusFilter)?.label}
                <button
                  onClick={() => onStatusChange('all')}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {typeFilter && typeFilter !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Truck className="h-3 w-3" />
                {getTypeOptions().find(opt => opt.value === typeFilter)?.label}
                <button
                  onClick={() => onTypeChange?.('all')}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {workZoneFilter && workZoneFilter !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                {workZoneFilter}
                <button
                  onClick={() => onWorkZoneChange?.('all')}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Message si aucun résultat */}
      {hasActiveFilters && resultCount === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Filter className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
          <p className="mb-4">
            Essayez de modifier vos critères de recherche ou effacez les filtres.
          </p>
          <Button variant="outline" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Effacer tous les filtres
          </Button>
        </div>
      )}
    </div>
  );
}
