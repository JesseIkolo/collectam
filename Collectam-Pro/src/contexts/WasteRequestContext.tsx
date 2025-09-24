"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Fonction utilitaire pour mapper les types de déchets du frontend vers le backend
const mapWasteType = (frontendType: string): string => {
  const wasteTypeMapping: { [key: string]: string } = {
    'Papier/Carton': 'paper',
    'Plastique': 'plastic',
    'Verre': 'glass',
    'Métal': 'metal',
    'Organique': 'organic',
    'Électronique': 'electronic',
    'Textile': 'textile',
    'Bois': 'wood',
    'Déchets Dangereux': 'hazardous',
    'Encombrants': 'bulky',
    'Autre': 'other'
  };
  
  const mappedType = wasteTypeMapping[frontendType];
  if (!mappedType) {
    console.warn(`⚠️ Type de déchet non mappé: ${frontendType}, utilisation de 'other' par défaut`);
    return 'other';
  }
  
  console.log(`🔄 Mapping: ${frontendType} → ${mappedType}`);
  return mappedType;
};

// Fonction inverse pour mapper les types de déchets du backend vers le frontend
const mapWasteTypeFromBackend = (backendType: string): string => {
  const reverseMapping: { [key: string]: string } = {
    'paper': 'Papier/Carton',
    'plastic': 'Plastique',
    'glass': 'Verre',
    'metal': 'Métal',
    'organic': 'Organique',
    'electronic': 'Électronique',
    'textile': 'Textile',
    'wood': 'Bois',
    'hazardous': 'Déchets Dangereux',
    'bulky': 'Encombrants',
    'other': 'Autre'
  };
  
  return reverseMapping[backendType] || backendType;
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

// Pas de données initiales - tout commence à zéro
const initialMockData: WasteRequestData[] = [];

export function WasteRequestProvider({ children }: { children: ReactNode }) {
  const [wasteRequests, setWasteRequests] = useState<WasteRequestData[]>(initialMockData);

  const addWasteRequest = async (requestData: Omit<WasteRequestData, 'id' | 'createdAt' | 'status'>) => {
    console.log('🗑️ Tentative de création de demande:', requestData);
    
    try {
      // Récupérer le token d'authentification
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('⚠️ Aucun token d\'authentification trouvé');
        throw new Error('Vous devez être connecté pour créer une demande');
      }

      // Appel API pour sauvegarder en BDD
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      console.log('🌐 Tentative d\'appel API:', `${apiUrl}/api/waste-requests`);
      console.log('📤 Données envoyées:', {
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
          'Authorization': `Bearer ${token}`,
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
        console.log(' Demande ajoutée au contexte:', newRequest);
        // Notifier les autres vues (dashboard, historiques, etc.)
        try {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('waste_requests_updated', {
              detail: { reason: 'created', id: newRequest.id }
            }));
          }
        } catch {}
        return newRequest;
      } else {
        const errorText = await response.text();
        console.error(' Erreur API:', response.status, errorText);
        throw new Error(`Erreur API: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      
      // Fallback: sauvegarder localement si l'API échoue
      const newRequest: WasteRequestData = {
        ...requestData,
        id: Date.now().toString(),
        status: "pending",
        createdAt: new Date().toISOString()
      };
      
      setWasteRequests(prev => [newRequest, ...prev]);
      console.log('💾 Demande sauvegardée localement (fallback):', newRequest);
      // Notifier les autres vues pour déclencher un rafraîchissement
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('waste_requests_updated', {
            detail: { reason: 'created', id: newRequest.id, offline: true }
          }));
        }
      } catch {}
      
      // Propager l'erreur pour informer l'utilisateur, mais avec un message plus clair
      if (error instanceof Error) {
        throw new Error(`Demande créée localement. Erreur serveur: ${error.message}`);
      } else {
        throw new Error('Demande créée localement. Impossible de contacter le serveur.');
      }
    }
  };

  const updateWasteRequest = (id: string, updates: Partial<WasteRequestData>) => {
    setWasteRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, ...updates } : request
      )
    );
    // Notifier
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('waste_requests_updated', {
          detail: { reason: 'updated', id }
        }));
      }
    } catch {}
  };

  const deleteWasteRequest = (id: string) => {
    setWasteRequests(prev => prev.filter(request => request.id !== id));
    // Notifier
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('waste_requests_updated', {
          detail: { reason: 'deleted', id }
        }));
      }
    } catch {}
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
