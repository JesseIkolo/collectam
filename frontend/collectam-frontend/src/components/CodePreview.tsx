'use client';

import { Card, CardBody, Button, Code, Tabs, Tab } from '@heroui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const codeExamples = {
  installation: `# Installation rapide
npm install @collectam/family-kit

# Ou avec yarn
yarn add @collectam/family-kit`,
  
  usage: `import { WasteScanner, RevenueTracker } from '@collectam/family-kit';

function FamilyDashboard() {
  return (
    <div>
      <WasteScanner 
        onScan={(waste) => console.log('Déchet détecté:', waste)}
        aiRecognition={true}
      />
      <RevenueTracker 
        family="Famille Martin"
        monthlyGoal={100}
      />
    </div>
  );
}`,

  config: `// collectam.config.js
export default {
  family: {
    name: "Famille Martin",
    members: 4,
    goals: {
      monthly: 80, // euros
      recycling: 95 // pourcentage
    }
  },
  ai: {
    recognition: true,
    autoSort: true,
    smartTips: true
  },
  blockchain: {
    rewards: true,
    transparency: true
  }
}`
};

export default function CodePreview() {
  const [activeTab, setActiveTab] = useState('installation');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Commencez en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
              quelques minutes
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Configuration simple et intuitive. Votre famille peut commencer à gagner de l'argent dès aujourd'hui.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Code Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardBody className="p-0">
                <Tabs 
                  selectedKey={activeTab}
                  onSelectionChange={(key) => setActiveTab(key as string)}
                  className="w-full"
                  classNames={{
                    tabList: "bg-gray-900/50 p-1",
                    tab: "text-gray-400 data-[selected=true]:text-white",
                    tabContent: "text-sm font-medium"
                  }}
                >
                  <Tab key="installation" title="Installation">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-semibold">Installation</h3>
                        <Button
                          size="sm"
                          variant="flat"
                          onClick={() => copyToClipboard(codeExamples.installation)}
                          className="text-gray-300 hover:text-white"
                        >
                          {copied ? '✓ Copié' : '📋 Copier'}
                        </Button>
                      </div>
                      <Code
                        className="w-full bg-gray-900 text-gray-300 p-4 text-sm font-mono whitespace-pre-wrap"
                        radius="md"
                      >
                        {codeExamples.installation}
                      </Code>
                    </div>
                  </Tab>
                  
                  <Tab key="usage" title="Utilisation">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-semibold">Exemple d'usage</h3>
                        <Button
                          size="sm"
                          variant="flat"
                          onClick={() => copyToClipboard(codeExamples.usage)}
                          className="text-gray-300 hover:text-white"
                        >
                          {copied ? '✓ Copié' : '📋 Copier'}
                        </Button>
                      </div>
                      <Code
                        className="w-full bg-gray-900 text-gray-300 p-4 text-sm font-mono whitespace-pre-wrap"
                        radius="md"
                      >
                        {codeExamples.usage}
                      </Code>
                    </div>
                  </Tab>
                  
                  <Tab key="config" title="Configuration">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-semibold">Configuration</h3>
                        <Button
                          size="sm"
                          variant="flat"
                          onClick={() => copyToClipboard(codeExamples.config)}
                          className="text-gray-300 hover:text-white"
                        >
                          {copied ? '✓ Copié' : '📋 Copier'}
                        </Button>
                      </div>
                      <Code
                        className="w-full bg-gray-900 text-gray-300 p-4 text-sm font-mono whitespace-pre-wrap"
                        radius="md"
                      >
                        {codeExamples.config}
                      </Code>
                    </div>
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {[
              {
                icon: '🚀',
                title: 'Installation en 30 secondes',
                description: 'Une seule commande suffit pour démarrer votre aventure écologique et rentable.'
              },
              {
                icon: '🎯',
                title: 'Configuration intelligente',
                description: 'L\'IA s\'adapte automatiquement aux habitudes de votre famille.'
              },
              {
                icon: '📱',
                title: 'Interface intuitive',
                description: 'Design moderne et accessible pour tous les âges de la famille.'
              },
              {
                icon: '💰',
                title: 'Revenus immédiats',
                description: 'Commencez à gagner de l\'argent dès le premier déchet recyclé.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                whileHover={{ x: 5 }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
