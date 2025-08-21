'use client';

import { motion } from 'framer-motion';
import { CollectamCard } from '../atoms/CollectamCard';
import { CollectamHeading } from '../atoms/CollectamHeading';
import { CollectamButton } from '../atoms/CollectamButton';
import { getBodyClasses } from '../tokens/typography';
import { animations } from '../tokens/animations';

interface RoutePoint {
  id: string;
  location: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number; // minutes
  wasteLevel: number; // percentage
}

interface OptimizedRoute {
  id: string;
  vehicleId: string;
  points: RoutePoint[];
  totalDistance: number; // km
  totalTime: number; // minutes
  fuelSaved: number; // percentage
  efficiency: number; // percentage
}

interface RouteOptimizerProps {
  routes: OptimizedRoute[];
  onOptimize?: () => void;
  animated?: boolean;
  className?: string;
}

export function RouteOptimizer({
  routes,
  onOptimize,
  animated = true,
  className = ''
}: RouteOptimizerProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-danger-600 bg-danger-100';
      case 'medium': return 'text-warning-600 bg-warning-100';
      case 'low': return 'text-success-600 bg-success-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-success-600';
    if (efficiency >= 70) return 'text-warning-600';
    return 'text-danger-600';
  };

  return (
    <motion.div
      {...(animated ? animations.presets.fadeIn : {})}
      className={className}
    >
      <CollectamCard variant="info" padding="lg">
        <div className="flex items-center justify-between mb-6">
          <CollectamHeading level="h3" animated={false}>
            Optimisation des Itinéraires IA
          </CollectamHeading>
          <CollectamButton
            variant="primary"
            size="sm"
            onClick={onOptimize}
            animated={false}
          >
            🤖 Optimiser
          </CollectamButton>
        </div>
        
        <div className="space-y-6">
          {routes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">
                  Véhicule {route.vehicleId} - Itinéraire {route.id}
                </h4>
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-semibold ${getEfficiencyColor(route.efficiency)}`}>
                    {route.efficiency}% efficace
                  </span>
                  <span className="text-sm text-success-600 font-medium">
                    -{route.fuelSaved}% carburant
                  </span>
                </div>
              </div>
              
              {/* Route Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-2 bg-white rounded">
                  <p className="text-2xl font-bold text-primary-600">
                    {route.totalDistance}km
                  </p>
                  <p className="text-xs text-gray-600">Distance</p>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <p className="text-2xl font-bold text-secondary-600">
                    {Math.floor(route.totalTime / 60)}h{route.totalTime % 60}m
                  </p>
                  <p className="text-xs text-gray-600">Temps</p>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <p className="text-2xl font-bold text-success-600">
                    {route.points.length}
                  </p>
                  <p className="text-xs text-gray-600">Points</p>
                </div>
              </div>
              
              {/* Route Points */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Points de collecte :</p>
                {route.points.map((point, pointIndex) => (
                  <motion.div
                    key={point.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + pointIndex * 0.05 }}
                    className="flex items-center justify-between p-2 bg-white rounded text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {pointIndex + 1}
                      </span>
                      <span>{point.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(point.priority)}`}>
                        {point.priority}
                      </span>
                      <span className="text-gray-600">
                        {point.wasteLevel}% • {point.estimatedTime}min
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span className="text-primary-600">🤖</span>
            <p className="text-sm text-primary-800">
              L'IA optimise automatiquement les itinéraires en temps réel basé sur le trafic, 
              les niveaux de déchets et les priorités
            </p>
          </div>
        </motion.div>
      </CollectamCard>
    </motion.div>
  );
}
