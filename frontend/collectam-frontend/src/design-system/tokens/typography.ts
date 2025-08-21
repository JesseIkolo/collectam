// Hiérarchie typographique Collectam
export const typography = {
  // Tailles standardisées
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px - H4
    '3xl': '1.875rem', // 30px - H3
    '4xl': '2.25rem', // 36px - H2
    '5xl': '3rem',    // 48px - H1
    '6xl': '3.75rem', // 60px - Hero
    '7xl': '4.5rem',  // 72px - Display
  },
  
  // Hiérarchie des titres
  headings: {
    h1: {
      size: 'text-5xl',
      weight: 'font-bold',
      lineHeight: 'leading-tight',
      color: 'text-gray-900',
    },
    h2: {
      size: 'text-4xl',
      weight: 'font-bold',
      lineHeight: 'leading-tight',
      color: 'text-gray-900',
    },
    h3: {
      size: 'text-3xl',
      weight: 'font-semibold',
      lineHeight: 'leading-snug',
      color: 'text-gray-900',
    },
    h4: {
      size: 'text-2xl',
      weight: 'font-semibold',
      lineHeight: 'leading-snug',
      color: 'text-gray-900',
    },
    h5: {
      size: 'text-xl',
      weight: 'font-medium',
      lineHeight: 'leading-normal',
      color: 'text-gray-800',
    },
    h6: {
      size: 'text-lg',
      weight: 'font-medium',
      lineHeight: 'leading-normal',
      color: 'text-gray-800',
    },
  },
  
  // Texte de contenu
  body: {
    large: {
      size: 'text-xl',
      weight: 'font-normal',
      lineHeight: 'leading-relaxed',
      color: 'text-gray-700',
    },
    default: {
      size: 'text-base',
      weight: 'font-normal',
      lineHeight: 'leading-normal',
      color: 'text-gray-700',
    },
    small: {
      size: 'text-sm',
      weight: 'font-normal',
      lineHeight: 'leading-normal',
      color: 'text-gray-600',
    },
  },
  
  // Texte spécialisé
  caption: {
    size: 'text-xs',
    weight: 'font-medium',
    lineHeight: 'leading-tight',
    color: 'text-gray-500',
  },
  
  // Responsive
  responsive: {
    hero: 'text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl',
    title: 'text-2xl xs:text-3xl sm:text-4xl lg:text-5xl',
    subtitle: 'text-lg xs:text-xl sm:text-2xl',
    body: 'text-base xs:text-lg',
  },
} as const;

// Utilitaires pour composants
export const getHeadingClasses = (level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') => {
  const heading = typography.headings[level];
  return `${heading.size} ${heading.weight} ${heading.lineHeight} ${heading.color}`;
};

export const getBodyClasses = (variant: 'large' | 'default' | 'small' = 'default') => {
  const body = typography.body[variant];
  return `${body.size} ${body.weight} ${body.lineHeight} ${body.color}`;
};
