interface StatCardProps {
  label: string;
  value: number | string;
  icon?: string;
  primaryColor?: string;
  trend?: number;
  trendLabel?: string;
  variant?: 'default' | 'admin' | 'dashboard';
  borderColor?: string;
}

export function StatCard({ 
  label, 
  value, 
  icon, 
  primaryColor = '#515922',
  trend,
  trendLabel,
  variant = 'default',
  borderColor
}: StatCardProps) {
  const isPositiveTrend = trend && trend > 0;

  // Admin variant: border-based styling
  if (variant === 'admin') {
    return (
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm">{label}</p>
            <p className="text-3xl font-bold text-slate-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          </div>
          {icon && (
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
              style={{ backgroundColor: primaryColor }}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Dashboard variant: colored left border with trend
  if (variant === 'dashboard') {
    return (
      <div className="bg-white rounded-xl p-6 border-l-4 shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: borderColor || primaryColor }}>
        <p className="text-sm font-medium text-[#6f7f6d] mb-2">{label}</p>
        <p className="text-3xl md:text-4xl font-bold text-[#37413d]">{value}</p>
        
        {trend !== undefined && trendLabel && (
          <div className={`mt-3 flex items-center gap-1 text-sm font-medium ${
            isPositiveTrend ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{isPositiveTrend ? '↑' : '↓'} {Math.abs(trend)}%</span>
            <span className="text-[#6f7f6d]">vs {trendLabel}</span>
          </div>
        )}
      </div>
    );
  }

  // Default variant: minimal styling
  return (
    <div className="bg-stone-100 rounded-2xl p-8 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-3">{label}</p>
          <p className="text-3xl font-bold text-slate-700">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
        {icon && (
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ml-4"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
