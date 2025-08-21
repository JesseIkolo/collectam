import React from 'react';
import { motion } from 'framer-motion';
import { Package, Headphones, GraduationCap, Shield, Check, Star } from 'lucide-react';

const ValueSection = () => {
  const valueStack = [
    {
      icon: Package,
      title: "Plateforme SaaS complète",
      description: "Dashboard, analytics, reporting automatisé",
      value: "€15,000"
    },
    {
      icon: Package,
      title: "Optimisation IA + IoT",
      description: "Algorithmes propriétaires et capteurs intelligents",
      value: "€25,000"
    },
    {
      icon: Shield,
      title: "Infrastructure Blockchain",
      description: "Traçabilité immutable et sécurité maximale",
      value: "€20,000"
    },
    {
      icon: GraduationCap,
      title: "Formation complète",
      description: "Formation équipes + certification utilisateurs",
      value: "€5,000"
    },
    {
      icon: Headphones,
      title: "Support premium 24/7",
      description: "Assistance technique et accompagnement dédié",
      value: "€8,000"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      subtitle: "Parfait pour débuter",
      price: "€2,500",
      period: "/mois",
      description: "Idéal pour les petites municipalités et entreprises",
      features: [
        "Jusqu'à 50 points de collecte",
        "Dashboard temps réel",
        "Optimisation IA basique",
        "Support email",
        "Formation initiale incluse"
      ],
      popular: false,
      cta: "Commencer l'essai"
    },
    {
      name: "Professional",
      subtitle: "Le plus populaire",
      price: "€5,500",
      period: "/mois",
      description: "Solution complète pour les villes moyennes",
      features: [
        "Jusqu'à 200 points de collecte",
        "IA avancée + IoT complet",
        "Blockchain intégrée",
        "Support 24/7",
        "Formation avancée",
        "API personnalisée",
        "Reporting RSE automatique"
      ],
      popular: true,
      cta: "Démo personnalisée"
    },
    {
      name: "Enterprise",
      subtitle: "Pour les grandes métropoles",
      price: "Sur mesure",
      period: "",
      description: "Solution sur-mesure pour les grandes infrastructures",
      features: [
        "Points de collecte illimités",
        "IA propriétaire personnalisée",
        "Blockchain privée",
        "Support dédié premium",
        "Formation sur site",
        "Intégrations sur mesure",
        "SLA garantis"
      ],
      popular: false,
      cta: "Nous contacter"
    }
  ];

  const totalValue = valueStack.reduce((sum, item) => sum + parseInt(item.value.replace('€', '').replace(',', '')), 0);

  return (
    <section id="pricing" className="section-padding bg-gray-50">
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
            Une offre complète qui 
            <span className="text-primary-600"> dépasse vos attentes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Collectam n'est pas qu'un logiciel. C'est un écosystème complet 
            qui transforme votre gestion des déchets de A à Z.
          </p>
        </motion.div>

        {/* Value Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
            Valeur totale de votre package Collectam
          </h3>
          
          <div className="space-y-6 mb-8">
            {valueStack.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center">
                    <item.icon size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
                <div className="text-xl font-bold text-primary-600">
                  {item.value}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between text-2xl font-bold">
              <span className="text-gray-900">Valeur totale :</span>
              <span className="text-primary-600">€{totalValue.toLocaleString()}</span>
            </div>
            <p className="text-center text-gray-600 mt-4">
              Soit plus de €6,000 de valeur par mois sur 12 mois
            </p>
          </div>
        </motion.div>

        {/* Pricing Plans */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`relative bg-white rounded-2xl p-8 shadow-lg ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star size={16} />
                    <span>Le plus populaire</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-primary-600 font-medium mb-4">{plan.subtitle}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                  plan.popular
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-green-600 to-primary-600 rounded-2xl p-8 text-white text-center"
        >
          <div className="max-w-3xl mx-auto">
            <Shield size={48} className="mx-auto mb-6 opacity-90" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Garantie satisfait ou remboursé
            </h3>
            <p className="text-lg mb-6 opacity-90">
              "Annulez si aucun gain sous 3 mois"
            </p>
            <p className="opacity-80">
              Nous sommes si confiants dans les résultats de Collectam que nous vous 
              offrons une garantie complète. Si vous ne constatez pas d'amélioration 
              mesurable de vos opérations dans les 90 premiers jours, nous vous 
              remboursons intégralement.
            </p>
          </div>
        </motion.div>

        {/* Payment Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              Modèle de tarification transparent
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Package size={24} className="text-primary-600" />
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Abonnement mensuel</h5>
                <p className="text-gray-600 text-sm">Accès complet à la plateforme</p>
              </div>
              <div className="text-center">
                <div className="bg-tech-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Check size={24} className="text-tech-600" />
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Frais par collecte réussie</h5>
                <p className="text-gray-600 text-sm">Vous ne payez que pour les résultats</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValueSection;
