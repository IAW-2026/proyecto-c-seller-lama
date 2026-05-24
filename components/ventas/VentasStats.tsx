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
    accent: '#5a8a5e',
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
    accent: '#a06060',
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="
            group relative rounded-2xl border border-[#d8cfbd]/80
            bg-white/70 backdrop-blur-sm
            p-5 md:p-6
            shadow-[0_2px_12px_rgba(55,65,61,0.06)]
            transition-all duration-400 ease-out
            hover:-translate-y-0.5
            hover:shadow-[0_8px_24px_rgba(55,65,61,0.12)]
            hover:border-[#8fa18d]/30
          "
        >
          {/* Icon */}
          <div
            className="
              w-9 h-9 rounded-xl flex items-center justify-center
              mb-4 transition-transform duration-400 group-hover:scale-110
            "
            style={{
              backgroundColor: card.accent + '18',
              color: card.accent,
            }}
          >
            {card.icon}
          </div>

          {/* Label */}
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#6f7f6d] font-semibold mb-2">
            {card.label}
          </p>

          {/* Value */}
          <p className="text-2xl md:text-3xl font-bold text-[#37413d] leading-none mb-3">
            {card.format === 'number'
              ? (card.value as number).toLocaleString('es-AR')
              : card.value}
          </p>

          {/* Trend hint */}
          <span className="text-[10px] font-medium text-[#8fa18d] tracking-wide">
            {card.hint}
          </span>
        </div>
      ))}
    </div>
  );
}