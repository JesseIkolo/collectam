// Système d'élévations Collectam (elevation-1 à elevation-5)
export const elevation = {
  // Niveaux d'élévation
  none: {
    shadow: 'shadow-none',
    hover: 'hover:shadow-none',
  },
  1: {
    shadow: 'shadow-sm',
    hover: 'hover:shadow-md',
    description: 'Cartes de base, éléments subtils',
  },
  2: {
    shadow: 'shadow-md',
    hover: 'hover:shadow-lg',
    description: 'Cartes importantes, boutons',
  },
  3: {
    shadow: 'shadow-lg',
    hover: 'hover:shadow-xl',
    description: 'Modales, dropdowns',
  },
  4: {
    shadow: 'shadow-xl',
    hover: 'hover:shadow-2xl',
    description: 'Éléments flottants, tooltips',
  },
  5: {
    shadow: 'shadow-2xl',
    hover: 'hover:shadow-2xl',
    description: 'Éléments de plus haute priorité',
  },
} as const;

// États interactifs standardisés
export const interactiveStates = {
  // États de base
  default: {
    scale: 'scale-100',
    transition: 'transition-all duration-200 ease-in-out',
  },
  
  // États hover
  hover: {
    subtle: 'hover:scale-[1.02]',
    moderate: 'hover:scale-105',
    strong: 'hover:scale-110',
  },
  
  // États focus
  focus: {
    ring: 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    outline: 'focus:outline-none focus:ring-2 focus:ring-primary-500',
  },
  
  // États active
  active: {
    scale: 'active:scale-95',
    brightness: 'active:brightness-95',
  },
  
  // États disabled
  disabled: {
    opacity: 'disabled:opacity-50',
    cursor: 'disabled:cursor-not-allowed',
    pointer: 'disabled:pointer-events-none',
  },
} as const;

// Combinaisons prédéfinies pour composants
export const componentElevations = {
  card: {
    default: `${elevation[1].shadow} ${elevation[1].hover} ${interactiveStates.default.transition}`,
    important: `${elevation[2].shadow} ${elevation[2].hover} ${interactiveStates.default.transition}`,
    floating: `${elevation[3].shadow} ${elevation[3].hover} ${interactiveStates.default.transition}`,
  },
  
  button: {
    primary: `${elevation[2].shadow} ${elevation[2].hover} ${interactiveStates.hover.subtle} ${interactiveStates.active.scale} ${interactiveStates.default.transition}`,
    secondary: `${elevation[1].shadow} ${elevation[1].hover} ${interactiveStates.hover.subtle} ${interactiveStates.active.scale} ${interactiveStates.default.transition}`,
    ghost: `${elevation.none.shadow} hover:bg-primary-50 ${interactiveStates.hover.subtle} ${interactiveStates.default.transition}`,
  },
  
  modal: {
    backdrop: 'backdrop-blur-sm bg-black/50',
    content: `${elevation[4].shadow} ${interactiveStates.default.transition}`,
  },
  
  dropdown: {
    menu: `${elevation[3].shadow} ${interactiveStates.default.transition}`,
  },
} as const;

// Utilitaire pour obtenir les classes d'élévation
export const getElevationClasses = (level: 1 | 2 | 3 | 4 | 5, withHover: boolean = true) => {
  const elevationLevel = elevation[level];
  return withHover 
    ? `${elevationLevel.shadow} ${elevationLevel.hover} ${interactiveStates.default.transition}`
    : elevationLevel.shadow;
};
