# Design System Collectam

Design system complet et cohérent pour la plateforme de gestion des déchets Collectam, basé sur l'architecture Atomic Design et HeroUI.

## 🏗️ Architecture

### Atomic Design Structure
```
design-system/
├── tokens/           # Design tokens (couleurs, espacement, typographie)
├── atoms/            # Composants de base (Button, Card, Heading)
├── molecules/        # Composants composés (FeatureCard, StepCard)
├── organisms/        # Sections complexes (FeaturesGrid, VehicleTracker)
└── templates/        # Layouts de page (DashboardLayout)
```

## 🎨 Tokens de Design

### Espacement (basé sur 8px)
- **xs**: 8px - Espacements minimaux
- **sm**: 12px - Espacements compacts
- **md**: 16px - Espacements standards
- **lg**: 24px - Espacements généreux
- **xl**: 32px - Espacements larges
- **2xl**: 48px - Espacements très larges

### Typographie
- **H1**: `text-5xl font-bold` - Titres principaux
- **H2**: `text-4xl font-bold` - Titres de section
- **H3**: `text-3xl font-semibold` - Sous-titres
- **H4**: `text-2xl font-semibold` - Titres de composants
- **Body**: `text-base font-normal` - Texte standard

### Élévations (1-5)
- **Elevation 1**: `shadow-sm hover:shadow-md` - Cartes de base
- **Elevation 2**: `shadow-md hover:shadow-lg` - Cartes importantes
- **Elevation 3**: `shadow-lg hover:shadow-xl` - Modales, dropdowns
- **Elevation 4**: `shadow-xl hover:shadow-2xl` - Éléments flottants
- **Elevation 5**: `shadow-2xl` - Plus haute priorité

## 🧩 Composants

### Atoms (Éléments de base)

#### CollectamButton
```tsx
<CollectamButton variant="primary" size="lg">
  Action principale
</CollectamButton>
```
**Variants**: `primary`, `secondary`, `ghost`, `danger`

#### CollectamCard
```tsx
<CollectamCard variant="feature" elevation={2}>
  Contenu de la carte
</CollectamCard>
```
**Variants**: `feature`, `step`, `comparison`, `info`

#### StatusChip
```tsx
<StatusChip status="collecting">
  Collecte en cours
</StatusChip>
```
**Status**: `full`, `empty`, `collecting`, `error`, `scheduled`, `completed`

### Molecules (Composants composés)

#### FeatureCard
```tsx
<FeatureCard
  icon="📊"
  title="Dashboard temps réel"
  description="Décisions rapides basées sur des données"
  benefit="Réactivité maximale"
/>
```

#### WasteAnalyticsChart
```tsx
<WasteAnalyticsChart
  title="Évolution des déchets"
  data={chartData}
  type="line"
  color="#22c55e"
/>
```

### Organisms (Sections complexes)

#### VehicleTracker
```tsx
<VehicleTracker vehicles={vehicleData} />
```

#### IoTSensorStatus
```tsx
<IoTSensorStatus sensors={sensorData} />
```

#### BlockchainVerifier
```tsx
<BlockchainVerifier transactions={transactionData} />
```

#### RouteOptimizer
```tsx
<RouteOptimizer 
  routes={routeData} 
  onOptimize={handleOptimize} 
/>
```

### Templates (Layouts)

#### DashboardLayout
```tsx
<DashboardLayout
  title="Dashboard Principal"
  subtitle="Vue d'ensemble des opérations"
  sidebar={<NavigationSidebar />}
  actions={<ActionButtons />}
>
  {/* Contenu principal */}
</DashboardLayout>
```

## 🎯 Couleurs Sémantiques

### Couleurs Métier
- **Primary** (`#22c55e`): Vert Collectam - Actions principales
- **Secondary** (`#3b82f6`): Bleu - Confiance blockchain
- **Success** (`#22c55e`): Succès écologique
- **Warning** (`#f59e0b`): Urgence déchets
- **Danger** (`#ef4444`): Erreurs critiques

## 📱 Responsive Design

### Breakpoints Mobile-First
- **xs**: 320px - Très petits mobiles
- **sm**: 640px - Mobiles standard
- **md**: 768px - Tablettes
- **lg**: 1024px - Desktop petit
- **xl**: 1280px - Desktop standard
- **2xl**: 1536px - Large desktop

## ⚡ Animations

### Système Uniforme
- **Durées**: 150ms (fast), 200ms (normal), 300ms (slow)
- **Delays**: 50ms, 100ms, 150ms, 200ms pour animations séquentielles
- **Easings**: `ease-out` pour entrées, `ease-in-out` pour interactions

### Presets Disponibles
- `fadeIn`: Apparition en fondu
- `slideUp`: Glissement vers le haut
- `scaleIn`: Zoom d'entrée
- `bounce`: Animation de rebond
- `pulse`: Pulsation continue

## 🌙 Dark Mode

Support complet du mode sombre avec adaptation automatique des couleurs et contrastes.

```tsx
// Classes automatiques
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
```

## ♿ Accessibilité

### Standards WCAG
- Navigation clavier complète
- Support lecteurs d'écran
- Contrastes optimisés
- Raccourcis clavier (Alt+M, Alt+C)
- Respect des préférences utilisateur

## 🚀 Utilisation

### Import
```tsx
import {
  CollectamButton,
  CollectamCard,
  StatusChip,
  FeaturesGrid,
  VehicleTracker,
  DashboardLayout
} from '@/design-system';
```

### Configuration
```tsx
// Utilisation avec animations
<FeatureCard animated={true} index={0} />

// Désactivation des animations
<CollectamButton animated={false} />
```

## 📊 Composants Métier

### Gestion des Déchets
- `StatusChip`: États des conteneurs
- `WasteReportForm`: Signalement citoyen
- `IoTSensorStatus`: Monitoring capteurs

### Logistique
- `VehicleTracker`: Suivi véhicules
- `RouteOptimizer`: Optimisation IA

### Blockchain
- `BlockchainVerifier`: Vérification transactions

### Analytics
- `WasteAnalyticsChart`: Graphiques déchets
- `DashboardLayout`: Layout analytics

## 🔧 Développement

### Conventions de Nommage
- Préfixe `Collectam` pour tous les composants
- CamelCase pour les props
- Variants en lowercase

### Structure des Props
```tsx
interface ComponentProps {
  variant?: string;
  size?: string;
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}
```

## 📈 Évolutivité

Le design system est conçu pour évoluer avec :
- Nouveaux composants métier
- Extensions fonctionnelles
- Adaptations régionales
- Intégrations tierces

---

**Version**: 1.0.0  
**Framework**: HeroUI + Tailwind CSS  
**Architecture**: Atomic Design  
**Accessibilité**: WCAG 2.1 AA
