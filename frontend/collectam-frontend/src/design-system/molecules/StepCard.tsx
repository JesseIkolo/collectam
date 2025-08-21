'use client';

import { motion } from 'framer-motion';
import { CollectamCard } from '../atoms/CollectamCard';
import { CollectamHeading } from '../atoms/CollectamHeading';
import { getBodyClasses } from '../tokens/typography';
import { createStaggeredAnimation, animations } from '../tokens/animations';

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon?: string;
  index?: number;
  showConnector?: boolean;
  animated?: boolean;
  className?: string;
}

export function StepCard({
  number,
  title,
  description,
  icon,
  index = 0,
  showConnector = false,
  animated = true,
  className = ''
}: StepCardProps) {
  const animationProps = animated 
    ? createStaggeredAnimation(animations.presets.slideUp, index, 0.2)
    : {};

  return (
    <motion.div
      {...animationProps}
      className={`relative ${className}`}
    >
      <CollectamCard variant="step" className="h-full">
        <div className="text-center space-y-6">
          {icon && (
            <motion.div 
              className="text-6xl mb-6"
              animate={animations.presets.bounce.animate}
              transition={animations.presets.bounce.transition}
            >
              {icon}
            </motion.div>
          )}
          
          <div className="text-4xl font-bold text-primary-600 mb-4">
            {number}
          </div>
          
          <CollectamHeading level="h4" animated={false}>
            {title}
          </CollectamHeading>
          
          <p className={getBodyClasses('default')}>
            {description}
          </p>
        </div>
      </CollectamCard>
      
      {/* Connector Arrow */}
      {showConnector && (
        <motion.div 
          className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-2xl text-primary-500"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (index + 1) * 0.2 + 0.5 }}
        >
          →
        </motion.div>
      )}
    </motion.div>
  );
}
