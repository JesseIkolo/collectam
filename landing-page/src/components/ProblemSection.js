import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, DollarSign, Truck, BarChart3, Users, Zap } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: DollarSign,
      title: "Coûts explosifs",
      description: "20% du budget gaspillé en tournées inefficaces et carburant",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: BarChart3,
      title: "Manque de traçabilité",
      description: "Impossible de justifier l'impact RSE et les actions environnementales",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: Users,
      title: "Image dégradée",
      description: "Citoyens mécontents, réputation ternie, perte de confiance",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      icon: Truck,
      title: "Inefficacité opérationnelle",
      description: "Tournées non optimisées, équipes démotivées, temps perdu",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const costStats = [
    { value: "20%", label: "Budget gaspillé", sublabel: "en coûts évitables" },
    { value: "10T", label: "Déchets non valorisés", sublabel: "par mois et par ville" },
    { value: "40%", label: "Temps perdu", sublabel: "en tournées inefficaces" },
    { value: "€50K", label: "Manque à gagner", sublabel: "mensuel moyen" }
  ];

  return (
    <section className="section-padding bg-gray-50">
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
            <AlertTriangle size={20} />
            <span className="font-medium">Problème urgent</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            La gestion des déchets en Afrique : 
            <span className="text-red-600"> un gouffre financier</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chaque jour, les municipalités et entreprises africaines perdent des milliers d'euros 
            à cause d'une gestion inefficace des déchets
          </p>
        </motion.div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`${problem.bgColor} rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                <problem.icon size={24} className={problem.color} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {problem.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Cost of Inaction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 md:p-12 text-white mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Le coût de l'inaction
            </h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Sans optimisation, voici ce que vous perdez chaque mois
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {costStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold mb-1">
                  {stat.label}
                </div>
                <div className="text-sm opacity-80">
                  {stat.sublabel}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emotional Storytelling */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-lg"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                "Chaque camion mal optimisé, c'est plus de pollution et plus de coûts"
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>Imaginez :</strong> Vos camions parcourent la ville sans logique, 
                  consommant du carburant inutilement, pendant que certains quartiers 
                  débordent de déchets non collectés.
                </p>
                <p>
                  <strong>Résultat :</strong> Citoyens en colère, budget explosé, 
                  équipes démotivées, et une image de marque dégradée qui prendra 
                  des années à reconstruire.
                </p>
                <p>
                  <strong>La réalité :</strong> 80% des municipalités africaines 
                  perdent plus de €30,000 par mois à cause de ces inefficacités.
                </p>
              </div>
            </div>

            <div className="relative">
              {/* Illustration placeholder */}
              <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl p-8 h-80 flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <Truck size={80} className="text-red-400 mx-auto mb-4" />
                  <div className="text-lg font-semibold text-red-700 mb-2">
                    Tournées inefficaces
                  </div>
                  <div className="text-red-600">
                    +40% de coûts évitables
                  </div>
                </div>
                
                {/* Animated elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute top-4 right-4 text-red-300"
                >
                  <Zap size={24} />
                </motion.div>
                
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-4 left-4 text-orange-400"
                >
                  <DollarSign size={32} />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transition to Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-primary-50 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Et si nous vous disions qu'il existe une solution ?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Une solution qui transforme ces problèmes en opportunités, 
              ces coûts en économies, et cette inefficacité en avantage concurrentiel.
            </p>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-primary-600"
            >
              ↓ Découvrez comment ↓
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
