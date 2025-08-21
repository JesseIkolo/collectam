'use client';

import { Chip, ChipProps } from '@heroui/react';
import { motion } from 'framer-motion';

interface StatusChipProps extends Omit<ChipProps, 'variant' | 'color'> {
  status: 'full' | 'empty' | 'collecting' | 'error' | 'scheduled' | 'completed';
  animated?: boolean;
}

export function StatusChip({ 
  status,
  animated = true,
  className = '',
  children,
  ...props 
}: StatusChipProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'full':
        return {
          color: 'warning' as const,
          variant: 'flat' as const,
          text: children || 'Plein',
          icon: '🗑️',
        };
      case 'empty':
        return {
          color: 'success' as const,
          variant: 'flat' as const,
          text: children || 'Vide',
          icon: '✅',
        };
      case 'collecting':
        return {
          color: 'primary' as const,
          variant: 'flat' as const,
          text: children || 'Collecte en cours',
          icon: '🚛',
        };
      case 'error':
        return {
          color: 'danger' as const,
          variant: 'flat' as const,
          text: children || 'Erreur',
          icon: '⚠️',
        };
      case 'scheduled':
        return {
          color: 'secondary' as const,
          variant: 'flat' as const,
          text: children || 'Programmé',
          icon: '📅',
        };
      case 'completed':
        return {
          color: 'success' as const,
          variant: 'solid' as const,
          text: children || 'Terminé',
          icon: '✓',
        };
      default:
        return {
          color: 'default' as const,
          variant: 'flat' as const,
          text: children || 'Inconnu',
          icon: '?',
        };
    }
  };

  const config = getStatusConfig();

  const chipContent = (
    <Chip
      color={config.color}
      variant={config.variant}
      className={`font-medium ${className}`}
      radius="lg"
      {...props}
    >
      <span className="flex items-center gap-1">
        <span className="text-sm">{config.icon}</span>
        {config.text}
      </span>
    </Chip>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {chipContent}
      </motion.div>
    );
  }

  return chipContent;
}
