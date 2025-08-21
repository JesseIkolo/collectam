import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Gift, Users, Zap } from 'lucide-react';

const UrgencySection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set target date to 30 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const offers = [
    {
      icon: Gift,
      title: "Offre de lancement exclusive",
      description: "-30% sur votre abonnement la première année",
      value: "Économisez jusqu'à €19,800",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: Zap,
      title: "Installation IoT gratuite",
      description: "Capteurs et équipements installés sans frais",
      value: "Valeur €15,000 offerte",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: Users,
      title: "Formation premium incluse",
      description: "Formation sur site pour toute votre équipe",
      value: "Valeur €5,000 offerte",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-6">
            <Clock size={20} />
            <span className="font-medium">Offre limitée</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Dernière chance : 
            <span className="text-red-600"> Offre de lancement</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pour célébrer notre expansion en Afrique de l'Ouest, nous offrons des conditions 
            exceptionnelles aux 3 premières villes qui nous rejoignent
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-2xl mb-16 max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Cette offre expire dans :
          </h3>
          
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            {[
              { value: timeLeft.days, label: 'Jours' },
              { value: timeLeft.hours, label: 'Heures' },
              { value: timeLeft.minutes, label: 'Minutes' },
              { value: timeLeft.seconds, label: 'Secondes' }
            ].map((item, index) => (
              <motion.div
                key={index}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white rounded-lg p-4 md:p-6 mb-2">
                  <div className="text-2xl md:text-4xl font-bold">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="text-gray-600 font-medium">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Exclusive Offers */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {offers.map((offer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`${offer.bgColor} rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                <offer.icon size={24} className={offer.color} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {offer.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {offer.description}
              </p>
              <div className={`${offer.color} font-bold text-lg`}>
                {offer.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scarcity Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white text-center mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Places limitées : Seulement 3 villes sélectionnées
          </h3>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Places prises</span>
              <span>2/3</span>
            </div>
            <div className="bg-gray-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '66%' }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.5 }}
                className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full"
              />
            </div>
          </div>
          
          <p className="text-lg mb-8 opacity-90">
            Nous ne pouvons accompagner que 3 villes simultanément pour garantir 
            un service d'excellence. <strong>Il ne reste qu'une place.</strong>
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400 mb-1">✓ Dakar</div>
              <div className="text-sm opacity-80">Déployement en cours</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400 mb-1">✓ Abidjan</div>
              <div className="text-sm opacity-80">Installation terminée</div>
            </div>
          </div>
        </motion.div>

        {/* Bonus Exclusif */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-r from-primary-600 to-tech-600 rounded-2xl p-8 text-white text-center"
        >
          <Gift size={48} className="mx-auto mb-6 opacity-90" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Bonus exclusif pour les pionniers
          </h3>
          <p className="text-lg mb-6 opacity-90">
            En tant que ville pionnière, vous bénéficierez d'un accès privilégié 
            à toutes nos futures innovations pendant 2 ans
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="font-bold">Nouvelles fonctionnalités</div>
              <div className="text-sm opacity-80">En avant-première</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="font-bold">Support prioritaire</div>
              <div className="text-sm opacity-80">Réponse < 1h</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="font-bold">Tarifs gelés</div>
              <div className="text-sm opacity-80">Pendant 24 mois</div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xl px-12 py-4 rounded-lg shadow-2xl"
          >
            Réserver ma place maintenant
          </motion.button>
          <p className="text-gray-600 mt-4">
            ⚡ Réponse sous 24h • Sans engagement • Démo personnalisée incluse
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default UrgencySection;
