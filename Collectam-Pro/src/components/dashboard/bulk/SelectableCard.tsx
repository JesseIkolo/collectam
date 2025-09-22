"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface SelectableCardProps {
  children: React.ReactNode;
  isSelected: boolean;
  onSelectionChange: (selected: boolean) => void;
  selectionMode: boolean;
  className?: string;
}

export default function SelectableCard({
  children,
  isSelected,
  onSelectionChange,
  selectionMode,
  className
}: SelectableCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    if (selectionMode) {
      e.preventDefault();
      e.stopPropagation();
      onSelectionChange(!isSelected);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    onSelectionChange(checked);
  };

  return (
    <Card 
      className={cn(
        "relative transition-all duration-200",
        selectionMode && "cursor-pointer hover:shadow-md",
        isSelected && "ring-2 ring-blue-500 bg-blue-50",
        className
      )}
      onClick={handleCardClick}
    >
      {/* Checkbox de sélection */}
      {selectionMode && (
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
            className="bg-white shadow-sm"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Contenu de la carte avec padding ajusté si en mode sélection */}
      <div className={cn(selectionMode && "ml-8")}>
        {children}
      </div>

      {/* Overlay de sélection */}
      {selectionMode && isSelected && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg pointer-events-none" />
      )}
    </Card>
  );
}
