import React from 'react';

interface CardMetricProps {
  title: string;
  value: string;
  note: string;
  icon?: React.ReactNode;
}

export const CardMetric: React.FC<CardMetricProps> = ({ title, value, note, icon }) => {
  return (
    <article className="gtg-health-card">
      <div className="gtg-health-card-head">
        <h3 className="gtg-health-card-title">{title}</h3>
        {icon && <span className="gtg-health-card-icon">{icon}</span>}
      </div>
      <p className="gtg-health-card-value">{value}</p>
      <p className="gtg-health-card-note">{note}</p>
    </article>
  );
};