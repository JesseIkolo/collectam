'use client';

import { Button, Link } from '@heroui/react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ne laissez plus vos déchets coûter cher à votre ville ou entreprise
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Rejoignez les municipalités et entreprises qui ont déjà transformé 
            leur gestion des déchets avec Collectam
          </p>
          <Button
            size="lg"
            color="primary"
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold px-12 py-4 text-lg"
            startContent="🚀"
          >
            Demander une démo maintenant
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Collectam</h3>
            <p className="text-gray-300 mb-4">
              Révolutionner la gestion des déchets en Afrique avec l'IA, l'IoT et la Blockchain.
            </p>
            <div className="space-y-2">
              <p className="text-gray-300">📧 contact@collectam.com</p>
              <p className="text-gray-300">📞 +33 1 23 45 67 89</p>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="#" className="hover:text-white">Municipalités</Link></li>
              <li><Link href="#" className="hover:text-white">Entreprises</Link></li>
              <li><Link href="#" className="hover:text-white">Collecteurs</Link></li>
              <li><Link href="#" className="hover:text-white">API Développeurs</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Ressources</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="#" className="hover:text-white">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white">Études de cas</Link></li>
              <li><Link href="#" className="hover:text-white">Blog</Link></li>
              <li><Link href="#" className="hover:text-white">Support</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="#" className="hover:text-white">Politique de confidentialité</Link></li>
              <li><Link href="#" className="hover:text-white">Conditions d'utilisation</Link></li>
              <li><Link href="#" className="hover:text-white">Mentions légales</Link></li>
              <li><Link href="#" className="hover:text-white">RGPD</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link href="#" className="text-gray-300 hover:text-white text-2xl">📘</Link>
              <Link href="#" className="text-gray-300 hover:text-white text-2xl">🐦</Link>
              <Link href="#" className="text-gray-300 hover:text-white text-2xl">💼</Link>
              <Link href="#" className="text-gray-300 hover:text-white text-2xl">📺</Link>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 Collectam. Tous droits réservés. Fait avec ❤️ pour l'Afrique.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
