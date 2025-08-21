'use client';

import { Card, CardBody, Avatar } from '@heroui/react';
import { motion } from 'framer-motion';

export default function SocialProofSection() {
  const logos = [
    { name: 'Lagos State', logo: '🏛️' },
    { name: 'Nairobi City', logo: '🌆' },
    { name: 'EcoTech Africa', logo: '🌱' },
    { name: 'WasteNet', logo: '♻️' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-12"
        >
          {/* Trust Stats */}
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-8">
              Déjà <span className="font-bold text-green-600">50+ collecteurs</span> connectés en temps réel
            </p>
            
            {/* Partner Logos */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
              {logos.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="text-4xl">{partner.logo}</div>
                  <p className="text-sm text-gray-500">{partner.name}</p>
                </motion.div>
              ))}
            </div>

            {/* Video Testimonial Placeholder */}
            <Card className="max-w-2xl mx-auto">
              <CardBody className="p-8">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">📹</div>
                    <p className="text-gray-600">Témoignage vidéo</p>
                  </div>
                </div>
                <blockquote className="text-lg text-gray-700 italic">
                  "Collectam a révolutionné notre approche de la gestion des déchets. 
                  Nous avons réduit nos coûts de 30% en 6 mois."
                </blockquote>
                <div className="flex items-center mt-4">
                  <Avatar name="JD" className="mr-3" />
                  <div>
                    <p className="font-semibold">Jean Dupont</p>
                    <p className="text-sm text-gray-500">Directeur Municipal, Lagos</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Case Study Highlight */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 p-6 bg-green-50 rounded-lg"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Étude de cas : Réduction de 30% des coûts en 6 mois
              </h3>
              <p className="text-green-700">
                Une municipalité pilote a économisé plus de 50 000€ grâce à l'optimisation IA des itinéraires
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
