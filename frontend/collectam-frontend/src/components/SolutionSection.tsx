'use client';

import { Card, CardBody, Button } from '@heroui/react';
import { motion } from 'framer-motion';

export default function SolutionSection() {
  const steps = [
    {
      number: '01',
      title: 'Collecte Intelligente',
      description: 'IoT sensors détectent automatiquement les niveaux de déchets',
      icon: '📡'
    },
    {
      number: '02', 
      title: 'Optimisation IA',
      description: 'Algorithmes d\'IA calculent les itinéraires les plus efficaces',
      icon: '🤖'
    },
    {
      number: '03',
      title: 'Traçabilité Blockchain',
      description: 'Chaque collecte est enregistrée de manière transparente et sécurisée',
      icon: '🔗'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Notre solution : IA + IoT + Blockchain
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une approche révolutionnaire adaptée au contexte africain, 
            scalable et complète pour transformer la gestion des déchets
          </p>
        </motion.div>

        {/* Solution Steps */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <CardBody className="p-8 text-center">
                  <div className="text-6xl mb-6">{step.icon}</div>
                  <div className="text-4xl font-bold text-green-600 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </CardBody>
              </Card>
              
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-2xl text-green-500">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Differentiation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pourquoi Collectam est différent ?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🌍</div>
                <h4 className="font-semibold text-gray-900 mb-2">Adapté à l'Afrique</h4>
                <p className="text-gray-600">Conçu pour les défis spécifiques du continent</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">📈</div>
                <h4 className="font-semibold text-gray-900 mb-2">Scalable</h4>
                <p className="text-gray-600">De la petite ville à la métropole</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🔧</div>
                <h4 className="font-semibold text-gray-900 mb-2">Solution complète</h4>
                <p className="text-gray-600">Hardware, software et support inclus</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button
              size="lg"
              color="primary"
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold px-8"
            >
              Découvrir la technologie
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
