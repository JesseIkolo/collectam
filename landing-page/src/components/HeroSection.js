import React from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardBody, Chip } from '@nextui-org/react';
import { Rocket, Shield, CheckCircle, Globe, BarChart3, Truck, Lock, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const trustIndicators = [
    { icon: Lock, text: "Sécurité blockchain", color: "text-tech-600" },
    { icon: CheckCircle, text: "Conforme RSE", color: "text-primary-600" },
    { icon: Globe, text: "Adapté au marché africain", color: "text-orange-600" }
  ];

  return (
    <section className="relative min-h-screen flex items-center gradient-bg overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-tech-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Et si vos déchets devenaient une{' '}
                <span className="text-primary-600 relative">
                  source de valeur
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary-300 origin-left"
                  />
                </span>{' '}
                et d'efficacité ?
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-600 leading-relaxed"
              >
                IA + IoT + Blockchain pour transformer la gestion des déchets en Afrique.
              </motion.p>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2 shadow-2xl"
              >
                <Rocket size={24} />
                <span>Demander une démo gratuite aujourd'hui</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg px-8 py-4"
              >
                Voir la vidéo
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              {trustIndicators.map((indicator, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg"
                >
                  <indicator.icon size={20} className={indicator.color} />
                  <span className="text-gray-700 font-medium">{indicator.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Dashboard Mockup */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Dashboard Collectam</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                {/* Map Placeholder */}
                <div className="bg-primary-100 rounded-lg h-48 mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-tech-200"></div>
                  <div className="absolute top-4 left-4 bg-white rounded-lg p-2 shadow-lg">
                    <BarChart3 size={20} className="text-primary-600" />
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white rounded-lg p-2 shadow-lg">
                    <Truck size={20} className="text-tech-600" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary-600 rounded-full"
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">-30%</div>
                    <div className="text-sm text-gray-600">Coûts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-tech-600">100%</div>
                    <div className="text-sm text-gray-600">Traçable</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+50</div>
                    <div className="text-sm text-gray-600">Collecteurs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 bg-primary-600 text-white p-3 rounded-lg shadow-lg"
            >
              <Shield size={24} />
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-4 bg-tech-600 text-white p-3 rounded-lg shadow-lg"
            >
              <BarChart3 size={24} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
