/*
Componente reutilizable para mostrar métricas,
estadísticas y KPIs en vistas administrativas.
Soporta múltiples variantes visuales según el contexto de uso.
*/

import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  primaryColor?: string;
  trend?: number;
  trendLabel?: string;
  variant?: 'default' | 'admin' | 'soft';
  borderColor?: string;
}

export function StatCard({
  label,
  value,
  icon,
  primaryColor = '#8fa18d',
  trend,
  trendLabel,
  variant = 'default',
  borderColor,
}: StatCardProps) {
  const isPositiveTrend = trend && trend > 0;
  const formattedValue =
    typeof value === 'number' ? value.toLocaleString('es-AR') : value;

  if (variant === 'admin') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#6f7f6d] text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold text-[#37413d] mt-2">
              {formattedValue}
            </p>
          </div>

          {icon && (
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'soft') {
    const accent = borderColor || primaryColor;

    return (
      <div className="group rounded-2xl border border-[#d8cfbd] bg-[#f4efe4] p-6 shadow-[0_8px_18px_rgba(55,65,61,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ede6d8] hover:shadow-[0_12px_26px_rgba(55,65,61,0.14)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-[#6f7f6d] font-semibold mb-4">
              {label}
            </p>

            <p className="text-4xl md:text-[2.6rem] font-bold text-[#37413d] leading-none">
              {formattedValue}
            </p>
          </div>

          {icon && (
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center border shadow-sm transition-all duration-300 group-hover:scale-105"
              style={{
                backgroundColor: '#8fa18d',
                borderColor: '#7a8c78',
                color: '#ffffff',
                boxShadow: '0 6px 14px rgba(55, 65, 61, 0.18)',
              }}
              aria-hidden
            >
              {icon}
            </div>
          )}
        </div>

        {trend !== undefined && trendLabel && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#d8cfbd] bg-[#f6f1e7] px-3 py-1 text-xs font-medium">
            <span
              style={{
                color: isPositiveTrend ? '#6f7f6d' : '#8a5f5f',
              }}
            >
              {isPositiveTrend ? '↑' : '↓'} {Math.abs(trend)}%
            </span>

            <span className="text-[#6f7f6d]">vs {trendLabel}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#ede6d8] rounded-2xl p-8 shadow-sm border border-[#d8cfbd]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[#6f7f6d] text-sm font-medium mb-3">{label}</p>
          <p className="text-3xl font-bold text-[#37413d]">
            {formattedValue}
          </p>
        </div>

        {icon && (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ml-4 text-white"
            style={{ backgroundColor: primaryColor }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}