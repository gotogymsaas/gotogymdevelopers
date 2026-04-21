import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ActivitySummaryDatum } from '../../types/types';

interface ActivityChartProps {
  data: ActivitySummaryDatum[];
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            fontSize: 12,
            boxShadow: '0 6px 18px rgba(15, 23, 42, 0.12)',
          }}
          formatter={(value: number, _name: string, payload: { payload: ActivitySummaryDatum }) => [
            `${value.toLocaleString('es-ES')} ${payload.payload.unit}`,
            payload.payload.metric,
          ]}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map(item => (
            <Cell key={item.metric} fill={item.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
