// Support Dark Mode pour le Design System Collectam
export const darkModeTokens = {
  // Couleurs adaptées pour le mode sombre
  colors: {
    background: {
      light: '#ffffff',
      dark: '#0a0a0a',
    },
    foreground: {
      light: '#171717',
      dark: '#ededed',
    },
    content: {
      light: {
        1: '#ffffff',
        2: '#f4f4f5',
        3: '#e4e4e7',
        4: '#d4d4d8',
      },
      dark: {
        1: '#18181b',
        2: '#27272a',
        3: '#3f3f46',
        4: '#52525b',
      },
    },
    // Couleurs primaires adaptées
    primary: {
      light: '#22c55e',
      dark: '#4ade80', // Plus clair en mode sombre
    },
    secondary: {
      light: '#3b82f6',
      dark: '#60a5fa',
    },
  },
  
  // Classes CSS pour le mode sombre
  classes: {
    background: 'bg-white dark:bg-gray-900',
    foreground: 'text-gray-900 dark:text-gray-100',
    card: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    cardHover: 'hover:bg-gray-50 dark:hover:bg-gray-750',
    text: {
      primary: 'text-gray-900 dark:text-gray-100',
      secondary: 'text-gray-700 dark:text-gray-300',
      muted: 'text-gray-600 dark:text-gray-400',
    },
    border: 'border-gray-200 dark:border-gray-700',
    input: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
  },
} as const;

// Utilitaire pour obtenir les classes dark mode
export const getDarkModeClasses = (component: 'card' | 'text' | 'background' | 'border' | 'input') => {
  return darkModeTokens.classes[component];
};

// Configuration Tailwind pour le dark mode
export const darkModeConfig = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#374151', // Couleur intermédiaire pour hover
        },
      },
    },
  },
};
