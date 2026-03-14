import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickActionCard = ({ title, description, icon, color = "primary", onClick, badge }) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: "bg-primary/10 text-primary border-primary/20",
      success: "bg-success/10 text-success border-success/20",
      warning: "bg-warning/10 text-warning border-warning/20",
      error: "bg-error/10 text-error border-error/20"
    };
    return colors?.[colorType] || colors?.primary;
  };

  const getHoverClasses = (colorType) => {
    const colors = {
      primary: "hover:bg-primary/20 hover:border-primary/30",
      success: "hover:bg-success/20 hover:border-success/30", 
      warning: "hover:bg-warning/20 hover:border-warning/30",
      error: "hover:bg-error/20 hover:border-error/30"
    };
    return colors?.[colorType] || colors?.primary;
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-6 border rounded-lg transition-all duration-150 micro-interaction text-left ${getColorClasses(color)} ${getHoverClasses(color)}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name={icon} size={24} />
            {badge && (
              <span className="px-2 py-0.5 bg-card text-foreground text-xs font-medium rounded-full border border-border">
                {badge}
              </span>
            )}
          </div>
          <h4 className="font-semibold text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Icon name="ArrowRight" size={16} className="text-muted-foreground ml-4 mt-1" />
      </div>
    </button>
  );
};

export default QuickActionCard;