'use client';

import { Card, CardBody, Button, Chip } from '@heroui/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function UrgencySection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 12,
    minutes: 30,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="max-w-4xl mx-auto bg-white shadow-2xl">
            <CardBody className="p-12">
              <Chip color="danger" variant="flat" className="mb-6" size="lg">
                🔥 Offre de lancement limitée
              </Chip>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                -30% pour les 3 premières villes
              </h2>
              
              <p className="text-xl text-gray-600 mb-8">
                Installation IoT gratuite + Formation premium incluse
              </p>

              {/* Countdown Timer */}
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-8">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="text-center">
                    <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-lg p-4">
                      <div className="text-2xl font-bold">{value.toString().padStart(2, '0')}</div>
                    </div>
                    <div className="text-sm text-gray-500 mt-2 capitalize">{unit}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-600">✅</span>
                  <span>Installation IoT gratuite (valeur 5 000€)</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-600">✅</span>
                  <span>Formation équipe complète incluse</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-600">✅</span>
                  <span>Support premium 24/7 pendant 6 mois</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  size="lg"
                  color="danger"
                  className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold px-12 py-4 text-lg"
                >
                  🚀 Réserver ma place maintenant
                </Button>
                
                <p className="text-sm text-gray-500">
                  Garantie satisfait ou remboursé sous 30 jours
                </p>
              </div>

              {/* Scarcity Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <p className="text-yellow-800 font-semibold">
                  ⚡ Plus que 7 places disponibles sur les 10 initialement prévues
                </p>
              </motion.div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
