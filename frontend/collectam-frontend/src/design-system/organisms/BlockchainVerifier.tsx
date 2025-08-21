'use client';

import { motion } from 'framer-motion';
import { CollectamCard } from '../atoms/CollectamCard';
import { CollectamHeading } from '../atoms/CollectamHeading';
import { StatusChip } from '../atoms/StatusChip';
import { getBodyClasses } from '../tokens/typography';
import { animations } from '../tokens/animations';

interface BlockchainTransaction {
  id: string;
  hash: string;
  timestamp: string;
  type: 'collection' | 'disposal' | 'recycling';
  location: string;
  weight: number;
  verified: boolean;
  confirmations: number;
}

interface BlockchainVerifierProps {
  transactions: BlockchainTransaction[];
  animated?: boolean;
  className?: string;
}

export function BlockchainVerifier({
  transactions,
  animated = true,
  className = ''
}: BlockchainVerifierProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'collection': return '🚛';
      case 'disposal': return '🗑️';
      case 'recycling': return '♻️';
      default: return '📦';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'collection': return 'text-primary-600';
      case 'disposal': return 'text-warning-600';
      case 'recycling': return 'text-success-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <motion.div
      {...(animated ? animations.presets.fadeIn : {})}
      className={className}
    >
      <CollectamCard variant="info" padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <CollectamHeading level="h3" animated={false}>
            Vérification Blockchain
          </CollectamHeading>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-secondary-500"
          >
            🔗
          </motion.div>
        </div>
        
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-secondary-50/30 rounded-lg border border-secondary-200/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getTypeIcon(transaction.type)}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Transaction #{transaction.id}
                    </h4>
                    <p className={`${getBodyClasses('small')} ${getTypeColor(transaction.type)}`}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} - {transaction.weight}kg
                    </p>
                  </div>
                </div>
                
                <p className={`${getBodyClasses('small')} mb-2`}>
                  📍 {transaction.location}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Hash: {transaction.hash.substring(0, 16)}...</span>
                  <span>{transaction.timestamp}</span>
                  <span>{transaction.confirmations} confirmations</span>
                </div>
              </div>
              
              <div className="ml-4">
                <StatusChip 
                  status={transaction.verified ? 'completed' : 'scheduled'} 
                >
                  {transaction.verified ? 'Vérifié' : 'En attente'}
                </StatusChip>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-success-50 border border-success-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span className="text-success-600">✓</span>
            <p className="text-sm text-success-800">
              Toutes les transactions sont sécurisées et vérifiées sur la blockchain Ethereum
            </p>
          </div>
        </motion.div>
      </CollectamCard>
    </motion.div>
  );
}
