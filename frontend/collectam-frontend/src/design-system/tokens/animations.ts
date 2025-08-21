// Système d'animations uniforme Collectam
export const animations = {
  // Durées standardisées
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  // Delays standardisés pour animations séquentielles
  delay: {
    none: '0ms',
    xs: '50ms',   // index * 0.05
    sm: '100ms',  // index * 0.1
    md: '150ms',  // index * 0.15
    lg: '200ms',  // index * 0.2
  },
  
  // Easings
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Animations prédéfinies
  presets: {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    
    slideUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    
    slideInLeft: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    
    slideInRight: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    
    bounce: {
      animate: { y: [0, -10, 0] },
      transition: { 
        duration: 2, 
        repeat: Infinity, 
        ease: 'easeInOut' 
      },
    },
    
    pulse: {
      animate: { scale: [1, 1.05, 1] },
      transition: { 
        duration: 2, 
        repeat: Infinity, 
        ease: 'easeInOut' 
      },
    },
    
    rotate: {
      animate: { rotate: 360 },
      transition: { 
        duration: 10, 
        repeat: Infinity, 
        ease: 'linear' 
      },
    },
  },
  
  // Animations pour listes/grids
  stagger: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },
    
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  },
  
  // Animations de page
  page: {
    enter: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  },
  
  // Classes CSS pour animations simples
  css: {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    scaleIn: 'animate-scale-in',
    bounceGentle: 'animate-bounce-gentle',
    spin: 'animate-spin',
    pulse: 'animate-pulse',
  },
} as const;

// Utilitaires pour créer des animations avec delay
export const createStaggeredAnimation = (
  baseAnimation: typeof animations.presets.fadeIn,
  index: number,
  delayMultiplier: number = 0.1
) => ({
  ...baseAnimation,
  transition: {
    ...baseAnimation.transition,
    delay: index * delayMultiplier,
  },
});

// Utilitaire pour animations conditionnelles (respect prefers-reduced-motion)
export const getAnimationProps = (animationPreset: any, respectMotionPreference: boolean = true) => {
  if (respectMotionPreference && typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return {
        initial: animationPreset.animate,
        animate: animationPreset.animate,
        transition: { duration: 0.01 },
      };
    }
  }
  return animationPreset;
};
