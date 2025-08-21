'use client';

import { Card, CardBody, Avatar, Button, Chip } from '@heroui/react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Marie Dubois',
    username: '@marie_eco',
    avatar: '👩‍💼',
    role: 'Maman de 3 enfants',
    content: 'Collectam a transformé notre routine familiale ! Les enfants adorent scanner les déchets et voir nos gains augmenter. +120€ ce mois-ci ! 🎉',
    stats: { following: 234, followers: '2.1K' },
    verified: true
  },
  {
    name: 'Ahmed Hassan',
    username: '@ahmed_green',
    avatar: '👨‍🔬',
    role: 'Papa développeur',
    content: 'Interface intuitive, IA précise, blockchain transparente. Mes enfants apprennent l\'écologie tout en gagnant leur argent de poche. Parfait !',
    stats: { following: 189, followers: '5.3K' },
    verified: true
  },
  {
    name: 'Sophie Martin',
    username: '@sophie_family',
    avatar: '👩‍🏫',
    role: 'Enseignante & maman',
    content: 'Utilisé en classe et à la maison. Les élèves sont motivés, les parents satisfaits. Collectam rend l\'écologie ludique et rentable !',
    stats: { following: 156, followers: '3.7K' },
    verified: true
  }
];

const partners = [
  { name: 'EcoTech', logo: '🌱' },
  { name: 'GreenAI', logo: '🤖' },
  { name: 'FamilyTech', logo: '👨‍👩‍👧‍👦' },
  { name: 'BlockChain+', logo: '⛓️' },
  { name: 'SmartHome', logo: '🏠' },
  { name: 'EduGreen', logo: '📚' }
];

export default function CommunitySection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Community Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Rejoignez notre{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
              communauté
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Plus de 2000 familles font déjà confiance à Collectam pour transformer leurs déchets en revenus.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.username}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all duration-300">
                <CardBody className="p-6">
                  {/* User Header */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-white font-semibold">{testimonial.name}</h3>
                        {testimonial.verified && (
                          <Chip size="sm" color="primary" variant="flat">✓</Chip>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{testimonial.username}</p>
                      <p className="text-gray-500 text-xs">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {testimonial.content}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{testimonial.stats.following} Abonnements</span>
                    <span>{testimonial.stats.followers} Abonnés</span>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Partners Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            Soutenu par des partenaires de confiance
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-16 h-16 bg-gray-800/50 rounded-xl flex items-center justify-center text-2xl border border-gray-700 hover:border-gray-600 transition-colors">
                  {partner.logo}
                </div>
                <span className="text-gray-400 text-sm font-medium">{partner.name}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-8 py-4 shadow-lg shadow-green-500/25"
              radius="lg"
            >
              🚀 Rejoindre la communauté
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
