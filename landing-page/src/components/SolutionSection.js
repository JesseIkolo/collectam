import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Wifi, Shield, ArrowRight, Zap, Target, Globe } from 'lucide-react';

const SolutionSection = () => {
  const steps = [
    {
      number: "01",
      icon: Wifi,
      title: "Collecte IoT",
      description: "Capteurs intelligents dans les poubelles transmettent les données en temps réel",
      color: "text-tech-600",
      bgColor: "bg-tech-100",
      details: ["Niveau de remplissage", "Géolocalisation GPS", "État des équipements"]
    },
    {
      number: "02", 
      icon: Brain,
      title: "Optimisation IA",
      description: "Algorithmes d'apprentissage automatique optimisent les tournées et prédisent les besoins",
      color: "text-primary-600",
      bgColor: "bg-primary-100",
      details: ["Routes optimisées", "Prédictions de charge", "Allocation des ressources"]
    },
    {
      number: "03",
      icon: Shield,
      title: "Traçabilité Blockchain",
      description: "Enregistrement immutable de chaque action pour une transparence totale",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      details: ["Historique complet", "Preuves d'impact", "Conformité RSE"]
    }
  ];

  const differentiators = [
    {
      icon: Globe,
      title: "Adapté au contexte africain",
      description: "Conçu pour les infrastructures et défis spécifiques du continent"
    },
    {
      icon: Zap,
      title: "Scalable et modulaire",
      description: "S'adapte de la petite ville à la grande métropole"
    },
    {
      icon: Target,
      title: "Solution complète",
      description: "Hardware, software et accompagnement en un seul package"
    }
  ];

  return (
    <section id="solution" className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6">
            <Zap size={20} />
            <span className="font-medium">La solution</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            L'approche révolutionnaire 
            <span className="text-primary-600"> IA + IoT + Blockchain</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Collectam combine trois technologies de pointe pour créer la première plateforme 
            de gestion des déchets véritablement intelligente et transparente d'Afrique
          </p>
        </motion.div>

        {/* Visual Diagram - 3 Steps */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 * index }}
                className="relative"
              >
                {/* Connection Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + 0.2 * index }}
                    >
                      <ArrowRight size={24} className="text-gray-400" />
                    </motion.div>
                  </div>
                )}

                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full">
                  {/* Step Number */}
                  <div className="text-4xl font-bold text-gray-200 mb-4">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`${step.bgColor} rounded-full w-16 h-16 flex items-center justify-center mb-6`}>
                    <step.icon size={32} className={step.color} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Details */}
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-500">
                        <div className={`w-2 h-2 rounded-full ${step.bgColor} mr-3`}></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Differentiators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi Collectam est différent
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {differentiators.map((diff, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-primary-100 to-tech-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <diff.icon size={32} className="text-primary-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  {diff.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {diff.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interactive Demo Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Voyez Collectam en action
          </h3>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Découvrez comment notre plateforme transforme la gestion des déchets 
            avec une démo interactive personnalisée pour votre contexte
          </p>
          
          {/* Demo Preview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-tech-600/20 rounded-lg p-4 text-center">
                <Wifi size={24} className="mx-auto mb-2 text-tech-300" />
                <div className="text-sm">IoT Sensors</div>
              </div>
              <div className="bg-primary-600/20 rounded-lg p-4 text-center">
                <Brain size={24} className="mx-auto mb-2 text-primary-300" />
                <div className="text-sm">AI Engine</div>
              </div>
              <div className="bg-purple-600/20 rounded-lg p-4 text-center">
                <Shield size={24} className="mx-auto mb-2 text-purple-300" />
                <div className="text-sm">Blockchain</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-300 mb-2">
                -35% coûts | +60% efficacité | 100% traçable
              </div>
              <div className="text-white/70">Résultats moyens après 3 mois d'utilisation</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200"
          >
            Demander une démo personnalisée
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;
