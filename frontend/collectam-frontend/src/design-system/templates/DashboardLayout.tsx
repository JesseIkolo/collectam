'use client';

import { motion } from 'framer-motion';
import { CollectamHeading } from '../atoms/CollectamHeading';
import { getBodyClasses } from '../tokens/typography';
import { animations } from '../tokens/animations';

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  actions?: React.ReactNode;
  animated?: boolean;
  className?: string;
}

export function DashboardLayout({
  title,
  subtitle,
  children,
  sidebar,
  actions,
  animated = true,
  className = ''
}: DashboardLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <motion.header
        {...(animated ? animations.presets.slideUp : {})}
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <CollectamHeading level="h1" animated={false}>
                {title}
              </CollectamHeading>
              {subtitle && (
                <p className={`${getBodyClasses('default')} mt-2`}>
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {actions}
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid ${sidebar ? 'lg:grid-cols-4' : 'grid-cols-1'} gap-8`}>
          {/* Sidebar */}
          {sidebar && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              {sidebar}
            </motion.aside>
          )}

          {/* Main Content Area */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={sidebar ? 'lg:col-span-3' : 'col-span-1'}
            role="main"
            id="main-content"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}
