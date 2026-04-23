import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { SleepPhaseDatum } from '../../types/types';
import { SleepLegend } from './SleepLegend';

interface SleepChartProps {
  data: SleepPhaseDatum[];
}

export const SleepChart: React.FC<SleepChartProps> = ({ data }) => {
  const legendItems = [
    { color: '#60a5fa', label: 'Sueno ligero' },
    { color: '#2563eb', label: 'Sueno profundo' },
    { color: '#8b5cf6', label: 'REM' },
  ];

  return (
    <div className="gtg-sleep-chart-layout">
      <div className="gtg-sleep-chart-canvas">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="hours"
              nameKey="phase"
              cx="50%"
              cy="50%"
              outerRadius={76}
              innerRadius={42}
              paddingAngle={2}
            >
              {data.map(item => (
                <Cell key={item.phase} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 12,
                boxShadow: '0 6px 18px rgba(15, 23, 42, 0.12)',
              }}
              formatter={(value: number) => [`${value.toFixed(1)} h`, 'Duracion']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <SleepLegend items={legendItems} />
    </div>
  );
};
