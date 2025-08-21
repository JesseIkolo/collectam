'use client';

import { motion } from 'framer-motion';
import { CollectamCard } from '../atoms/CollectamCard';
import { CollectamHeading } from '../atoms/CollectamHeading';
import { StatusChip } from '../atoms/StatusChip';
import { getBodyClasses } from '../tokens/typography';
import { animations } from '../tokens/animations';

interface Vehicle {
  id: string;
  name: string;
  status: 'collecting' | 'empty' | 'full' | 'error';
  location: string;
  progress: number;
  estimatedTime: string;
}

interface VehicleTrackerProps {
  vehicles: Vehicle[];
  animated?: boolean;
  className?: string;
}

export function VehicleTracker({
  vehicles,
  animated = true,
  className = ''
}: VehicleTrackerProps) {
  return (
    <motion.div
      {...(animated ? animations.presets.fadeIn : {})}
      className={className}
    >
      <CollectamCard variant="info" padding="lg">
        <CollectamHeading level="h3" className="mb-6" animated={false}>
          Suivi des Véhicules
        </CollectamHeading>
        
        <div className="space-y-4">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900">{vehicle.name}</h4>
                  <StatusChip status={vehicle.status} />
                </div>
                <p className={`${getBodyClasses('small')} mb-2`}>
                  📍 {vehicle.location}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-primary-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${vehicle.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {vehicle.progress}%
                  </span>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm text-gray-600">ETA</p>
                <p className="font-semibold text-primary-600">
                  {vehicle.estimatedTime}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CollectamCard>
    </motion.div>
  );
}
