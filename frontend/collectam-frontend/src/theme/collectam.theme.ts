// Configuration du thème Collectam pour HeroUI
export const collectamConfig = {
  // Couleurs de marque Collectam optimisées
  colors: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Vert principal Collectam
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      DEFAULT: '#22c55e',
      foreground: '#ffffff',
    },
    secondary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Bleu secondaire
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      DEFAULT: '#3b82f6',
      foreground: '#ffffff',
    },
    // Couleurs sémantiques métier
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Succès écologique
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      DEFAULT: '#22c55e',
      foreground: '#ffffff',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Urgence déchets
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      DEFAULT: '#f59e0b',
      foreground: '#ffffff',
    },
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Erreurs critiques
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      DEFAULT: '#ef4444',
      foreground: '#ffffff',
    },
  },
  // Breakpoints optimisés mobile-first pour utilisateurs africains
  screens: {
    xs: '320px',  // Très petits mobiles
    sm: '640px',  // Mobiles standard
    md: '768px',  // Tablettes
    lg: '1024px', // Desktop petit
    xl: '1280px', // Desktop standard
    '2xl': '1536px', // Large desktop
  },
};

// Configuration des variants standardisés
export const collectamVariants = {
  button: {
    // Variants sans icônes comme demandé
    solid: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary-600',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-600',
      success: 'bg-success text-success-foreground hover:bg-success-600',
      warning: 'bg-warning text-warning-foreground hover:bg-warning-600',
      danger: 'bg-danger text-danger-foreground hover:bg-danger-600',
    },
    bordered: {
      primary: 'border-primary text-primary hover:bg-primary hover:text-primary-foreground',
      secondary: 'border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground',
    },
    ghost: {
      primary: 'text-primary hover:bg-primary-50',
      secondary: 'text-secondary hover:bg-secondary-50',
    },
  },
  card: {
    elevated: 'bg-content1 shadow-lg border border-content3',
    flat: 'bg-content2 border border-content3',
    bordered: 'bg-content1 border-2 border-primary',
  },
  chip: {
    ecological: 'bg-success-100 text-success-700 border-success-200',
    urgent: 'bg-warning-100 text-warning-700 border-warning-200',
    blockchain: 'bg-secondary-100 text-secondary-700 border-secondary-200',
  },
};
