import Link from 'next/link';

interface QuickActionCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  primaryColor: string;
}

export function QuickActionCard({ href, icon, title, description, primaryColor }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <div 
        className="bg-white border-2 border-slate-200 rounded-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-slate-900 hover:bg-slate-50"
      >
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mb-4"
          style={{ backgroundColor: primaryColor }}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600 mt-2">
          {description}
        </p>
      </div>
    </Link>
  );
}
