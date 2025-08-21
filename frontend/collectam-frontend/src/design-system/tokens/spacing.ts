// Système d'espacement Collectam basé sur 8px
export const spacing = {
  // Espacements de base (multiples de 8px)
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
  '4xl': '6rem',  // 96px
  
  // Espacements spécialisés pour composants
  card: {
    padding: {
      sm: '1rem',    // 16px - Cards compactes
      md: '1.5rem',  // 24px - Cards standard
      lg: '2rem',    // 32px - Cards importantes
    },
    gap: '1rem',     // 16px - Espacement entre cards
  },
  
  section: {
    padding: {
      mobile: '1rem',   // 16px - Mobile
      desktop: '1.5rem', // 24px - Desktop
    },
    margin: {
      sm: '3rem',   // 48px - Sections compactes
      md: '5rem',   // 80px - Sections standard
      lg: '8rem',   // 128px - Sections importantes
    },
  },
  
  component: {
    button: {
      padding: {
        sm: '0.5rem 1rem',     // 8px 16px
        md: '0.75rem 1.5rem',  // 12px 24px
        lg: '1rem 2rem',       // 16px 32px
      },
    },
    input: {
      padding: '0.75rem 1rem', // 12px 16px
    },
  },
} as const;

// Classes Tailwind correspondantes
export const spacingClasses = {
  padding: {
    xs: 'p-2',    // 8px
    sm: 'p-3',    // 12px
    md: 'p-4',    // 16px
    lg: 'p-6',    // 24px
    xl: 'p-8',    // 32px
    '2xl': 'p-12', // 48px
  },
  margin: {
    xs: 'm-2',    // 8px
    sm: 'm-3',    // 12px
    md: 'm-4',    // 16px
    lg: 'm-6',    // 24px
    xl: 'm-8',    // 32px
    '2xl': 'm-12', // 48px
  },
  gap: {
    xs: 'gap-2',  // 8px
    sm: 'gap-3',  // 12px
    md: 'gap-4',  // 16px
    lg: 'gap-6',  // 24px
    xl: 'gap-8',  // 32px
  },
} as const;
