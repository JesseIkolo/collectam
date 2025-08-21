'use client';

import { Button, Card, CardBody, Chip, Code } from '@heroui/react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-10 left-10 w-20 h-20 bg-primary-200/30 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute bottom-20 right-20 w-32 h-32 bg-secondary-200/20 rounded-full blur-2xl"
        />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="space-y-12"
        >
          {/* Version Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Chip 
                color="primary" 
                variant="flat" 
                className="animate-fade-in bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 backdrop-blur-sm"
              >
                🚀 Collectam v2.0 - Famille Edition
              </Chip>
            </motion.div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight animate-slide-up"
          >
            Gestion des déchets{' '}
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-bounce-gentle"
              style={{
                backgroundSize: "200% 200%",
                animation: "gradient 3s ease infinite"
              }}
            >
              intelligente
            </motion.span>{' '}
            pour familles modernes
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg xs:text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto animate-fade-in leading-relaxed"
          >
            Plateforme IA + IoT + Blockchain pour transformer vos déchets en revenus. 
            <br className="hidden sm:block" />
            Accessible, personnalisable et rentable pour toute la famille.
          </motion.p>

          {/* CTA Buttons & Code */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col items-center gap-6 mt-12"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  color="primary"
                  className="font-semibold px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25"
                  radius="lg"
                >
                  Commencer maintenant
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="bordered"
                  className="font-semibold px-8 py-4 text-lg border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
                  radius="lg"
                >
                  📖 Documentation
                </Button>
              </motion.div>
            </div>
            
            {/* Installation Code */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="w-full max-w-md"
            >
              <Code 
                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-gray-300 px-4 py-3 text-sm font-mono"
                radius="lg"
              >
                $ npx collectam-cli@latest init
              </Code>
            </motion.div>
          </motion.div>

          {/* Visual Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md border border-primary-200/50 animate-scale-in">
                <CardBody className="p-6 xs:p-8">
                  <div className="aspect-video bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-green-200">
                    {/* Anime-style Floating Elements */}
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <span className="text-white text-lg">💎</span>
                    </motion.div>
                    
                    <motion.div
                      animate={{ 
                        y: [0, -15, 0],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute top-6 left-6 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <span className="text-white text-sm">🌱</span>
                    </motion.div>
                    
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <span className="text-white text-xs">⚡</span>
                    </motion.div>
                    
                    <motion.div
                      animate={{ 
                        x: [0, 20, -20, 0],
                        y: [0, -10, 10, 0]
                      }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <span className="text-white text-xl">💰</span>
                    </motion.div>
                    
                    <div className="text-center space-y-4 z-10 relative">
                      <motion.div 
                        animate={{ 
                          y: [0, -15, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-6xl xs:text-7xl lg:text-8xl filter drop-shadow-lg"
                      >
                        🏠
                      </motion.div>
                      <motion.h3 
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-xl xs:text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
                        style={{ backgroundSize: "200% 200%" }}
                      >
                        Famille Connectée
                      </motion.h3>
                      <p className="text-sm xs:text-base text-gray-700 font-medium">
                        Chaque déchet recyclé = argent gagné ! 🎯
                      </p>
                      
                      {/* Stats Animation */}
                      <div className="flex justify-center space-x-4 mt-4">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                          className="bg-green-500/20 px-3 py-1 rounded-full"
                        >
                          <span className="text-green-700 font-bold text-sm">+50€/mois</span>
                        </motion.div>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          className="bg-blue-500/20 px-3 py-1 rounded-full"
                        >
                          <span className="text-blue-700 font-bold text-sm">100% Eco</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
