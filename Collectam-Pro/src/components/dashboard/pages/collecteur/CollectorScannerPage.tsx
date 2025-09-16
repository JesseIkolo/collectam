"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  QrCode, 
  Camera, 
  CheckCircle, 
  AlertTriangle,
  Package,
  MapPin,
  Clock,
  User,
  Truck,
  Play,
  Square,
  RotateCcw,
  Flashlight,
  FlashlightOff
} from "lucide-react";

interface ScannedCollection {
  id: string;
  qrCode: string;
  address: string;
  clientName: string;
  wasteType: string;
  estimatedWeight: number;
  actualWeight?: number;
  status: 'scanned' | 'collected' | 'verified';
  timestamp: string;
}

export default function CollectorScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scannedCollections, setScannedCollections] = useState<ScannedCollection[]>([
    {
      id: 'COL-001',
      qrCode: 'QR-2024-001-ABC',
      address: '123 Rue de la Paix, Douala',
      clientName: 'Marie Nguema',
      wasteType: 'Plastique',
      estimatedWeight: 15.5,
      actualWeight: 16.2,
      status: 'collected',
      timestamp: '2024-01-15 09:30:00'
    },
    {
      id: 'COL-002',
      qrCode: 'QR-2024-002-DEF',
      address: '45 Avenue Kennedy, Douala',
      clientName: 'Jean Mballa',
      wasteType: 'Organique',
      estimatedWeight: 8.2,
      status: 'scanned',
      timestamp: '2024-01-15 10:15:00'
    }
  ]);
  
  const [lastScannedCode, setLastScannedCode] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScanning = () => {
    setIsScanning(true);
    // Ici on initialiserait la caméra
    // navigator.mediaDevices.getUserMedia({ video: true })
  };

  const stopScanning = () => {
    setIsScanning(false);
    // Arrêter le stream vidéo
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
    // Contrôler le flash de la caméra
  };

  const simulateQRScan = () => {
    const mockQRCode = `QR-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    setLastScannedCode(mockQRCode);
    
    // Simuler l'ajout d'une nouvelle collecte scannée
    const newCollection: ScannedCollection = {
      id: `COL-${String(scannedCollections.length + 1).padStart(3, '0')}`,
      qrCode: mockQRCode,
      address: '67 Rue Nouvelle, Douala',
      clientName: 'Client Test',
      wasteType: 'Mixte',
      estimatedWeight: 10.0,
      status: 'scanned',
      timestamp: new Date().toLocaleString('fr-FR')
    };
    
    setScannedCollections(prev => [newCollection, ...prev]);
    setIsScanning(false);
  };

  const markAsCollected = (id: string, actualWeight: number) => {
    setScannedCollections(prev => prev.map(collection => 
      collection.id === id 
        ? { ...collection, status: 'collected' as const, actualWeight }
        : collection
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scanned':
        return <Badge variant="outline" className="bg-yellow-50">Scanné</Badge>;
      case 'collected':
        return <Badge className="bg-green-600">Collecté</Badge>;
      case 'verified':
        return <Badge className="bg-blue-600">Vérifié</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scanned':
        return <QrCode className="h-4 w-4 text-yellow-600" />;
      case 'collected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    }
  };

  const todayCollections = scannedCollections.filter(c => 
    new Date(c.timestamp).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scanner QR</h1>
          <p className="text-muted-foreground">
            Scannez les codes QR pour valider les collectes
          </p>
        </div>
        <Badge variant="default" className="flex items-center gap-1">
          <Truck className="h-3 w-3" />
          {todayCollections.length} collectes aujourd'hui
        </Badge>
      </div>

      {/* Stats rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scannés</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scannedCollections.filter(c => c.status === 'scanned').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collectés</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scannedCollections.filter(c => c.status === 'collected').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Poids Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scannedCollections
                .filter(c => c.actualWeight)
                .reduce((sum, c) => sum + (c.actualWeight || 0), 0)
                .toFixed(1)} kg
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Collecte</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scannedCollections.length > 0 
                ? Math.round((scannedCollections.filter(c => c.status === 'collected').length / scannedCollections.length) * 100)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scanner QR */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Scanner QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg relative overflow-hidden">
              {isScanning ? (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                    
                    {/* Ligne de scan animée */}
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-blue-500 animate-pulse"></div>
                  </div>
                  <p className="absolute bottom-8 text-white text-sm">
                    Positionnez le QR code dans le cadre
                  </p>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <QrCode className="h-16 w-16 mb-4" />
                  <p className="text-sm">Appuyez pour démarrer le scan</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!isScanning ? (
                <Button onClick={startScanning} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Démarrer Scan
                </Button>
              ) : (
                <Button onClick={stopScanning} variant="destructive" className="flex-1">
                  <Square className="h-4 w-4 mr-2" />
                  Arrêter Scan
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={toggleFlash}
                className={flashEnabled ? 'bg-yellow-50' : ''}
              >
                {flashEnabled ? <Flashlight className="h-4 w-4" /> : <FlashlightOff className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" onClick={simulateQRScan}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {lastScannedCode && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">QR Code scanné avec succès!</p>
                    <p className="text-sm text-muted-foreground">Code: {lastScannedCode}</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Liste des collectes scannées */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Collectes Scannées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {scannedCollections.map((collection) => (
                <div key={collection.id} className="p-3 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(collection.status)}
                        <span className="font-medium text-sm">{collection.id}</span>
                        {getStatusBadge(collection.status)}
                      </div>
                      
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {collection.clientName}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {collection.address}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {collection.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span>Type: <Badge variant="outline" className="text-xs">{collection.wasteType}</Badge></span>
                      <span>Estimé: {collection.estimatedWeight} kg</span>
                      {collection.actualWeight && (
                        <span>Réel: {collection.actualWeight} kg</span>
                      )}
                    </div>
                  </div>

                  {collection.status === 'scanned' && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => markAsCollected(collection.id, collection.estimatedWeight)}
                        className="flex-1"
                      >
                        Marquer comme collecté
                      </Button>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    QR: {collection.qrCode}
                  </div>
                </div>
              ))}

              {scannedCollections.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune collecte scannée aujourd'hui</p>
                  <p className="text-xs">Commencez par scanner un QR code</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
