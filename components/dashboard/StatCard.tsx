interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  primaryColor: string;
}

export function StatCard({ label, value, icon, primaryColor }: StatCardProps) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm">{label}</p>
          <p className="text-4xl font-bold text-slate-900">{value}</p>
        </div>
        <div 
          className="w-14 h-14 rounded-lg flex items-center justify-center text-white text-2xl"
          style={{ backgroundColor: primaryColor }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
