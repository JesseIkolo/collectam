import {
  ShoppingBag,
  Forklift,
  Mail,
  MessageSquare,
  Calendar,
  Kanban,
  ReceiptText,
  Users,
  Lock,
  Fingerprint,
  SquareArrowUpRight,
  LayoutDashboard,
  ChartBar,
  Banknote,
  Gauge,
  GraduationCap,
  Trash2,
  MapPin,
  Home,
  User,
  Award,
  History,
  QrCode,
  Truck,
  BarChart3,
  Activity,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

// Function to get sidebar items based on user role and type
export const getSidebarItems = (userRole: string = 'user', userType: string = 'menage'): NavMainItem[] => {
  // Collectam Business gets business dashboard
  if (userType === 'collectam-business') {
    const basePath = '/dashboard/business';
    return [
      {
        title: "Vue d'ensemble",
        url: basePath,
        icon: BarChart3,
      },
      {
        title: "Gestion de Flotte",
        url: `${basePath}/fleet`,
        icon: Truck,
      },
      {
        title: "Carte Temps Réel",
        url: `${basePath}/map`,
        icon: MapPin,
      },
      {
        title: "Analytics",
        url: `${basePath}/analytics`,
        icon: Activity,
      },
      {
        title: "Facturation",
        url: `${basePath}/billing`,
        icon: CreditCard,
      },
      {
        title: "Paramètres",
        url: `${basePath}/settings`,
        icon: Settings,
      },
    ];
  }

  // Collecteur role gets collector dashboard
  if (userRole === 'collector') {
    const basePath = '/dashboard/collector';
    return [
      {
        title: "Tableau de Bord",
        url: basePath,
        icon: Home,
      },
      {
        title: "Carte Temps Réel",
        url: `${basePath}/map`,
        icon: MapPin,
      },
      {
        title: "Scanner QR",
        url: `${basePath}/scanner`,
        icon: QrCode,
      },
      {
        title: "Mes Véhicules",
        url: `${basePath}/vehicles`,
        icon: Truck,
      },
      {
        title: "Mon Profil",
        url: `${basePath}/profile`,
        icon: User,
      },
      {
        title: "Historique",
        url: `${basePath}/history`,
        icon: History,
      },
    ];
  }
  
  // Default user dashboard
  const basePath = '/dashboard/user';
  return [
    {
      title: "Accueil",
      url: basePath,
      icon: Home,
    },
    {
      title: userType === 'entreprise' ? "Gestion des Déchets" : "Mes Déchets",
      url: `${basePath}/waste-management`,
      icon: Trash2,
    },
    {
      title: "Carte en Temps Réel",
      url: `${basePath}/map`,
      icon: MapPin,
    },
    {
      title: "Mon Profil",
      url: `${basePath}/profile`,
      icon: User,
    },
    {
      title: "Mes Récompenses",
      url: `${basePath}/rewards`,
      icon: Award,
    },
    {
      title: "Historique",
      url: `${basePath}/history`,
      icon: History,
    },
  ];
};

// Default export for backward compatibility
export const sidebarItems: NavMainItem[] = getSidebarItems();
