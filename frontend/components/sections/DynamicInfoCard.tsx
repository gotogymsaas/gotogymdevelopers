import React, { useState } from 'react';

interface DynamicInfoCardProps {
  title: string;
  value: string | number;
  description?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  icon?: string;
  expandable?: boolean;
  expandedContent?: React.ReactNode;
}

export const DynamicInfoCard: React.FC<DynamicInfoCardProps> = ({
  title,
  value,
  description,
  status = 'info',
  icon,
  expandable = false,
  expandedContent,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusClasses = {
    success: 'gtg-card-success',
    warning: 'gtg-card-warning',
    error: 'gtg-card-error',
    info: 'gtg-card-info',
  };

  return (
    <div className={`gtg-dynamic-card ${statusClasses[status]}`}>
      <div className="gtg-dynamic-card-header">
        {icon && <span className="gtg-dynamic-card-icon">{icon}</span>}
        <h3 className="gtg-dynamic-card-title">{title}</h3>
        {expandable && (
          <button
            className="gtg-dynamic-card-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? '−' : '+'}
          </button>
        )}
      </div>

      <div className="gtg-dynamic-card-value">{value}</div>

      {description && (
        <p className="gtg-dynamic-card-description">{description}</p>
      )}

      {expandable && isExpanded && expandedContent && (
        <div className="gtg-dynamic-card-expanded">
          {expandedContent}
        </div>
      )}
    </div>
  );
};