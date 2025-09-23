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
          className="rounded-b-lg overflow-hidden"
        >
          {/* Map content will be implemented here */}
        </div>
      </CardContent>
    </Card>
  );
}
