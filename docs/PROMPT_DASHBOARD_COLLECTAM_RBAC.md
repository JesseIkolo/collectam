# **PROMPT DASHBOARD COLLECTAM - UX/UI DESIGN AVEC RBAC**

## **CONTEXTE PROJET**
Vous êtes un UX/UI designer senior avec 10+ ans d'expérience produit. Créez un dashboard moderne et intuitif pour **Collectam**, plateforme de gestion des déchets utilisant IoT + AI + Blockchain.

## **ARCHITECTURE RBAC (Role-Based Access Control)**

### **RÔLES ET HIÉRARCHIE**
```
ADMIN (Super Admin)
├── Accès total système
├── Gestion des organisations
├── Analytics globales
└── Configuration plateforme

ORG_ADMIN (Administrateur Organisation)
├── Gestion des collecteurs et véhicules
├── Analytics de l'organisation
├── Configuration des zones de collecte
└── Gestion des utilisateurs org

COLLECTOR (Collecteur)
├── Missions assignées et en cours
├── Validation QR codes et photos
├── Suivi des véhicules et itinéraires
└── Historique des collectes

USER (Utilisateur/Ménage)
├── Signalement de déchets géolocalisés
├── Suivi des collectes programmées
├── Historique personnel
└── Notifications
```

## **SPÉCIFICATIONS DESIGN**

### **SYSTÈME DE DESIGN**
- **Framework** : Next.js + TypeScript + Tailwind CSS
- **Composants** : shadcn/ui (style: new-york) + Lucide Icons
- **Thème** : Noir sur blanc (neutral baseColor)
- **Responsive** : Mobile-first approach
- **Accessibilité** : WCAG 2.1 AA
- **Architecture** : SidebarProvider + SidebarInset pattern

### **NAVIGATION ADAPTATIVE PAR RÔLE**

#### **ADMIN Dashboard**
```tsx
Sidebar Navigation:
├── 🏠 Vue d'ensemble (KPIs globaux)
├── 🏢 Organisations (CRUD + Analytics)
├── 👥 Utilisateurs (Gestion globale)
├── 🚛 Flotte globale (Tous véhicules)
├── 📊 Analytics avancées
├── ⚙️ Configuration système
└── 🔐 Sécurité & Logs
```

#### **ORG_ADMIN Dashboard**
```tsx
Sidebar Navigation:
├── 🏠 Tableau de bord org
├── 👷 Collecteurs (Gestion équipe)
├── 🚛 Véhicules (Flotte org)
├── 🗺️ Zones de collecte
├── 📋 Missions (Planning)
├── 📊 Rapports org
├── 👥 Utilisateurs org
└── ⚙️ Paramètres org
```

#### **COLLECTOR Dashboard**
```tsx
Sidebar Navigation:
├── 🏠 Mes missions du jour
├── 📍 Mission en cours
├── 📱 Scanner QR/Photo
├── 🚛 Mon véhicule
├── 📊 Mes performances
├── 📋 Historique missions
└── 👤 Mon profil
```

#### **USER Dashboard**
```tsx
Sidebar Navigation:
├── 🏠 Accueil
├── 📍 Signaler déchet
├── 📅 Mes collectes
├── 🔔 Notifications
├── 📊 Mon impact
├── 🏆 Récompenses
└── 👤 Mon profil
```

## **COMPOSANTS DASHBOARD PAR RÔLE**

### **ADMIN - Vue d'ensemble**
```tsx
// Utiliser les composants shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Organisations actives</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">245</div>
      <p className="text-xs text-muted-foreground">+12% ce mois</p>
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Collectes totales</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">12,543</div>
      <p className="text-xs text-muted-foreground">+8% cette semaine</p>
    </CardContent>
  </Card>
</div>
```

### **ORG_ADMIN - Tableau de bord organisation**
```tsx
// Architecture avec Sidebar et composants shadcn/ui
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<SidebarProvider>
  <Sidebar>
    <SidebarHeader>
      <h2 className="text-lg font-semibold">Collectam Admin</h2>
    </SidebarHeader>
    <SidebarContent>
      {/* Navigation par rôle ORG_ADMIN */}
    </SidebarContent>
  </Sidebar>
  
  <SidebarInset>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Collectes aujourd'hui</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">47</div>
          <Badge variant="secondary">En cours</Badge>
        </CardContent>
      </Card>
    </div>
  </SidebarInset>
</SidebarProvider>
```

