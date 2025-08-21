import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Collectam est-il vraiment adapté au contexte africain ?",
      answer: "Absolument. Collectam a été conçu spécifiquement pour l'Afrique par des Africains. Nous comprenons les défis uniques du continent : infrastructures variables, contraintes budgétaires, diversité des contextes urbains. Notre solution fonctionne même avec une connectivité internet limitée grâce à notre architecture hybride cloud/local. Plus de 50 collecteurs dans 5 villes africaines utilisent déjà notre plateforme avec succès."
    },
    {
      question: "Le ROI justifie-t-il vraiment l'investissement ?",
      answer: "Les chiffres parlent d'eux-mêmes : nos clients économisent en moyenne 35% sur leurs coûts opérationnels dès les 6 premiers mois. Pour une ville moyenne, cela représente €50,000+ d'économies mensuelles. L'investissement initial est récupéré en moins de 8 mois. De plus, notre modèle de tarification inclut des frais par collecte réussie - vous ne payez que pour les résultats obtenus."
    },
    {
      question: "La sécurité blockchain est-elle vraiment nécessaire ?",
      answer: "La blockchain n'est pas un gadget technologique chez Collectam, c'est une nécessité. Elle garantit une traçabilité immutable de chaque action, élimine la fraude (problème majeur dans le secteur), et fournit des preuves irréfutables pour vos rapports RSE. Nos clients utilisent ces données pour obtenir des certifications environnementales et des financements verts. La transparence blockchain renforce aussi la confiance des citoyens."
    },
    {
      question: "Combien de temps faut-il pour déployer la solution ?",
      answer: "Notre promesse : déploiement complet en 7 jours ouvrés maximum. Jour 1-2 : Installation des capteurs IoT. Jour 3-4 : Configuration de la plateforme et intégration de vos données. Jour 5-6 : Formation de vos équipes. Jour 7 : Mise en production avec accompagnement dédié. Notre équipe technique se déplace sur site pour garantir un démarrage sans accroc."
    },
    {
      question: "Que se passe-t-il si nous ne sommes pas satisfaits ?",
      answer: "Nous offrons une garantie satisfait ou remboursé de 90 jours. Si vous ne constatez pas d'amélioration mesurable de vos opérations (réduction des coûts, amélioration de l'efficacité, meilleure traçabilité), nous vous remboursons intégralement. De plus, notre support 24/7 et notre accompagnement personnalisé garantissent votre succès dès le premier jour."
    },
    {
      question: "Pouvez-vous vous intégrer à nos systèmes existants ?",
      answer: "Oui, Collectam dispose d'APIs robustes et de connecteurs pré-configurés pour les principaux systèmes de gestion municipale et ERP. Nous nous intégrons facilement avec SAP, Oracle, systèmes de comptabilité locaux, et plateformes de reporting existantes. Notre équipe technique gère l'intégration complète sans interruption de vos opérations actuelles."
    },
    {
      question: "Comment gérez-vous la formation de nos équipes ?",
      answer: "Formation complète incluse dans tous nos packages. Formation initiale de 2 jours sur site pour vos équipes techniques et opérationnelles. Documentation complète en français. Plateforme e-learning accessible 24/7. Certification utilisateurs avec badges numériques. Support continu pendant les 3 premiers mois. Taux de satisfaction formation : 98%."
    },
    {
      question: "Que faire en cas de panne ou de problème technique ?",
      answer: "Support technique 24/7/365 avec engagement de réponse sous 1 heure pour les urgences. Équipe technique locale dans chaque région d'intervention. Système de monitoring proactif qui détecte et résout 80% des problèmes avant qu'ils n'impactent vos opérations. Sauvegarde automatique et redondance des données. SLA de 99.9% de disponibilité garanti."
    }
  ];

  return (
    <section id="faq" className="section-padding bg-white">
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
            <HelpCircle size={20} />
            <span className="font-medium">Questions fréquentes</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Vos questions, 
            <span className="text-primary-600"> nos réponses</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous avons anticipé vos préoccupations. Voici les réponses aux questions 
            les plus fréquentes de nos clients africains.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="mb-4"
            >
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    {openIndex === index ? (
                      <Minus size={24} className="text-primary-600" />
                    ) : (
                      <Plus size={24} className="text-gray-400" />
                    )}
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-50 to-tech-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Vous avez d'autres questions ?
            </h3>
            <p className="text-gray-600 mb-6">
              Notre équipe d'experts est disponible pour répondre à toutes vos questions 
              spécifiques et vous accompagner dans votre projet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Parler à un expert
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
              >
                Télécharger la brochure
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Support technique</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-2">7 jours</div>
              <div className="text-gray-600">Déploiement garanti</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-2">90 jours</div>
              <div className="text-gray-600">Garantie remboursement</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
