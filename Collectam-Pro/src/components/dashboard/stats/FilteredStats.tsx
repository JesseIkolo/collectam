"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Truck, UserCheck, UserMinus, AlertTriangle, CheckCircle, Clock, Wrench } from 'lucide-react';
import { BusinessCollector, BusinessVehicle } from '@/types/business';

interface FilteredStatsProps {
  collectors: BusinessCollector[];
  vehicles: BusinessVehicle[];
  filteredCollectors: BusinessCollector[];
  filteredVehicles: BusinessVehicle[];
  hasActiveFilters: boolean;
}

export default function FilteredStats({
  collectors,
  vehicles,
  filteredCollectors,
  filteredVehicles,
  hasActiveFilters
}: FilteredStatsProps) {
  // Statistiques des collecteurs
  const collectorStats = {
    total: collectors.length,
    filtered: filteredCollectors.length,
    actif: filteredCollectors.filter(c => c.status === 'actif').length,
    inactif: filteredCollectors.filter(c => c.status === 'inactif').length,
    suspendu: filteredCollectors.filter(c => c.status === 'suspendu').length,
    assigned: filteredCollectors.filter(c => c.assignedVehicleId).length,
    withWorkZone: filteredCollectors.filter(c => c.workZone).length
  };

  // Statistiques des véhicules
  const vehicleStats = {
    total: vehicles.length,
    filtered: filteredVehicles.length,
    actif: filteredVehicles.filter(v => v.status === 'actif').length,
    inactif: filteredVehicles.filter(v => v.status === 'inactif').length,
    maintenance: filteredVehicles.filter(v => v.status === 'maintenance').length,
    hors_service: filteredVehicles.filter(v => v.status === 'hors_service').length,
    en_mission: filteredVehicles.filter(v => v.status === 'en_mission').length,
    assigned: filteredVehicles.filter(v => v.assignedCollectorId).length
  };

  // Types de véhicules dans les résultats filtrés
  const vehicleTypes = filteredVehicles.reduce((acc, vehicle) => {
    acc[vehicle.vehicleType] = (acc[vehicle.vehicleType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Zones de travail dans les résultats filtrés
  const workZones = filteredCollectors.reduce((acc, collector) => {
    if (collector.workZone) {
      acc[collector.workZone] = (acc[collector.workZone] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Indicateur de filtrage */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Résultats filtrés</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Affichage de {collectorStats.filtered} collecteur(s) et {vehicleStats.filtered} véhicule(s) 
            sur un total de {collectorStats.total} et {vehicleStats.total} respectivement.
          </p>
        </div>
      )}

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Collecteurs actifs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collecteurs Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{collectorStats.actif}</div>
            <p className="text-xs text-muted-foreground">
              {hasActiveFilters ? `sur ${collectorStats.filtered} filtrés` : `sur ${collectorStats.total} total`}
            </p>
          </CardContent>
        </Card>

        {/* Véhicules actifs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Véhicules Actifs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{vehicleStats.actif}</div>
            <p className="text-xs text-muted-foreground">
              {hasActiveFilters ? `sur ${vehicleStats.filtered} filtrés` : `sur ${vehicleStats.total} total`}
            </p>
          </CardContent>
        </Card>

        {/* Assignations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignations</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{collectorStats.assigned}</div>
            <p className="text-xs text-muted-foreground">
              collecteurs avec véhicule
            </p>
          </CardContent>
        </Card>

        {/* Maintenance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{vehicleStats.maintenance}</div>
            <p className="text-xs text-muted-foreground">
              véhicules en maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Répartition des statuts collecteurs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statuts Collecteurs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Actifs</span>
              </div>
              <Badge variant="outline">{collectorStats.actif}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm">Inactifs</span>
              </div>
              <Badge variant="outline">{collectorStats.inactif}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Suspendus</span>
              </div>
              <Badge variant="outline">{collectorStats.suspendu}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Répartition des statuts véhicules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statuts Véhicules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Actifs</span>
              </div>
              <Badge variant="outline">{vehicleStats.actif}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Maintenance</span>
              </div>
              <Badge variant="outline">{vehicleStats.maintenance}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">En mission</span>
              </div>
              <Badge variant="outline">{vehicleStats.en_mission}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Hors service</span>
              </div>
              <Badge variant="outline">{vehicleStats.hors_service}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Répartitions spécialisées */}
      {(Object.keys(vehicleTypes).length > 0 || Object.keys(workZones).length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Types de véhicules */}
          {Object.keys(vehicleTypes).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Types de Véhicules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(vehicleTypes)
                  .sort(([,a], [,b]) => b - a)
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm capitalize">{type}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}

          {/* Zones de travail */}
          {Object.keys(workZones).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Zones de Travail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(workZones)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5) // Limiter à 5 zones principales
                  .map(([zone, count]) => (
                    <div key={zone} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{zone}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                {Object.keys(workZones).length > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{Object.keys(workZones).length - 5} autres zones
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Indicateurs de performance */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Taux d'Assignation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {collectorStats.filtered > 0 
                ? Math.round((collectorStats.assigned / collectorStats.filtered) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              collecteurs avec véhicule
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Taux d'Activité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {collectorStats.filtered > 0 
                ? Math.round((collectorStats.actif / collectorStats.filtered) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              collecteurs actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Disponibilité Flotte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {vehicleStats.filtered > 0 
                ? Math.round((vehicleStats.actif / vehicleStats.filtered) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              véhicules opérationnels
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
