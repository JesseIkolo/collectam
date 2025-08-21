'use client';

import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { motion } from 'framer-motion';

export default function FeaturesSection() {
  const features = [
    {
      icon: '📊',
      title: 'Dashboard temps réel',
      description: 'Décisions rapides basées sur des données en temps réel',
      benefit: 'Réactivité maximale'
    },
    {
      icon: '🚛',
      title: 'Itinéraires IA',
      description: 'Optimisation automatique des parcours de collecte',
      benefit: '-30% coûts carburant'
    },
    {
      icon: '🔒',
      title: 'Blockchain',
      description: 'Traçabilité complète et transparente',
      benefit: 'Zéro fraude, 100% traçable'
    },
    {
      icon: '🌱',
      title: 'Impact RSE',
      description: 'Amélioration de l\'image environnementale',
      benefit: 'Réputation positive'
    }
  ];

  const comparison = [
    { feature: 'Optimisation des itinéraires', traditional: '❌', collectam: '✅ IA avancée' },
    { feature: 'Traçabilité complète', traditional: '❌', collectam: '✅ Blockchain' },
    { feature: 'Monitoring temps réel', traditional: '❌', collectam: '✅ IoT sensors' },
    { feature: 'Coûts opérationnels', traditional: 'Élevés', collectam: '-30% réduction' },
    { feature: 'Support technique', traditional: 'Limité', collectam: '24/7 Premium' }
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
            Fonctionnalités qui transforment votre activité
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chaque fonctionnalité est conçue pour maximiser votre efficacité et réduire vos coûts
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardBody className="p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{feature.description}</p>
                  <div className="text-green-600 font-semibold">
                    {feature.benefit}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Collectam vs Solutions traditionnelles
          </h3>
          <Card className="max-w-4xl mx-auto">
            <CardBody>
              <Table aria-label="Comparison table">
                <TableHeader>
                  <TableColumn>Fonctionnalité</TableColumn>
                  <TableColumn>Solutions traditionnelles</TableColumn>
                  <TableColumn>Collectam</TableColumn>
                </TableHeader>
                <TableBody>
                  {comparison.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.feature}</TableCell>
                      <TableCell>{row.traditional}</TableCell>
                      <TableCell className="text-green-600 font-semibold">{row.collectam}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
