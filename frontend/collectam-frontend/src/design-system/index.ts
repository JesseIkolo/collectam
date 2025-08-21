// Design System Collectam - Index principal
// Architecture Atomic Design complète

// Tokens de design
export * from './tokens/spacing';
export * from './tokens/typography';
export * from './tokens/elevation';
export * from './tokens/animations';
export * from './tokens/darkMode';

// Atoms (éléments de base)
export { CollectamButton } from './atoms/CollectamButton';
export { CollectamCard } from './atoms/CollectamCard';
export { StatusChip } from './atoms/StatusChip';
export { CollectamHeading } from './atoms/CollectamHeading';

// Molecules (composants composés)
export { FeatureCard } from './molecules/FeatureCard';
export { StepCard } from './molecules/StepCard';
export { WasteAnalyticsChart } from './molecules/WasteAnalyticsChart';
export { WasteReportForm } from './molecules/WasteReportForm';

// Organisms (sections complexes)
export { FeaturesGrid } from './organisms/FeaturesGrid';
export { StepsProcess } from './organisms/StepsProcess';
export { VehicleTracker } from './organisms/VehicleTracker';
export { IoTSensorStatus } from './organisms/IoTSensorStatus';
export { BlockchainVerifier } from './organisms/BlockchainVerifier';
export { RouteOptimizer } from './organisms/RouteOptimizer';

// Templates (layouts de page)
export { DashboardLayout } from './templates/DashboardLayout';

// Types pour TypeScript
export interface CollectamTheme {
  spacing: typeof import('./tokens/spacing').spacing;
  typography: typeof import('./tokens/typography').typography;
  elevation: typeof import('./tokens/elevation').elevation;
  animations: typeof import('./tokens/animations').animations;
  darkMode: typeof import('./tokens/darkMode').darkModeTokens;
}

// Configuration par défaut
export const collectamDesignSystem = {
  name: 'Collectam Design System',
  version: '1.0.0',
  description: 'Design system cohérent pour la plateforme Collectam',
  architecture: 'Atomic Design',
  framework: 'HeroUI + Tailwind CSS + Recharts',
  features: [
    'Architecture Atomic Design complète',
    'Système d\'espacement basé sur 8px',
    'Hiérarchie typographique standardisée',
    'Élévations cohérentes (1-5)',
    'Animations uniformes avec Framer Motion',
    'Support mobile-first optimisé',
    'Accessibilité WCAG 2.1 AA',
    'Dark mode complet',
    'Composants métier spécialisés',
    'Data visualization intégrée',
    'StatusChips pour gestion déchets',
    'Formulaires spécialisés',
  ],
  components: {
    atoms: 4,
    molecules: 4,
    organisms: 6,
    templates: 1,
    total: 15,
  },
} as const;
