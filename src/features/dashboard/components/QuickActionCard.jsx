import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickActionCard = ({ title, description, icon, color = "primary", onClick, badge }) => {
  const getColorConfig = (colorType) => {
    const configs = {
      primary: {
        iconColor: "text-blue-600",
        iconContainer: "bg-blue-50",
        badgeBg: "bg-blue-500",
        accent: "bg-blue-600"
      },
      success: {
        iconColor: "text-emerald-600",
        iconContainer: "bg-emerald-50",
        badgeBg: "bg-emerald-500",
        accent: "bg-emerald-600"
      },
      warning: {
        iconColor: "text-amber-600",
        iconContainer: "bg-amber-50",
        badgeBg: "bg-amber-500",
        accent: "bg-amber-600"
      },
      error: {
        iconColor: "text-rose-600",
        iconContainer: "bg-rose-50",
        badgeBg: "bg-rose-500",
        accent: "bg-rose-600"
      }
    };
    return configs[colorType] || configs.primary;
  };

  const config = getColorConfig(color);

  return (
    <button
      onClick={onClick}
      className="group relative w-full p-6 bg-white border border-slate-100 rounded-none transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 active:translate-y-0 active:shadow-none text-left overflow-hidden shadow-sm"
    >
      <div className="relative z-10 space-y-5">
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 flex items-center justify-center rounded-none transition-all duration-300 group-hover:scale-110 ${config.iconContainer} ${config.iconColor}`}>
            <Icon name={icon} size={24} strokeWidth={2} />
          </div>
          {badge && (
            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded-none ${config.badgeBg}`}>
              {badge}
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          <h4 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed opacity-80">
            {description}
          </p>
        </div>

        <div className="pt-2 flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 transition-colors">
          <span>Initialize</span>
          <Icon name="ArrowRight" size={12} className="transition-transform group-hover:translate-x-1" strokeWidth={3} />
        </div>
      </div>

      {/* Subtle corner accent - Changed to square logic */}
      <div className={`absolute bottom-0 right-0 w-8 h-8 ${config.iconContainer} opacity-20 transition-all duration-500 group-hover:scale-150`}></div>
    </button>
  );
};

export default QuickActionCard;