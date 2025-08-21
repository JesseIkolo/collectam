'use client';

import { useEffect } from 'react';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  useEffect(() => {
    // Configuration WCAG pour les utilisateurs français/africains
    const setupAccessibility = () => {
      // Détection du mode de navigation clavier
      const handleKeyboardNavigation = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-navigation');
        }
      };

      const handleMouseNavigation = () => {
        document.body.classList.remove('keyboard-navigation');
      };

      // Support des raccourcis clavier français
      const handleKeyboardShortcuts = (e: KeyboardEvent) => {
        // Alt + M pour menu principal
        if (e.altKey && e.key === 'm') {
          e.preventDefault();
          const mainNav = document.querySelector('[role="navigation"]');
          if (mainNav) {
            (mainNav as HTMLElement).focus();
          }
        }
        
        // Alt + C pour contenu principal
        if (e.altKey && e.key === 'c') {
          e.preventDefault();
          const mainContent = document.querySelector('main, [role="main"]');
          if (mainContent) {
            (mainContent as HTMLElement).focus();
          }
        }
      };

      // Configuration des annonces pour lecteurs d'écran
      const announcePageChanges = () => {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.id = 'page-announcer';
        document.body.appendChild(announcer);
      };

      // Gestion du focus pour les modales
      const trapFocus = (element: HTMLElement) => {
        const focusableElements = element.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        };

        element.addEventListener('keydown', handleTabKey);
        return () => element.removeEventListener('keydown', handleTabKey);
      };

      // Configuration des préférences utilisateur
      const setupUserPreferences = () => {
        // Respect des préférences de mouvement réduit
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const updateMotionPreference = () => {
          if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--transition-duration', '0.01ms');
          }
        };

        updateMotionPreference();
        prefersReducedMotion.addEventListener('change', updateMotionPreference);

        // Support du mode sombre automatique
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
        
        const updateTheme = () => {
          if (prefersDarkMode.matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        };

        updateTheme();
        prefersDarkMode.addEventListener('change', updateTheme);
      };

      // Initialisation
      document.addEventListener('keydown', handleKeyboardNavigation);
      document.addEventListener('mousedown', handleMouseNavigation);
      document.addEventListener('keydown', handleKeyboardShortcuts);
      announcePageChanges();
      setupUserPreferences();

      // Nettoyage
      return () => {
        document.removeEventListener('keydown', handleKeyboardNavigation);
        document.removeEventListener('mousedown', handleMouseNavigation);
        document.removeEventListener('keydown', handleKeyboardShortcuts);
      };
    };

    const cleanup = setupAccessibility();
    return cleanup;
  }, []);

  return (
    <>
      {children}
      {/* Liens de navigation rapide pour lecteurs d'écran */}
      <div className="sr-only">
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        <a href="#main-navigation" className="skip-link">
          Aller à la navigation
        </a>
      </div>
    </>
  );
}

// Hook pour les annonces aux lecteurs d'écran
export function useScreenReaderAnnouncement() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.getElementById('page-announcer');
    if (announcer) {
      announcer.setAttribute('aria-live', priority);
      announcer.textContent = message;
      
      // Nettoyer après l'annonce
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  };

  return { announce };
}
