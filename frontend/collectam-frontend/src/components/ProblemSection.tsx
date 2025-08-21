'use client';

import { Card, CardBody } from '@heroui/react';
import { motion } from 'framer-motion';

export default function ProblemSection() {
  const problems = [
    {
      icon: '💰',
      title: 'Coûts élevés',
      description: '20% de coûts gaspillés par manque d\'optimisation'
    },
    {
      icon: '📍',
      title: 'Manque de traçabilité',
      description: 'Impossible de suivre efficacement les collectes'
    },
    {
      icon: '🏢',
      title: 'Mauvaise image RSE',
      description: 'Impact négatif sur la réputation environnementale'
    },
    {
      icon: '⚡',
      title: 'Inefficacité opérationnelle',
      description: 'Itinéraires non optimisés, temps perdu'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            La gestion des déchets en Afrique fait face à des défis majeurs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chaque jour, les municipalités et entreprises perdent temps et argent 
            à cause de systèmes inefficaces
          </p>
        </motion.div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardBody className="text-center p-6">
                  <div className="text-4xl mb-4">{problem.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600">{problem.description}</p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Cost of Inaction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-red-50 border-l-4 border-red-400 p-8 rounded-lg"
        >
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-800">
              Le coût de l'inaction
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg font-semibold text-red-700 mb-2">
                20% de coûts gaspillés chaque mois
              </p>
              <p className="text-red-600">
                Itinéraires non optimisés, collectes manquées, carburant gaspillé
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-red-700 mb-2">
                10 tonnes de déchets non valorisés/mois
              </p>
              <p className="text-red-600">
                Opportunités de recyclage perdues, impact environnemental négatif
              </p>
            </div>
          </div>
        </motion.div>

        {/* Emotional Storytelling */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <blockquote className="text-2xl italic text-gray-700 max-w-4xl mx-auto">
            "Chaque camion mal optimisé, c'est plus de pollution et plus de coûts. 
            Il est temps de transformer cette industrie avec la technologie."
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
