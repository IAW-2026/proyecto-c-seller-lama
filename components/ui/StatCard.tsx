interface StatCardProps {
  label: string;
  value: number;
  icon?: string;
  primaryColor?: string;
}

export function StatCard({ label, value, icon, primaryColor = '#515922' }: StatCardProps) {
  return (
    <div className="bg-stone-100 rounded-2xl p-8 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-3">{label}</p>
          <p className="text-3xl font-bold text-slate-700">{value.toLocaleString()}</p>
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
