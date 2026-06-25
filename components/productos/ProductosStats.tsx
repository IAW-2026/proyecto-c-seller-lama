import type { Producto } from '@/types';

interface ProductosStatsProps {
  productos: (Producto & { categoria_nombre: string })[];
}

export function ProductosStats({ productos }: ProductosStatsProps) {
  const total = productos.length;
  const activos = productos.filter((p) => p.estado_publicacion === 'activa').length;
  const vendidos = productos.filter((p) => p.estado_publicacion === 'vendida').length;
  const inactivos = productos.filter((p) => p.estado_publicacion === 'inactiva').length;

  const cards = [
    {
      label: 'Total productos',
      value: total,
      hint: total === 1 ? '1 artículo en catálogo' : `${total} artículos en catálogo`,
      accent: '#8fa18d',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
    },
    {
      label: 'Activos',
      value: activos,
      hint: activos === 0 ? 'Sin publicaciones activas' : 'Publicados y visibles',
      accent: '#5a8a5e',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12l2.5 2.5L16 9" />
        </svg>
      ),
    },
    {
      label: 'Vendidos',
      value: vendidos,
      hint: vendidos === 0 ? 'Sin ventas registradas' : `${vendidos} vendido${vendidos > 1 ? 's' : ''}`,
      accent: '#6b7fb5',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
    },
    {
      label: 'Inactivos',
      value: inactivos,
      hint: inactivos === 0 ? 'Todo publicado' : 'Ocultos del catálogo',
      accent: '#a09080',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
          <path d="M8 15s1.5-2 4-2 4 2 4 2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            {card.value.toLocaleString('es-AR')}
          </p>

          {/* Hint */}
          <span className="text-[10px] font-medium text-[#8fa18d] tracking-wide">
            {card.hint}
          </span>
        </div>
      ))}
    </div>
  );
}
