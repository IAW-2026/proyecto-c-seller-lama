interface VentasStatsProps {
  totalVentas: number;
  totalIngresos: number;
  ventasPendientes: number;
  ventasCompletas: number;
  ventasCanceladas: number;
}

const stats = (props: VentasStatsProps) => [
  {
    label: 'Total de ventas',
    value: props.totalVentas,
    format: 'number' as const,
    hint: props.totalVentas === 1
      ? '1 orden registrada'
      : `${props.totalVentas} órdenes registradas`,
    accent: '#8fa18d',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 17l5-5 4 4 7-7" />
        <path d="M20 7v6h-6" />
      </svg>
    ),
  },
  {
    label: 'Ingresos',
    value: `$${Math.round(props.totalIngresos).toLocaleString('es-AR')}`,
    format: 'string' as const,
    hint: 'Total aprobado',
    accent: '#8fa18d',
    featured: true,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" />
        <path d="M17 7.5c-.8-1.2-2.3-2-4.2-2H10.5a3 3 0 000 6h3a3 3 0 010 6H11c-1.9 0-3.4-.8-4.2-2" />
      </svg>
    ),
  },
  {
    label: 'Pendientes',
    value: props.ventasPendientes,
    format: 'number' as const,
    hint: props.ventasPendientes === 0
      ? 'Sin pendientes'
      : 'Requieren seguimiento',
    accent: '#c49a3c',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    label: 'Completadas',
    value: props.ventasCompletas,
    format: 'number' as const,
    hint: props.ventasCompletas === 0
      ? 'Sin completadas aún'
      : 'Finalizadas correctamente',
    accent: '#6f7f6d',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l2.5 2.5L16 9" />
      </svg>
    ),
  },
  {
    label: 'Canceladas',
    value: props.ventasCanceladas,
    format: 'number' as const,
    hint: props.ventasCanceladas === 0
      ? 'Sin impacto activo'
      : `${props.ventasCanceladas} cancelada${props.ventasCanceladas > 1 ? 's' : ''}`,
    accent: '#a07060',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9l6 6" />
        <path d="M15 9l-6 6" />
      </svg>
    ),
  },
];

export function VentasStats(props: VentasStatsProps) {
  const cards = stats(props);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 mb-8">
      {cards.map((card, index) => {
        const isFeatured = 'featured' in card && card.featured;

        return (
          <div
            key={card.label}
            className={`
              group relative rounded-2xl
              bg-[#faf7f0]
              border border-[#e4ddd0]/70
              p-5 md:p-6
              transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
              hover:-translate-y-1
              hover:shadow-[0_12px_40px_rgba(111,127,109,0.12),0_4px_16px_rgba(55,65,61,0.06)]
              ${isFeatured
                ? 'shadow-[0_6px_28px_rgba(143,161,141,0.12),0_2px_8px_rgba(55,65,61,0.05)] border-[#8fa18d]/25'
                : 'shadow-[0_4px_20px_rgba(111,127,109,0.07),0_1px_4px_rgba(55,65,61,0.04)]'
              }
            `}
            style={{
              animation: `cardReveal 0.5s ease-out ${index * 0.07}s both`,
            }}
          >
            {/* Subtle warm inner glow for featured card */}
            {isFeatured && (
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#8fa18d]/[0.04] blur-3xl pointer-events-none" />
            )}

            {/* Icon container */}
            <div
              className="
                relative w-10 h-10 rounded-xl flex items-center justify-center
                mb-5 transition-transform duration-500
                group-hover:scale-105
              "
              style={{
                backgroundColor: card.accent + '12',
                color: card.accent,
              }}
            >
              {card.icon}
            </div>

            {/* Label — editorial uppercase tracking like hero eyebrow */}
            <p className="text-[10px] uppercase tracking-[0.28em] font-semibold text-[#8fa18d] mb-3">
              {card.label}
            </p>

            {/* Value — large, bold protagonist */}
            <p
              className={`
                font-bold leading-none text-[#37413d] mb-3
                ${isFeatured
                  ? 'text-[1.85rem] md:text-[2.2rem] tracking-tight'
                  : 'text-[1.65rem] md:text-[2rem] tracking-tight'
                }
              `}
            >
              {card.format === 'number'
                ? (card.value as number).toLocaleString('es-AR')
                : card.value}
            </p>

            {/* Accent divider — like hero eyebrow line */}
            <div className="flex items-center gap-2.5 mb-0">
              <span
                className="block h-px w-6 transition-all duration-500 group-hover:w-9"
                style={{ backgroundColor: card.accent + '40' }}
              />
              <span
                className="text-[10px] font-medium tracking-wide"
                style={{ color: card.accent }}
              >
                {card.hint}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}