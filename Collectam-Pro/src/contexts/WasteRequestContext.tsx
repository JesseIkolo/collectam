"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Fonction utilitaire pour mapper les types de déchets du frontend vers le backend
const mapWasteType = (frontendType: string): string => {
  // Les valeurs sont maintenant directement compatibles avec le backend
  return frontendType;
};

// Fonction pour formater l'heure au format HH:MM attendu par l'API
const formatTimeForAPI = (timeRange: string): string => {
  // Convertir "08:00-10:00" vers "08:00"
  if (timeRange.includes('-')) {
    return timeRange.split('-')[0];
  }
  return timeRange;
};

export interface WasteRequestData {
  id: string;
  wasteType: string;
  description: string;
  estimatedWeight: number;
  address: string;
  status: "pending" | "scheduled" | "in_progress" | "completed" | "cancelled";
  urgency: "low" | "medium" | "high";
  preferredDate: string;
  preferredTime: string;
  createdAt: string;
}

interface WasteRequestContextType {
  wasteRequests: WasteRequestData[];
  addWasteRequest: (request: Omit<WasteRequestData, 'id' | 'createdAt' | 'status'>) => Promise<WasteRequestData>;
  updateWasteRequest: (id: string, updates: Partial<WasteRequestData>) => void;
  deleteWasteRequest: (id: string) => void;
  getRecentRequests: (limit?: number) => WasteRequestData[];
}

const WasteRequestContext = createContext<WasteRequestContextType | undefined>(undefined);

// Données mock initiales
const initialMockData: WasteRequestData[] = [
  {
    id: "1",
    wasteType: "Plastique",
    description: "Bouteilles en plastique et emballages",
    estimatedWeight: 2.5,
    address: "123 Rue de la Paix, Douala",
    status: "pending",
    urgency: "medium",
    preferredDate: "2024-01-20",
    preferredTime: "14:00-16:00",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    wasteType: "Organique",
    description: "Déchets de cuisine et restes alimentaires",
    estimatedWeight: 5.0,
    address: "456 Avenue Charles de Gaulle, Douala",
    status: "scheduled",
    urgency: "low",
    preferredDate: "2024-01-18",
    preferredTime: "08:00-10:00",
    createdAt: "2024-01-14T08:15:00Z"
  },
  {
    id: "3",
    wasteType: "Électronique",
    description: "Ancien téléphone et chargeurs",
    estimatedWeight: 0.8,
    address: "789 Boulevard de la Liberté, Douala",
    status: "in_progress",
    urgency: "high",
    preferredDate: "2024-01-16",
    preferredTime: "10:00-12:00",
    createdAt: "2024-01-13T14:20:00Z"
  }
];

export function WasteRequestProvider({ children }: { children: ReactNode }) {
  const [wasteRequests, setWasteRequests] = useState<WasteRequestData[]>(initialMockData);

  const addWasteRequest = async (requestData: Omit<WasteRequestData, 'id' | 'createdAt' | 'status'>) => {
    try {
      // Appel API pour sauvegarder en BDD
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      console.log('Tentative d\'appel API:', `${apiUrl}/api/waste-requests`);
      console.log('Données envoyées:', {
        wasteType: mapWasteType(requestData.wasteType),
        description: requestData.description,
        estimatedWeight: requestData.estimatedWeight,
        address: requestData.address,
        preferredDate: requestData.preferredDate,
        preferredTime: formatTimeForAPI(requestData.preferredTime),
        urgency: requestData.urgency
      });
      
      const response = await fetch(`${apiUrl}/api/waste-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          wasteType: mapWasteType(requestData.wasteType),
          description: requestData.description,
          estimatedWeight: requestData.estimatedWeight,
          address: requestData.address,
          preferredDate: requestData.preferredDate,
          preferredTime: formatTimeForAPI(requestData.preferredTime),
          urgency: requestData.urgency
        })
      });

      console.log('Réponse API status:', response.status);
      console.log('Token utilisé:', localStorage.getItem('token') ? 'Token présent' : 'Aucun token');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur API:', errorText);
        console.error('Headers de réponse:', Object.fromEntries(response.headers.entries()));
        
        if (response.status === 403) {
          console.error('Erreur 403: Token invalide ou manquant. Redirection vers login...');
          // Nettoyer le token invalide
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          // Rediriger vers la page de connexion
          window.location.href = '/auth/v2/login';
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        
        if (response.status === 500) {
          console.error('Erreur 500: Problème serveur backend. Vérifiez les logs du serveur.');
          throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
        }
        
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Réponse API:', result);
      
      if (result.success) {
        // Ajouter la demande créée au state local
        const newRequest: WasteRequestData = {
          id: result.data._id,
          wasteType: requestData.wasteType,
          description: requestData.description,
          estimatedWeight: requestData.estimatedWeight,
          address: requestData.address,
          status: "pending",
          urgency: requestData.urgency,
          preferredDate: requestData.preferredDate,
          preferredTime: requestData.preferredTime,
          createdAt: result.data.createdAt
        };
        
        setWasteRequests(prev => [newRequest, ...prev]);
        return newRequest;
      } else {
        throw new Error('Échec de la création de la demande');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // Fallback: sauvegarder localement si l'API échoue
      const newRequest: WasteRequestData = {
        ...requestData,
        id: Date.now().toString(),
        status: "pending",
        createdAt: new Date().toISOString()
      };
      
      setWasteRequests(prev => [newRequest, ...prev]);
      throw error; // Propager l'erreur pour informer l'utilisateur
    }
  };

  const updateWasteRequest = (id: string, updates: Partial<WasteRequestData>) => {
    setWasteRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, ...updates } : request
      )
    );
  };

  const deleteWasteRequest = (id: string) => {
    setWasteRequests(prev => prev.filter(request => request.id !== id));
  };

  const getRecentRequests = (limit: number = 5) => {
    return wasteRequests
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  };

  const value: WasteRequestContextType = {
    wasteRequests,
    addWasteRequest,
    updateWasteRequest,
    deleteWasteRequest,
    getRecentRequests
  };

  return (
    <WasteRequestContext.Provider value={value}>
      {children}
    </WasteRequestContext.Provider>
  );
}

export function useWasteRequests() {
  const context = useContext(WasteRequestContext);
  if (context === undefined) {
    throw new Error('useWasteRequests must be used within a WasteRequestProvider');
  }
  return context;
}
