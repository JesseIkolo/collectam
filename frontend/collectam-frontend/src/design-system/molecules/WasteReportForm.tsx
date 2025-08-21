'use client';

import { useState } from 'react';
import { Input, Textarea, Select, SelectItem } from '@heroui/react';
import { CollectamCard } from '../atoms/CollectamCard';
import { CollectamHeading } from '../atoms/CollectamHeading';
import { CollectamButton } from '../atoms/CollectamButton';
import { StatusChip } from '../atoms/StatusChip';
import { motion } from 'framer-motion';
import { animations } from '../tokens/animations';

interface WasteReportData {
  location: string;
  wasteType: string;
  quantity: string;
  urgency: 'low' | 'medium' | 'high';
  description: string;
  reporterName: string;
  reporterPhone: string;
}

interface WasteReportFormProps {
  onSubmit?: (data: WasteReportData) => void;
  animated?: boolean;
  className?: string;
}

export function WasteReportForm({
  onSubmit,
  animated = true,
  className = ''
}: WasteReportFormProps) {
  const [formData, setFormData] = useState<WasteReportData>({
    location: '',
    wasteType: '',
    quantity: '',
    urgency: 'medium',
    description: '',
    reporterName: '',
    reporterPhone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const wasteTypes = [
    { key: 'organic', label: 'Déchets organiques' },
    { key: 'plastic', label: 'Plastique' },
    { key: 'paper', label: 'Papier/Carton' },
    { key: 'glass', label: 'Verre' },
    { key: 'metal', label: 'Métal' },
    { key: 'electronic', label: 'Électronique' },
    { key: 'hazardous', label: 'Dangereux' },
    { key: 'other', label: 'Autre' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit?.(formData);
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      location: '',
      wasteType: '',
      quantity: '',
      urgency: 'medium',
      description: '',
      reporterName: '',
      reporterPhone: '',
    });
  };

  const updateField = (field: keyof WasteReportData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      {...(animated ? animations.presets.fadeIn : {})}
      className={className}
    >
      <CollectamCard variant="info" padding="lg">
        <CollectamHeading level="h3" className="mb-6" animated={false}>
          Signaler des Déchets
        </CollectamHeading>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Localisation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Input
              label="Localisation"
              placeholder="Adresse ou point de repère"
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
              required
              radius="lg"
              classNames={{
                input: "bg-white dark:bg-gray-800",
                inputWrapper: "border-gray-300 dark:border-gray-600"
              }}
            />
          </motion.div>

          {/* Type de déchets et quantité */}
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Select
                label="Type de déchets"
                placeholder="Sélectionner le type"
                selectedKeys={formData.wasteType ? [formData.wasteType] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  updateField('wasteType', selected);
                }}
                required
                radius="lg"
              >
                {wasteTypes.map((type) => (
                  <SelectItem key={type.key}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Input
                label="Quantité estimée"
                placeholder="Ex: 2 sacs, 50kg, etc."
                value={formData.quantity}
                onChange={(e) => updateField('quantity', e.target.value)}
                required
                radius="lg"
              />
            </motion.div>
          </div>

          {/* Urgence */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Niveau d'urgence
              </label>
              <div className="flex gap-3">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateField('urgency', level)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      formData.urgency === level
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <StatusChip
                      status={level === 'high' ? 'error' : level === 'medium' ? 'scheduled' : 'completed'}
                      animated={false}
                    >
                      {level === 'high' ? 'Urgent' : level === 'medium' ? 'Moyen' : 'Faible'}
                    </StatusChip>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Textarea
              label="Description (optionnel)"
              placeholder="Détails supplémentaires sur les déchets..."
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              radius="lg"
            />
          </motion.div>

          {/* Informations du rapporteur */}
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Input
                label="Votre nom"
                placeholder="Nom complet"
                value={formData.reporterName}
                onChange={(e) => updateField('reporterName', e.target.value)}
                required
                radius="lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Input
                label="Téléphone"
                placeholder="+XXX XXX XXX XXX"
                value={formData.reporterPhone}
                onChange={(e) => updateField('reporterPhone', e.target.value)}
                required
                radius="lg"
              />
            </motion.div>
          </div>

          {/* Bouton de soumission */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-end"
          >
            <CollectamButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="min-w-[200px]"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Signaler les déchets'}
            </CollectamButton>
          </motion.div>
        </form>
      </CollectamCard>
    </motion.div>
  );
}
