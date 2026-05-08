interface DataTableContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function DataTableContainer({ 
  title, 
  description, 
  children,
  action
}: DataTableContainerProps) {
  return (
    <div className="bg-white border border-[#8fa18d]/10 rounded-xl overflow-hidden hover:border-[#8fa18d]/20 transition-colors">
      {/* Header */}
      <div className="px-6 md:px-8 py-6 border-b border-[#8fa18d]/10 flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-[#37413d]">
            {title}
          </h3>
          {description && (
            <p className="text-[#6f7f6d] text-sm mt-1">
              {description}
            </p>
          )}
        </div>
        
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 md:px-8 py-6 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
