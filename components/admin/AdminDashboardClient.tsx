'use client';

import { useState, useEffect } from 'react';

interface MetricCard {
  label: string;
  value: string | number;
  hint: string;
  accent: string;
  icon: React.ReactNode;
}

interface AdminDashboardClientProps {
  stats: {
    totalVendedores: number;
    totalProductos: number;
    totalOrdenes: number;
    totalIngresos: number;
    totalPendientes: number;
  };
  vendedoresTable: React.ReactNode;
  productosTable: React.ReactNode;
  ordenesTable: React.ReactNode;
}

type TabType = 'vendedores' | 'productos' | 'ordenes';

export function AdminDashboardClient({
  stats,
  vendedoresTable,
  productosTable,
  ordenesTable,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('vendedores');

  // Sync with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'productos' || hash === 'ordenes' || hash === 'vendedores') {
        setActiveTab(hash as TabType);
      }
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeTab = (tab: TabType) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const metricCards: MetricCard[] = [
    {
      label: 'Vendedores',
      value: stats.totalVendedores,
      hint: '↑ 12% este mes',
      accent: '#8fa18d',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      label: 'Productos',
      value: stats.totalProductos,
      hint: '↑ 8% este mes',
      accent: '#8fa18d',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
    },
    {
      label: 'Órdenes',
      value: stats.totalOrdenes,
      hint: '↑ 15% este mes',
      accent: '#8fa18d',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        </svg>
      ),
    },
    {
      label: 'Ingresos Totales',
      value: `$${Math.round(stats.totalIngresos).toLocaleString('es-AR')}`,
      hint: '↑ 18% este mes',
      accent: '#8fa18d',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
    },
    {
      label: 'Pendientes',
      value: stats.totalPendientes,
      hint: 'Requieren atención',
      accent: '#c49a3c',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {metricCards.map((card) => (
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
              {card.value}
            </p>

            {/* Hint */}
            <span
              className={`text-[10px] font-medium tracking-wide ${
                card.accent === '#c49a3c' ? 'text-[#c49a3c]' : 'text-[#8fa18d]'
              }`}
            >
              {card.hint}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-[#d8cfbd]/60 mb-6 gap-1 md:gap-2">
        <button
          onClick={() => changeTab('vendedores')}
          className={`
            flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-300 border-b-2 -mb-[2px]
            ${
              activeTab === 'vendedores'
                ? 'border-[#8fa18d] text-[#37413d] bg-white/40 rounded-t-xl'
                : 'border-transparent text-[#6f7f6d] hover:text-[#37413d] hover:bg-[#ede6d8]/30 rounded-t-xl'
            }
          `}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          Vendedores
        </button>

        <button
          onClick={() => changeTab('productos')}
          className={`
            flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-300 border-b-2 -mb-[2px]
            ${
              activeTab === 'productos'
                ? 'border-[#8fa18d] text-[#37413d] bg-white/40 rounded-t-xl'
                : 'border-transparent text-[#6f7f6d] hover:text-[#37413d] hover:bg-[#ede6d8]/30 rounded-t-xl'
            }
          `}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          Productos
        </button>

        <button
          onClick={() => changeTab('ordenes')}
          className={`
            flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-300 border-b-2 -mb-[2px]
            ${
              activeTab === 'ordenes'
                ? 'border-[#8fa18d] text-[#37413d] bg-white/40 rounded-t-xl'
                : 'border-transparent text-[#6f7f6d] hover:text-[#37413d] hover:bg-[#ede6d8]/30 rounded-t-xl'
            }
          `}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          Órdenes
        </button>
      </div>

      {/* Tables rendering according to selected tab */}
      <div className="transition-all duration-500 ease-out">
        {activeTab === 'vendedores' && (
          <div className="animate-[fadeInUp_0.4s_ease-out]">{vendedoresTable}</div>
        )}
        {activeTab === 'productos' && (
          <div className="animate-[fadeInUp_0.4s_ease-out]">{productosTable}</div>
        )}
        {activeTab === 'ordenes' && (
          <div className="animate-[fadeInUp_0.4s_ease-out]">{ordenesTable}</div>
        )}
      </div>
    </div>
  );
}
