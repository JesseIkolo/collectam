'use client';

import { Card, CardBody, CardProps } from '@heroui/react';
import { motion } from 'framer-motion';
import { componentElevations } from '../tokens/elevation';
import { spacingClasses } from '../tokens/spacing';

interface CollectamCardProps extends Omit<CardProps, 'variant'> {
  variant?: 'feature' | 'step' | 'comparison' | 'info';
  elevation?: 1 | 2 | 3;
  animated?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export function CollectamCard({ 
  variant = 'info',
  elevation = 1,
  animated = true,
  padding = 'md',
  className = '',
  children,
  ...props 
}: CollectamCardProps) {
  const getVariantClasses = () => {
    const baseClasses = 'bg-white border transition-all duration-200';
    
    switch (variant) {
      case 'feature':
        return `${baseClasses} border-primary-200/50 hover:border-primary-300 ${componentElevations.card.default}`;
      case 'step':
        return `${baseClasses} border-secondary-200/50 hover:border-secondary-300 ${componentElevations.card.important}`;
      case 'comparison':
        return `${baseClasses} border-success-200/50 hover:border-success-300 ${componentElevations.card.default}`;
      case 'info':
        return `${baseClasses} border-gray-200 hover:border-gray-300 ${componentElevations.card.default}`;
      default:
        return baseClasses;
    }
  };

  const getPaddingClass = () => {
    switch (padding) {
      case 'sm': return 'p-4';
      case 'md': return 'p-6';
      case 'lg': return 'p-8';
      default: return 'p-6';
    }
  };

  const cardContent = (
    <Card
      className={`${getVariantClasses()} ${className}`}
      radius="lg"
      {...props}
    >
      <CardBody className={getPaddingClass()}>
        {children}
      </CardBody>
    </Card>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}
