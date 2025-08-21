'use client';

import { motion } from 'framer-motion';
import { getHeadingClasses, typography } from '../tokens/typography';
import { getAnimationProps, animations } from '../tokens/animations';

interface CollectamHeadingProps {
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  responsive?: boolean;
}

export function CollectamHeading({ 
  level,
  children,
  className = '',
  animated = true,
  responsive = false
}: CollectamHeadingProps) {
  const Component = level;
  
  const getResponsiveClasses = () => {
    if (!responsive) return '';
    
    switch (level) {
      case 'h1':
        return typography.responsive.hero;
      case 'h2':
        return typography.responsive.title;
      case 'h3':
        return typography.responsive.subtitle;
      default:
        return '';
    }
  };

  const headingClasses = responsive 
    ? `${getResponsiveClasses()} font-bold leading-tight text-gray-900`
    : getHeadingClasses(level);

  const headingContent = (
    <Component className={`${headingClasses} ${className}`}>
      {children}
    </Component>
  );

  if (animated) {
    return (
      <motion.div
        {...getAnimationProps(animations.presets.fadeIn)}
      >
        {headingContent}
      </motion.div>
    );
  }

  return headingContent;
}
