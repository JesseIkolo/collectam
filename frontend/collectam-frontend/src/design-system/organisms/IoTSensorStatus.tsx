'use client';

import { motion } from 'framer-motion';
import { CollectamCard } from '../atoms/CollectamCard';
import { CollectamHeading } from '../atoms/CollectamHeading';
import { StatusChip } from '../atoms/StatusChip';
import { getBodyClasses } from '../tokens/typography';
import { animations } from '../tokens/animations';

interface IoTSensor {
  id: string;
  location: string;
  fillLevel: number;
  batteryLevel: number;
  status: 'full' | 'empty' | 'error';
  lastUpdate: string;
  temperature?: number;
}

interface IoTSensorStatusProps {
  sensors: IoTSensor[];
  animated?: boolean;
  className?: string;
}

export function IoTSensorStatus({
  sensors,
  animated = true,
  className = ''
}: IoTSensorStatusProps) {
  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-success-600';
    if (level > 20) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getFillLevelColor = (level: number) => {
    if (level < 30) return 'bg-success-500';
    if (level < 70) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  return (
    <motion.div
      {...(animated ? animations.presets.fadeIn : {})}
      className={className}
    >
      <CollectamCard variant="info" padding="lg">
        <CollectamHeading level="h3" className="mb-6" animated={false}>
          État des Capteurs IoT
        </CollectamHeading>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor, index) => (
            <motion.div
              key={sensor.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">
                  Capteur #{sensor.id}
                </h4>
                <StatusChip status={sensor.status} />
              </div>
              
              <p className={`${getBodyClasses('small')} mb-3`}>
                📍 {sensor.location}
              </p>
              
              {/* Niveau de remplissage */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Remplissage</span>
                  <span className="font-semibold">{sensor.fillLevel}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${getFillLevelColor(sensor.fillLevel)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${sensor.fillLevel}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
              
              {/* Batterie */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Batterie</span>
                  <span className={`font-semibold ${getBatteryColor(sensor.batteryLevel)}`}>
                    {sensor.batteryLevel}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <motion.div
                    className={`h-1 rounded-full ${getBatteryColor(sensor.batteryLevel).replace('text-', 'bg-')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${sensor.batteryLevel}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                  />
                </div>
              </div>
              
              {/* Informations supplémentaires */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>Mis à jour: {sensor.lastUpdate}</span>
                {sensor.temperature && (
                  <span>🌡️ {sensor.temperature}°C</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CollectamCard>
    </motion.div>
  );
}
