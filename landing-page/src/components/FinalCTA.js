import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Phone, Mail, MapPin, Clock, Shield, Users } from 'lucide-react';

const FinalCTA = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Appelez-nous",
      value: "+221 77 123 45 67",
      description: "Réponse immédiate 9h-18h WAT"
    },
    {
      icon: Mail,
      title: "Écrivez-nous",
      value: "demo@collectam.africa",
      description: "Réponse sous 2h garantie"
    },
    {
      icon: MapPin,
      title: "Rencontrons-nous",
      value: "Dakar, Abidjan, Lagos",
      description: "Déplacement gratuit sur site"
    }
  ];

  const guarantees = [
    {
      icon: Clock,
      title: "Réponse sous 24h",
      description: "Engagement ferme"
    },
    {
      icon: Shield,
      title: "Sans engagement",
      description: "Démo gratuite"
    },
    {
      icon: Users,
      title: "Accompagnement dédié",
      description: "Expert assigné"
    }
  ];

  return (
    <>
      {/* Final CTA Section */}
      <section className="section-padding bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-tech-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ne laissez plus vos déchets 
                <span className="text-primary-400"> coûter cher</span> à votre ville ou entreprise
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Chaque jour d'attente, c'est des milliers d'euros perdus et des opportunités manquées. 
                Rejoignez les villes pionnières qui transforment déjà leurs déchets en valeur.
              </p>
            </motion.div>
          </div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary-600 to-tech-600 hover:from-primary-700 hover:to-tech-700 text-white font-bold text-xl md:text-2xl px-12 py-6 rounded-xl shadow-2xl inline-flex items-center space-x-3 mb-6"
            >
              <Rocket size={28} />
              <span>Demander une démo maintenant</span>
            </motion.button>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
              {guarantees.map((guarantee, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + 0.1 * index }}
                  className="flex items-center space-x-2"
                >
                  <guarantee.icon size={16} className="text-primary-400" />
                  <span>{guarantee.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {contactMethods.map((method, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <method.icon size={24} className="text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                <div className="text-primary-400 font-bold text-lg mb-1">{method.value}</div>
                <p className="text-gray-400 text-sm">{method.description}</p>
              </div>
            ))}
          </motion.div>

          {/* Final Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-6">
              Pourquoi attendre ? L'avenir de la gestion des déchets commence aujourd'hui.
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary-400 mb-2">-35%</div>
                <div className="text-gray-300">Réduction des coûts garantie</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-tech-400 mb-2">7 jours</div>
                <div className="text-gray-300">Déploiement complet</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
                <div className="text-gray-300">Traçabilité blockchain</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold">Collectam</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                La première plateforme IA + IoT + Blockchain qui transforme la gestion 
                des déchets en Afrique. Efficacité, durabilité, prospérité.
              </p>
              <div className="text-sm text-gray-500">
                © 2024 Collectam. Tous droits réservés.
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#solution" className="hover:text-primary-400 transition-colors">Solution</a></li>
                <li><a href="#features" className="hover:text-primary-400 transition-colors">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-primary-400 transition-colors">Tarifs</a></li>
                <li><a href="#faq" className="hover:text-primary-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+221 77 123 45 67</li>
                <li>demo@collectam.africa</li>
                <li>Dakar, Sénégal</li>
                <li>Abidjan, Côte d'Ivoire</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>Collectam - Transformons l'Afrique, un déchet à la fois. 🌍</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FinalCTA;
