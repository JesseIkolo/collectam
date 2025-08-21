import React from 'react';
import { motion } from 'framer-motion';
import { Star, Play, TrendingUp, Users, MapPin } from 'lucide-react';

const SocialProof = () => {
  const logos = [
    { name: "Ville de Dakar", placeholder: "DAKAR" },
    { name: "Abidjan Métropole", placeholder: "ABIDJAN" },
    { name: "Lagos State", placeholder: "LAGOS" },
    { name: "Casablanca", placeholder: "CASA" },
    { name: "Nairobi City", placeholder: "NAIROBI" }
  ];

  const testimonials = [
    {
      name: "Marie Diallo",
      role: "Directrice Environnement, Ville de Dakar",
      content: "Avec Collectam, nous avons réduit nos coûts de collecte de 35% en seulement 4 mois. La traçabilité blockchain nous permet enfin de justifier nos actions RSE.",
      rating: 5,
      image: "👩🏾‍💼"
    },
    {
      name: "Kwame Asante",
      role: "CEO, EcoWaste Ghana",
      content: "L'optimisation IA des tournées a transformé notre business. +40% de revenus avec moins de carburant. Collectam comprend vraiment le marché africain.",
      rating: 5,
      image: "👨🏿‍💼"
    },
    {
      name: "Fatima El-Mansouri",
      role: "Responsable RSE, Groupe OCP",
      content: "La solution IoT + Blockchain nous donne une visibilité totale sur notre impact environnemental. Nos stakeholders sont impressionnés par la transparence.",
      rating: 5,
      image: "👩🏽‍💼"
    }
  ];

  const stats = [
    { number: "50+", label: "Collecteurs connectés", icon: Users },
    { number: "30%", label: "Réduction des coûts", icon: TrendingDown },
    { number: "10T", label: "Déchets valorisés/mois", icon: TrendingUp },
    { number: "5", label: "Villes partenaires", icon: MapPin }
  ];

  return (
    <section id="testimonials" className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ils nous font déjà confiance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment Collectam transforme la gestion des déchets pour les municipalités et entreprises africaines
          </p>
        </motion.div>

        {/* Partner Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <p className="text-center text-gray-500 mb-8 font-medium">
            Partenaires officiels dans 5 grandes métropoles africaines
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {logos.map((logo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.1 }}
                className="bg-gray-100 rounded-lg px-6 py-4 min-w-[120px] text-center"
              >
                <div className="text-2xl font-bold text-gray-400 mb-1">
                  {logo.placeholder}
                </div>
                <div className="text-xs text-gray-500">{logo.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-16"
        >
          <div className="bg-gradient-to-r from-primary-50 to-tech-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
              Déjà 50+ collecteurs connectés en temps réel
            </h3>
            <p className="text-gray-600 text-lg">
              Et une croissance de +200% chaque trimestre
            </p>
          </div>
        </motion.div>

        {/* Video Testimonial Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden max-w-4xl mx-auto">
            <div className="aspect-video flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-sm rounded-full p-6 border border-white/30"
              >
                <Play size={48} className="text-white ml-1" />
              </motion.button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h4 className="text-white text-xl font-semibold mb-2">
                "Comment Collectam a révolutionné notre gestion des déchets"
              </h4>
              <p className="text-white/80">
                Témoignage exclusif du Maire de Dakar - 3 min
              </p>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="text-3xl mr-3">{testimonial.image}</div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Case Study Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gradient-to-r from-primary-600 to-tech-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Étude de cas : Réduction de 30% des coûts en 6 mois
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Découvrez comment la Ville de Dakar a transformé sa gestion des déchets avec Collectam
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Télécharger l'étude complète
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="text-center"
            >
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <stat.icon size={24} className="text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