### **COLLECTOR - Missions du jour**
```tsx
// Interface mobile-first pour collecteurs
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, Camera, AlertTriangle, Play, Pause } from "lucide-react"

<div className="space-y-4">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Play className="h-4 w-4" />
        Mission en cours
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p className="text-sm">Collecte Zone Nord - Secteur A</p>
        <Progress value={65} className="w-full" />
        <p className="text-xs text-muted-foreground">13/20 points collectés</p>
      </div>
    </CardContent>
  </Card>
  
  <div className="grid grid-cols-2 gap-4">
    <Button className="flex items-center gap-2">
      <QrCode className="h-4 w-4" />
      Scanner QR
    </Button>
    <Button variant="outline" className="flex items-center gap-2">
      <Camera className="h-4 w-4" />
      Photo
    </Button>
  </div>
</div>
```

### **USER - Accueil utilisateur**
```tsx
// Interface utilisateur simplifiée
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Award, Plus } from "lucide-react"

<div className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Bonjour, Marie! 👋</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p className="text-sm">Prochaine collecte: Demain 8h00</p>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-green-600" />
          <span className="text-sm">245 points écologiques</span>
        </div>
      </div>
    </CardContent>
  </Card>
  
  <Button className="w-full flex items-center gap-2" size="lg">
    <Plus className="h-4 w-4" />
    Signaler un déchet
  </Button>
  
  <div className="grid grid-cols-3 gap-2">
    <Badge variant="secondary" className="justify-center py-2">
      🏆 Éco-warrior
    </Badge>
    <Badge variant="secondary" className="justify-center py-2">
      ♻️ Recycleur
    </Badge>
    <Badge variant="secondary" className="justify-center py-2">
      🌱 Vert
    </Badge>
  </div>
</div>
```

## **LOGIQUE RBAC TECHNIQUE**

### **Middleware de protection**
```tsx
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  const userRole = getUserRole(token)
  const pathname = request.nextUrl.pathname
  
  // Vérification accès par rôle
  if (!hasAccess(userRole, pathname)) {
    return NextResponse.redirect('/unauthorized')
  }
}

const rolePermissions = {
  ADMIN: ['*'], // Accès total
  ORG_ADMIN: ['/dashboard', '/collectors', '/vehicles', '/zones', '/reports'],
  COLLECTOR: ['/dashboard', '/missions', '/scanner', '/profile'],
  USER: ['/dashboard', '/report', '/schedule', '/profile']
}
```

### **Composants conditionnels avec shadcn/ui**
```tsx
// RoleBasedComponent.tsx
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldX } from "lucide-react"

interface RoleBasedProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const RoleBasedComponent = ({ allowedRoles, children, fallback }) => {
  const { user } = useAuth()
  
  if (!allowedRoles.includes(user.role)) {
    return fallback || (
      <Alert>
        <ShieldX className="h-4 w-4" />
        <AlertDescription>
          Accès non autorisé pour votre rôle.
        </AlertDescription>
      </Alert>
    )
  }
  
  return <>{children}</>
}

// Sidebar Navigation Component
export const AppSidebar = ({ variant, collapsible }: SidebarProps) => {
  const { user } = useAuth()
  
  return (
    <Sidebar variant={variant} collapsible={collapsible}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Command />
                <span className="font-semibold">Collectam</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getSidebarItemsByRole(user.role)} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
```

## **FONCTIONNALITÉS AVANCÉES**

### **Notifications temps réel**
- WebSocket pour updates live
- Notifications push par rôle
- Centre de notifications unifié

### **Analytics personnalisées**
- Dashboards adaptatifs par rôle
- Exports de données
- Rapports automatisés

### **Gamification (USER)**
- Système de points
- Badges et récompenses
- Classements communautaires

## **SPÉCIFICATIONS TECHNIQUES**

### **Performance**
- Lazy loading des composants
- Pagination intelligente
- Cache optimisé par rôle

### **Sécurité**
- JWT avec refresh tokens
- Validation côté client/serveur
- Audit logs des actions

### **Accessibilité**
- Navigation clavier
- Screen readers
- Contraste élevé

## **LIVRABLES ATTENDUS**

1. **Wireframes** détaillés par rôle
2. **Prototypes** interactifs Figma
3. **Design system** complet
4. **Spécifications** techniques
5. **Guide** d'implémentation RBAC

---

*Ce prompt vous permettra de générer un dashboard Collectam professionnel avec une logique RBAC complète et une expérience utilisateur optimisée pour chaque rôle.*
