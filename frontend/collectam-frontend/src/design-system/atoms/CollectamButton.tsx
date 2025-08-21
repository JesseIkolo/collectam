'use client';

import { Button, ButtonProps } from '@heroui/react';
import { motion } from 'framer-motion';
import { componentElevations } from '../tokens/elevation';
import { getAnimationProps, animations } from '../tokens/animations';

interface CollectamButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  elevation?: boolean;
  animated?: boolean;
}

export function CollectamButton({ 
  variant = 'primary', 
  elevation = true,
  animated = true,
  className = '',
  children,
  ...props 
}: CollectamButtonProps) {
  const getVariantClasses = () => {
    const baseClasses = 'font-semibold transition-all duration-200';
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary-600 ${elevation ? componentElevations.button.primary : ''}`;
      case 'secondary':
        return `${baseClasses} border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground ${elevation ? componentElevations.button.secondary : ''}`;
      case 'ghost':
        return `${baseClasses} text-primary hover:bg-primary-50 ${elevation ? componentElevations.button.ghost : ''}`;
      case 'danger':
        return `${baseClasses} bg-danger text-danger-foreground hover:bg-danger-600 ${elevation ? componentElevations.button.primary : ''}`;
      default:
        return baseClasses;
    }
  };

  const buttonContent = (
    <Button
      className={`${getVariantClasses()} ${className}`}
      radius="lg"
      {...props}
    >
      {children}
    </Button>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {buttonContent}
      </motion.div>
    );
  }

  return buttonContent;
}
