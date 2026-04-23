import React from 'react';

interface SleepLegendItem {
  color: string;
  label: string;
}

interface SleepLegendProps {
  items?: SleepLegendItem[];
}

const defaultLegendItems: SleepLegendItem[] = [
  { color: '#60a5fa', label: 'Sueno ligero' },
  { color: '#2563eb', label: 'Sueno profundo' },
  { color: '#8b5cf6', label: 'REM' },
];

export const SleepLegend: React.FC<SleepLegendProps> = ({ items = defaultLegendItems }) => {
  return (
    <aside className="gtg-sleep-legend" aria-label="Fases de sueno">
      {items.map(item => (
        <div className="gtg-sleep-legend-item" key={item.label}>
          <span className="gtg-sleep-legend-dot" style={{ backgroundColor: item.color }} aria-hidden="true" />
          <span>{item.label}</span>
        </div>
      ))}
    </aside>
  );
};