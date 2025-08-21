'use client';

import { motion } from 'framer-motion';
import { StepCard } from '../molecules/StepCard';
import { CollectamHeading } from '../atoms/CollectamHeading';
import { getBodyClasses } from '../tokens/typography';
import { animations } from '../tokens/animations';

interface Step {
  number: string;
  title: string;
  description: string;
  icon?: string;
}

interface StepsProcessProps {
  title?: string;
  subtitle?: string;
  steps: Step[];
  animated?: boolean;
  className?: string;
}

export function StepsProcess({
  title,
  subtitle,
  steps,
  animated = true,
  className = ''
}: StepsProcessProps) {
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

        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              {...step}
              index={index}
              showConnector={index < steps.length - 1}
              animated={animated}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
