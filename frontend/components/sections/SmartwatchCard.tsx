import React from 'react';
import type { SmartwatchDetailItem, SmartwatchMetric, SmartwatchMetricDetail } from '../../types/types';

interface SmartwatchCardProps {
  metric: SmartwatchMetric;
  detail: SmartwatchMetricDetail;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const getToneClass = (item: SmartwatchDetailItem): string => {
  switch (item.tone) {
    case 'good':
      return 'is-good';
    case 'warning':
      return 'is-warning';
    case 'danger':
      return 'is-danger';
    case 'info':
      return 'is-info';
    default:
      return 'is-normal';
  }
};

export const SmartwatchCard: React.FC<SmartwatchCardProps> = ({
  metric,
  detail,
  icon,
  isOpen,
  onToggle,
}) => {
  return (
    <article className={`gtg-smartwatch-card${isOpen ? ' is-expanded' : ''}`}>
      <button
        type="button"
        className="gtg-smartwatch-card-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? 'Contraer' : 'Expandir'} ${metric.title}`}
      >
        <div className="gtg-smartwatch-card-head">
          <h3 className="gtg-smartwatch-card-title">{metric.title}</h3>
          {icon && <span className="gtg-smartwatch-card-icon">{icon}</span>}
        </div>

        <div className="gtg-smartwatch-card-summary">
          <p className="gtg-smartwatch-card-value">{metric.value}</p>
          <p className="gtg-smartwatch-card-note">{metric.note}</p>
        </div>

        <span className="gtg-smartwatch-card-chevron" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      <div className="gtg-smartwatch-card-expand">
        <div className="gtg-smartwatch-card-expand-inner">
          {isOpen && detail.sections.map((section, sectionIndex) => (
            <section className="gtg-smartwatch-detail-section" key={`${section.title}-${sectionIndex}`}>
              <h4 className="gtg-smartwatch-detail-title">{section.title}</h4>
              <ul className="gtg-smartwatch-detail-list">
                {section.items.map((item, itemIndex) => (
                  <li className="gtg-smartwatch-detail-item" key={`${item.label}-${itemIndex}`}>
                    <span className="gtg-smartwatch-detail-label">{item.label}</span>
                    <span className={`gtg-smartwatch-detail-value ${getToneClass(item)}`}>{item.value}</span>
                  </li>
                ))}
              </ul>
              {section.note && <p className="gtg-smartwatch-detail-note">{section.note}</p>}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
};
