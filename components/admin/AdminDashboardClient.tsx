'use client';

import { useState, useEffect } from 'react';

interface MetricCard {
  label: string;
  value: string | number;
  hint: string;
  accent: string;
  featured: boolean;
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
      featured: false,
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
      featured: false,
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
      featured: false,
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
      featured: true,
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
      featured: false,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 mb-8">
        {metricCards.map((card, index) => (
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
              ${card.featured
                ? 'shadow-[0_6px_28px_rgba(143,161,141,0.12),0_2px_8px_rgba(55,65,61,0.05)] border-[#8fa18d]/25'
                : 'shadow-[0_4px_20px_rgba(111,127,109,0.07),0_1px_4px_rgba(55,65,61,0.04)]'
              }
            `}
            style={{
              animation: `cardReveal 0.5s ease-out ${index * 0.07}s both`,
            }}
          >
            {/* Subtle warm inner glow for featured card */}
            {card.featured && (
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
                ${card.featured
                  ? 'text-[1.85rem] md:text-[2.2rem] tracking-tight'
                  : 'text-[1.65rem] md:text-[2rem] tracking-tight'
                }
              `}
            >
              {card.value}
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
