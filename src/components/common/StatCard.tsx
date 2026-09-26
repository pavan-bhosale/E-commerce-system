import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtext?: string;
  icon?: React.ReactNode;
  sparklineColor?: 'blue' | 'green' | 'amber' | 'rose' | 'navy';
  onClick?: () => void;
  badge?: string;
  isHero?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  subtext,
  icon,
  sparklineColor = 'blue',
  onClick,
  badge,
  isHero = false
}) => {
  // Sparkline paths
  const getSparklineSvg = (type: string) => {
    switch (type) {
      case 'green':
        return (
          <svg className="w-20 h-9" viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 28C14 26 22 34 34 22C46 10 56 18 78 4"
              stroke="#10b981"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'rose':
        return (
          <svg className="w-20 h-9" viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 8C16 12 24 6 36 20C48 34 58 24 78 32"
              stroke="#ef4444"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'amber':
        return (
          <svg className="w-20 h-9" viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 18C15 22 25 12 38 16C50 20 62 10 78 14"
              stroke="#f59e0b"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-20 h-9" viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 24C16 20 26 28 40 14C52 4 60 16 78 8"
              stroke="#3b82f6"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  if (isHero) {
    return (
      <div
        onClick={onClick}
        className={`card-navy-hero p-4 sm:p-6 transition-all duration-200 select-none relative overflow-hidden group ${
          onClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-0.5' : ''
        }`}
      >
        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10 mb-3 sm:mb-4 gap-2">
          <div>
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-300 font-medium">
              {title}
            </span>
            <div className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-0.5 sm:mt-1 tracking-tight font-sans">
              {value}
            </div>
          </div>
          {badge && (
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-amber-400/20 text-amber-300 border border-amber-400/30 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {badge}
            </span>
          )}
        </div>

        {/* Hero Area / Wave curve */}
        <div className="relative z-10 pt-2 flex items-end justify-between border-t border-white/10 mt-2 sm:mt-3">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-300">
            {change && (
              <span className="text-emerald-400 font-semibold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                {change}
              </span>
            )}
            <span className="truncate max-w-[160px] sm:max-w-none">{subtext || 'Active order pipeline'}</span>
          </div>
          {icon && <div className="text-slate-300 group-hover:text-white transition-colors">{icon}</div>}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`card-soft p-3.5 sm:p-5 transition-all duration-200 select-none ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
          {title}
        </span>
        {icon && (
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-0.5">
        <div className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1 text-xs">
          {change && (
            <span
              className={`font-semibold flex items-center ${
                changeType === 'positive'
                  ? 'text-emerald-600'
                  : changeType === 'negative'
                  ? 'text-rose-600'
                  : 'text-slate-600'
              }`}
            >
              {changeType === 'positive' ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : changeType === 'negative' ? (
                <ArrowDownRight className="w-3.5 h-3.5" />
              ) : null}
              {change}
            </span>
          )}
          {subtext && <span className="text-slate-400 text-[11px] truncate max-w-[110px]">{subtext}</span>}
        </div>

        {/* Mini Sparkline Chart */}
        <div className="flex-shrink-0">
          {getSparklineSvg(sparklineColor)}
        </div>
      </div>
    </div>
  );
};
