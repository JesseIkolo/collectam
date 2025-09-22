"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Construction } from "lucide-react";

interface InteractiveMapProps {
  className?: string;
  height?: string;
  showControls?: boolean;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

export function InteractiveMap({ 
  className, 
  height = "400px"
}: InteractiveMapProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Carte Interactive
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div 
          style={{ height, width: '100%' }}
          className="rounded-b-lg overflow-hidden bg-muted/20 flex items-center justify-center"
        >
          <div className="text-center p-8">
            <Construction className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Carte en développement
            </h3>
            <p className="text-sm text-muted-foreground">
              La carte sera prête bientôt
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
