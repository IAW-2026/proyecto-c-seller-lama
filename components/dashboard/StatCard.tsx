interface StatCardProps {
  label: string;
  value: number | string;
  trend?: number;
  trendLabel?: string;
}

export function StatCard({ 
  label, 
  value, 
  trend,
  trendLabel
}: StatCardProps) {
  const isPositiveTrend = trend && trend > 0;

  return (
    <div className="bg-white rounded-xl p-6 border border-[#8fa18d]/10 hover:shadow-md transition-shadow">
      <div>
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
    </div>
  );
}
