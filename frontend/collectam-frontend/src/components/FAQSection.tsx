'use client';

import { Accordion, AccordionItem } from '@heroui/react';
import { motion } from 'framer-motion';

export default function FAQSection() {
  const faqs = [
    {
      question: "Comment Collectam s'adapte-t-il au contexte africain ?",
      answer: "Collectam a été spécialement conçu pour les défis africains : infrastructures variables, budgets contraints, et besoins de scalabilité rapide. Notre solution fonctionne avec une connectivité limitée et s'adapte aux spécificités locales."
    },
    {
      question: "La solution est-elle rentable face aux coûts d'implémentation ?",
      answer: "Absolument. Nos clients observent un retour sur investissement en moyenne sous 8 mois grâce aux économies de carburant (-30%), l'optimisation des itinéraires, et la réduction des coûts opérationnels. De plus, notre modèle de pricing flexible s'adapte à votre budget."
    },
    {
      question: "Comment garantissez-vous la sécurité des données blockchain ?",
      answer: "Nous utilisons une blockchain privée avec chiffrement de bout en bout. Toutes les transactions sont vérifiées par consensus et les données sensibles sont anonymisées. Nos serveurs respectent les standards de sécurité internationaux ISO 27001."
    },
    {
      question: "Quel est le délai de déploiement ?",
      answer: "Le déploiement complet prend 7 jours en moyenne : 2 jours pour l'installation IoT, 3 jours pour la configuration logicielle, et 2 jours de formation. Notre équipe technique vous accompagne à chaque étape."
    },
    {
      question: "Que se passe-t-il si nous ne sommes pas satisfaits ?",
      answer: "Nous offrons une garantie 'satisfait ou remboursé' de 3 mois. Si vous ne constatez aucune amélioration de vos opérations, nous vous remboursons intégralement et récupérons l'équipement sans frais."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Questions fréquentes
          </h2>
          <p className="text-xl text-gray-600">
            Toutes les réponses aux questions que vous vous posez sur Collectam
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Accordion variant="splitted" selectionMode="multiple">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                aria-label={faq.question}
                title={faq.question}
                className="mb-4"
              >
                <div className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
