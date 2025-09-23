"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  title?: string;
  centerText?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { width: 200, height: 200, innerRadius: 40, outerRadius: 80 },
  md: { width: 300, height: 300, innerRadius: 60, outerRadius: 120 },
  lg: { width: 400, height: 400, innerRadius: 80, outerRadius: 160 }
};

export function DonutChart({ data, title, centerText, size = 'md' }: DonutChartProps) {
  const { width, height, innerRadius, outerRadius } = SIZES[size];
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Valeur: <span className="font-medium">{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCenterText = () => {
    if (!centerText) return null;
    
    return (
      <text 
        x="50%" 
        y="50%" 
        textAnchor="middle" 
        dominantBaseline="middle" 
        className="fill-foreground font-semibold text-lg"
      >
        {centerText}
      </text>
    );
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry: any) => (
              <span style={{ color: entry.color }} className="text-sm">
                {value}
              </span>
            )}
          />
          {renderCenterText()}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
