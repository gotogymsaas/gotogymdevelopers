import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { HeartRateTrendPoint } from '../../types/types';

interface HeartRateChartProps {
  data: HeartRateTrendPoint[];
}

export const HeartRateChart: React.FC<HeartRateChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            fontSize: 12,
            boxShadow: '0 6px 18px rgba(15, 23, 42, 0.12)',
          }}
          labelStyle={{ color: '#334155', fontWeight: 600 }}
          formatter={(value: number) => [`${value} bpm`, 'Ritmo cardiaco']}
        />
        <Line
          type="monotone"
          dataKey="bpm"
          stroke="#ef4444"
          strokeWidth={2.5}
          dot={{ r: 2, fill: '#ef4444' }}
          activeDot={{ r: 4, fill: '#dc2626' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
