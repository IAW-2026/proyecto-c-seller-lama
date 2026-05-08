interface DataTableContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  primaryColor?: string;
}

export function DataTableContainer({ 
  title, 
  subtitle, 
  children, 
  primaryColor = '#515922' 
}: DataTableContainerProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900" style={{ color: primaryColor }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-slate-600 text-sm mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {children}
      </div>
    </div>
  );
}
