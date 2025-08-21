'use client';

import { motion } from 'framer-motion';
import { FeatureCard } from '../molecules/FeatureCard';
import { CollectamHeading } from '../atoms/CollectamHeading';
import { getBodyClasses } from '../tokens/typography';
import { animations } from '../tokens/animations';

interface Feature {
  icon?: string;
  title: string;
  description: string;
  benefit?: string;
}

interface FeaturesGridProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
  animated?: boolean;
  className?: string;
}

export function FeaturesGrid({
  title,
  subtitle,
  features,
  columns = 4,
  animated = true,
  className = ''
}: FeaturesGridProps) {
  const getGridClasses = () => {
    switch (columns) {
      case 2: return 'grid md:grid-cols-2 gap-6';
      case 3: return 'grid md:grid-cols-2 lg:grid-cols-3 gap-6';
      case 4: return 'grid md:grid-cols-2 lg:grid-cols-4 gap-6';
      default: return 'grid md:grid-cols-2 lg:grid-cols-4 gap-6';
    }
  };

  return (
    <section className={`py-12 md:py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <motion.div
            {...(animated ? animations.presets.fadeIn : {})}
            className="text-center mb-16"
          >
            {title && (
              <CollectamHeading level="h2" responsive className="mb-6">
                {title}
              </CollectamHeading>
            )}
            {subtitle && (
              <p className={`${getBodyClasses('large')} max-w-3xl mx-auto`}>
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        <div className={getGridClasses()}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              index={index}
              animated={animated}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
