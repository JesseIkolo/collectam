'use client';

import { Card, CardBody, CardHeader } from '@heroui/react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: '🎨',
    title: 'Thématisable',
    description: 'Interface personnalisable avec thèmes sombres/clairs automatiques selon vos préférences familiales.',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    icon: '⚡',
    title: 'Ultra Rapide',
    description: 'Basé sur l\'IA moderne, aucun temps de latence. Reconnaissance instantanée des déchets.',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    icon: '🌙',
    title: 'Mode Sombre',
    description: 'Reconnaissance automatique du mode sombre, interface adaptée pour usage nocturne.',
    gradient: 'from-purple-500 to-indigo-500'
  },
  {
    icon: '🚀',
    title: 'Expérience Unique',
    description: 'Interface intuitive minimisant la courbe d\'apprentissage pour toute la famille.',
    gradient: 'from-blue-500 to-cyan-500'
  }
];

export default function FeaturesGrid() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Pourquoi choisir{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Collectam
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Une plateforme conçue pour simplifier la gestion des déchets tout en maximisant vos revenus familiaux.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <span className="text-2xl">{feature.icon}</span>
                    </motion.div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <p className="text-gray-300 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { number: '2000+', label: 'Familles satisfaites', icon: '👨‍👩‍👧‍👦' },
            { number: '80€', label: 'Revenus moyens/mois', icon: '💰' },
            { number: '95%', label: 'Taux de recyclage', icon: '♻️' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700">
                <CardBody className="p-8">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
