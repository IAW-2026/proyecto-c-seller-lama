interface PageHeaderProps {
  title: string;
  subtitle?: string;
  primaryColor?: string;
}

export function PageHeader({ title, subtitle, primaryColor = '#515922' }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-2 text-slate-900" style={{ color: primaryColor }}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-slate-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}
