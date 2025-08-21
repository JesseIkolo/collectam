'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CollectamCard } from '../atoms/CollectamCard';
import { CollectamHeading } from '../atoms/CollectamHeading';
import { motion } from 'framer-motion';
import { animations } from '../tokens/animations';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface WasteAnalyticsChartProps {
  title: string;
  data: ChartData[];
  type?: 'line' | 'bar';
  color?: string;
  animated?: boolean;
  className?: string;
}

export function WasteAnalyticsChart({
  title,
  data,
  type = 'line',
  color = '#22c55e',
  animated = true,
  className = ''
}: WasteAnalyticsChartProps) {
  const ChartComponent = type === 'line' ? LineChart : BarChart;
  
  const renderChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <ChartComponent data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        />
        {type === 'line' ? (
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        ) : (
          <Bar 
            dataKey="value" 
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        )}
      </ChartComponent>
    </ResponsiveContainer>
  );

  return (
    <motion.div
      {...(animated ? animations.presets.scaleIn : {})}
      className={className}
    >
      <CollectamCard variant="info" padding="lg">
        <CollectamHeading level="h4" className="mb-6" animated={false}>
          {title}
        </CollectamHeading>
        {renderChart()}
      </CollectamCard>
    </motion.div>
  );
}
