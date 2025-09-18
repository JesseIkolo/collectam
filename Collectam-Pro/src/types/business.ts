export interface BusinessCollector {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId?: string;
  position: string;
  businessOwnerId: string;
  status: 'actif' | 'inactif' | 'suspendu';
  hireDate: string;
  assignedVehicleId?: string;
  workZone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country: string;
  };
  workSchedule?: {
    startTime?: string;
    endTime?: string;
    workDays?: string[];
  };
  salary?: {
    amount: number;
    currency: string;
    paymentFrequency: 'horaire' | 'journalier' | 'hebdomadaire' | 'mensuel';
  };
  documents?: {
    photo?: string;
    cni?: string;
    cv?: string;
    contrat?: string;
  };
  isVerified: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessVehicle {
  _id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  capacity: number;
  vehicleType: 'camion' | 'camionnette' | 'moto' | 'velo' | 'tricycle' | 'benne' | 'compacteur';
  businessOwnerId: string;
  assignedCollectorId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  status: 'actif' | 'inactif' | 'maintenance' | 'hors_service' | 'en_mission';
  fuelType: 'essence' | 'diesel' | 'electrique' | 'hybride' | 'gaz';
  fuelLevel: number;
  mileage: number;
  acquisitionType: 'achat' | 'location' | 'leasing';
  purchaseDate?: string;
  purchasePrice?: number;
  documents: {
    carteGrise?: {
      url: string;
      expiryDate: string;
    };
    assurance?: {
      url: string;
      expiryDate: string;
      company: string;
      policyNumber: string;
    };
    controletech?: {
      url: string;
      expiryDate: string;
    };
    permisConduire?: {
      url: string;
      expiryDate: string;
    };
  };
  maintenanceHistory?: Array<{
    date: string;
    type: 'vidange' | 'revision' | 'reparation' | 'controle_technique' | 'autre';
    description: string;
    cost?: number;
    garage?: string;
    nextMaintenanceDate?: string;
  }>;
  nextMaintenanceDate?: string;
  operationZone?: string;
  equipment?: Array<{
    name: string;
    description?: string;
    serialNumber?: string;
  }>;
  monthlyOperatingCost?: number;
  gpsDevice?: {
    deviceId: string;
    isActive: boolean;
  };
  isVerified: boolean;
  verificationDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessFleetStats {
  collectors: {
    actif: number;
    inactif: number;
    suspendu: number;
  };
  vehicles: {
    actif: number;
    inactif: number;
    maintenance: number;
    hors_service: number;
    en_mission: number;
  };
}

export interface BusinessFleetData {
  businessCollectors: {
    list: BusinessCollector[];
    stats: BusinessFleetStats['collectors'];
    total: number;
  };
  businessVehicles: {
    list: BusinessVehicle[];
    stats: BusinessFleetStats['vehicles'];
    total: number;
  };
}
