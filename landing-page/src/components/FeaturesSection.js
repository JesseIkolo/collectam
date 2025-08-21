import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Truck, Lock, Leaf, Clock, Users, Check, X } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Dashboard temps réel",
      description: "Visualisez toutes vos opérations en un coup d'œil",
      benefit: "Décisions rapides et éclairées",
      color: "text-tech-600",
      bgColor: "bg-tech-100"
    },
    {
      icon: Truck,
      title: "Itinéraires IA",
      description: "Optimisation automatique des tournées de collecte",
      benefit: "-30% de coûts carburant",
      color: "text-primary-600",
      bgColor: "bg-primary-100"
    },
    {
      icon: Lock,
      title: "Blockchain sécurisé",
      description: "Traçabilité immutable de chaque action",
      benefit: "Zéro fraude, 100% traçable",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Leaf,
      title: "Impact RSE positif",
      description: "Mesure et reporting automatique de l'impact environnemental",
      benefit: "Conformité et image renforcée",
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  const comparisonData = {
    categories: [
      "Optimisation des tournées",
      "Traçabilité blockchain",
      "IoT temps réel",
      "Dashboard analytics",
      "Support 24/7",
      "Formation incluse",
      "API intégration",
      "Conformité RSE"
    ],
    solutions: [
      {
        name: "Collectam",
        features: [true, true, true, true, true, true, true, true],
        highlight: true
      },
      {
        name: "Solutions traditionnelles",
        features: [false, false, false, true, false, false, false, false],
        highlight: false
      },
      {
        name: "Concurrents internationaux",
        features: [true, false, false, true, true, false, true, false],
        highlight: false
      }
    ]
  };

  return (
    <section id="features" className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Des fonctionnalités qui 
            <span className="text-primary-600"> transforment votre business</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chaque fonctionnalité Collectam est conçue pour résoudre un problème concret 
            et générer un ROI mesurable dès le premier mois
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`${feature.bgColor} rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={24} className={feature.color} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>
              <div className={`${feature.color} font-semibold text-sm`}>
                ✓ {feature.benefit}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-20"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Impact mesurable sur votre activité
          </h3>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <BarChart3 size={16} className="text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Dashboard temps réel</h4>
                  <p className="text-gray-600">Prenez des décisions éclairées avec une visibilité complète sur vos opérations. Réduisez le temps de réaction de 80%.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <Truck size={16} className="text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Itinéraires IA optimisés</h4>
                  <p className="text-gray-600">Économisez jusqu'à 30% sur les coûts de carburant grâce à l'optimisation intelligente des tournées.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <Lock size={16} className="text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Traçabilité blockchain</h4>
                  <p className="text-gray-600">Éliminez la fraude et prouvez votre impact RSE avec une traçabilité immutable à 100%.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-50 to-tech-50 rounded-xl p-6">
              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">ROI moyen après 6 mois</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">-35%</div>
                  <div className="text-sm text-gray-600">Coûts opérationnels</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-tech-600">+60%</div>
                  <div className="text-sm text-gray-600">Efficacité</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-600">Traçabilité</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">€50K+</div>
                  <div className="text-sm text-gray-600">Économies/mois</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-lg overflow-hidden"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
            Pourquoi choisir Collectam ?
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Fonctionnalités</th>
                  {comparisonData.solutions.map((solution, index) => (
                    <th key={index} className={`text-center py-4 px-4 font-semibold ${solution.highlight ? 'text-primary-600' : 'text-gray-600'}`}>
                      {solution.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonData.categories.map((category, categoryIndex) => (
                  <motion.tr
                    key={categoryIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * categoryIndex }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">{category}</td>
                    {comparisonData.solutions.map((solution, solutionIndex) => (
                      <td key={solutionIndex} className="py-4 px-4 text-center">
                        {solution.features[categoryIndex] ? (
                          <Check size={20} className={solution.highlight ? 'text-primary-600' : 'text-green-600'} />
                        ) : (
                          <X size={20} className="text-red-400" />
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4"
            >
              Voir toutes les fonctionnalités
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
