'use client';

import { motion } from 'framer-motion';
import { CollectamCard } from '../atoms/CollectamCard';
import { CollectamHeading } from '../atoms/CollectamHeading';
import { getBodyClasses } from '../tokens/typography';
import { createStaggeredAnimation, animations } from '../tokens/animations';

interface FeatureCardProps {
  icon?: string;
  title: string;
  description: string;
  benefit?: string;
  index?: number;
  animated?: boolean;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  benefit,
  index = 0,
  animated = true,
  className = ''
}: FeatureCardProps) {
  const animationProps = animated 
    ? createStaggeredAnimation(animations.presets.slideUp, index, 0.1)
    : {};

  return (
    <motion.div
      {...animationProps}
      className={className}
    >
      <CollectamCard variant="feature" className="h-full">
        <div className="text-center space-y-4">
          {icon && (
            <motion.div 
              className="text-4xl mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.div>
          )}
          
          <CollectamHeading level="h4" animated={false}>
            {title}
          </CollectamHeading>
          
          <p className={getBodyClasses('default')}>
            {description}
          </p>
          
          {benefit && (
            <div className="text-primary-600 font-semibold text-sm">
              {benefit}
            </div>
          )}
        </div>
      </CollectamCard>
    </motion.div>
  );
}
