'use client';

import { useState, useEffect } from 'react';
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnimeNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: "Accueil", href: "#home" },
    { name: "Comment ça marche", href: "#solution" },
    { name: "Avantages", href: "#features" },
    { name: "Témoignages", href: "#testimonials" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className={`transition-all duration-500 ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg shadow-cyan-500/10' 
            : 'bg-transparent'
        }`}
        maxWidth="full"
        height="4rem"
      >
        {/* Animated Background Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5"
          animate={{
            background: [
              "linear-gradient(90deg, rgba(6,182,212,0.05) 0%, rgba(168,85,247,0.05) 50%, rgba(236,72,153,0.05) 100%)",
              "linear-gradient(90deg, rgba(236,72,153,0.05) 0%, rgba(6,182,212,0.05) 50%, rgba(168,85,247,0.05) 100%)",
              "linear-gradient(90deg, rgba(168,85,247,0.05) 0%, rgba(236,72,153,0.05) 50%, rgba(6,182,212,0.05) 100%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden text-cyan-400 hover:text-cyan-300"
          />
          
          <NavbarBrand>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3"
            >
              {/* Animated Logo */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xl font-bold text-white"
                  >
                    ♻️
                  </motion.span>
                </div>
                {/* Glow Effect */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-cyan-400/30 rounded-lg blur-md -z-10"
                />
              </motion.div>
              
              <motion.span
                className="font-bold text-2xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                Collectam
              </motion.span>
            </motion.div>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-8" justify="center">
          {menuItems.map((item, index) => (
            <NavbarItem key={item.name}>
              <motion.a
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative text-white/80 hover:text-cyan-400 transition-colors duration-300 font-medium group"
              >
                {item.name}
                {/* Hover Underline Effect */}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Glow Effect on Hover */}
                <motion.div
                  className="absolute inset-0 bg-cyan-400/10 rounded-lg blur-sm -z-10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold px-6 py-2 rounded-lg relative overflow-hidden group"
                size="sm"
              >
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Commencer</span>
                
                {/* Particle Effect */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </motion.div>
              </Button>
            </motion.div>
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu className="bg-black/95 backdrop-blur-xl border-r border-cyan-500/20">
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col space-y-6 pt-6"
              >
                {menuItems.map((item, index) => (
                  <NavbarMenuItem key={item.name}>
                    <motion.a
                      href={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ x: 10, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-white/80 hover:text-cyan-400 transition-all duration-300 font-medium text-lg relative group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <motion.div
                        className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      {item.name}
                    </motion.a>
                  </NavbarMenuItem>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </NavbarMenu>

        {/* Animated Border */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
          animate={{
            background: [
              "linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.5) 50%, transparent 100%)",
              "linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.5) 50%, transparent 100%)",
              "linear-gradient(90deg, transparent 0%, rgba(236,72,153,0.5) 50%, transparent 100%)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </Navbar>
    </motion.div>
  );
}
