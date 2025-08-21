import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Users, Award } from 'lucide-react';

const FounderSection = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion pour l'Afrique",
      description: "Né et élevé sur le continent, je comprends nos défis uniques"
    },
    {
      icon: Target,
      title: "Mission claire",
      description: "Transformer les déchets en opportunités économiques durables"
    },
    {
      icon: Users,
      title: "Impact communautaire",
      description: "Créer des emplois et améliorer la qualité de vie de millions d'Africains"
    }
  ];

  const achievements = [
    { number: "10+", label: "Années d'expérience" },
    { number: "5", label: "Villes transformées" },
    { number: "1000+", label: "Emplois créés" },
    { number: "€2M", label: "Économies générées" }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Story */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6">
                <Heart size={20} />
                <span className="font-medium">Notre histoire</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                De la frustration à la 
                <span className="text-primary-600"> révolution</span>
              </h2>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                <strong>2019, Dakar.</strong> En tant qu'ingénieur informatique, j'ai vu ma ville natale 
                suffoquer sous les déchets non collectés. Les camions passaient au hasard, 
                les coûts explosaient, et personne ne pouvait expliquer où allait l'argent.
              </p>
              
              <p>
                <strong>Le déclic :</strong> Ma grand-mère, commerçante au marché Sandaga, 
                me dit : "Pourquoi la technologie qui connecte le monde ne peut-elle pas 
                nettoyer notre quartier ?"
              </p>
              
              <p>
                <strong>3 ans de R&D plus tard,</strong> Collectam était né. Une solution 
                qui combine l'intelligence artificielle, l'IoT et la blockchain pour 
                transformer radicalement la gestion des déchets en Afrique.
              </p>
              
              <p className="text-primary-700 font-semibold">
                "Aujourd'hui, nous ne gérons plus seulement des déchets. 
                Nous créons de la valeur, des emplois et un avenir durable pour l'Afrique."
              </p>
            </div>

            {/* Values */}
            <div className="space-y-4">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-primary-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <value.icon size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{value.title}</h4>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Founder Photo Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-tech-100 rounded-2xl p-8 text-center">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary-200 to-tech-200 rounded-full flex items-center justify-center mb-6">
                  <div className="text-6xl">👨🏿‍💼</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Amadou Diallo
                </h3>
                <p className="text-primary-600 font-semibold mb-4">
                  Fondateur & CEO, Collectam
                </p>
                <p className="text-gray-600 italic">
                  "Ingénieur de formation, entrepreneur par passion, 
                  Africain par conviction"
                </p>
              </div>

              {/* Floating Achievement Badge */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-primary-200"
              >
                <Award size={24} className="text-primary-600 mb-1" />
                <div className="text-xs font-semibold text-gray-900">Prix Innovation</div>
                <div className="text-xs text-gray-600">Africa Tech 2023</div>
              </motion.div>
            </div>

            {/* Achievements Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 gap-4 mt-8"
            >
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-md text-center">
                  <div className="text-2xl font-bold text-primary-600 mb-1">
                    {achievement.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 to-tech-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Notre mission : Efficacité + Durabilité = Prospérité
            </h3>
            <p className="text-lg mb-8 opacity-90 max-w-3xl mx-auto">
              Nous croyons que l'Afrique peut devenir le leader mondial de la gestion 
              intelligente des déchets. Chaque ville que nous transformons nous rapproche 
              de cet objectif.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">2030</div>
                <div className="opacity-90">100 villes connectées</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">1M</div>
                <div className="opacity-90">Emplois créés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">50%</div>
                <div className="opacity-90">Réduction des déchets</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FounderSection;
