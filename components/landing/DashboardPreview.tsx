const dashboardCards = [
  {
    label: 'Productos activos',
    value: '24',
    change: '+3 esta semana',
    accent: '#8fa18d',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    label: 'Ventas del mes',
    value: '$128.500',
    change: '+12% vs anterior',
    accent: '#6f7f6d',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    label: 'Pedidos pendientes',
    value: '7',
    change: '3 por enviar',
    accent: '#d17d6f',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Tasa de conversión',
    value: '68%',
    change: 'Excelente',
    accent: '#8fa18d',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
];

const recentSales = [
  { product: 'Campera de cuero vintage', price: '$45.000', time: 'Hace 2h', status: 'Pagado' },
  { product: 'Vestido floral 90s', price: '$22.500', time: 'Hace 5h', status: 'Enviado' },
  { product: 'Jeans Levi\'s 501', price: '$18.900', time: 'Ayer', status: 'Entregado' },
];

export function DashboardPreview() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-[#f6f1e7] to-[#ede6d8]">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: text */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-[#8fa18d]" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8fa18d]">
                Tu panel de control
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#37413d] mb-6 leading-tight">
              Todo tu negocio,
              <br />
              <span className="text-[#8fa18d]">en una pantalla</span>
            </h2>
            <p className="text-base md:text-lg text-[#6f7f6d] leading-relaxed mb-8 max-w-lg">
              Desde productos publicados hasta ventas realizadas. Visualizá métricas, controlá envíos y gestioná cada detalle sin complicaciones.
            </p>

            {/* Mini features list */}
            <div className="flex flex-col gap-4">
              {[
                'Métricas de ventas en tiempo real',
                'Control de inventario inteligente',
                'Historial completo de órdenes',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#8fa18d]/15 flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#8fa18d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-[#37413d]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: dashboard mockup */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-[#8fa18d]/10 rounded-3xl blur-2xl" />

            <div className="relative bg-white rounded-2xl border border-[#d8cfbd]/60 shadow-2xl shadow-black/5 overflow-hidden">
              {/* Mockup header bar */}
              <div className="flex items-center gap-2 px-5 py-3 bg-[#37413d] border-b border-white/5">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d17d6f]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e8c547]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8fa18d]" />
                </div>
                <span className="text-[10px] text-white/40 ml-4 font-mono">lama-seller.app/dashboard</span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 p-5">
                {dashboardCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-xl border border-[#d8cfbd]/40 bg-[#f6f1e7]/50 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-medium text-[#6f7f6d] uppercase tracking-wider">
                        {card.label}
                      </span>
                      <div style={{ color: card.accent }} className="opacity-60">
                        {card.icon}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-[#37413d] mb-1">{card.value}</div>
                    <span className="text-[10px] text-[#8fa18d] font-medium">{card.change}</span>
                  </div>
                ))}
              </div>

              {/* Recent sales */}
              <div className="px-5 pb-5">
                <div className="rounded-xl border border-[#d8cfbd]/40 bg-[#f6f1e7]/50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#d8cfbd]/30">
                    <span className="text-xs font-semibold text-[#37413d]">Ventas recientes</span>
                  </div>
                  {recentSales.map((sale, i) => (
                    <div
                      key={sale.product}
                      className={`flex items-center justify-between px-4 py-3 ${i < recentSales.length - 1 ? 'border-b border-[#d8cfbd]/20' : ''}`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-[#37413d]">{sale.product}</span>
                        <span className="text-[10px] text-[#6f7f6d]">{sale.time}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#37413d]">{sale.price}</span>
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                          sale.status === 'Pagado' ? 'bg-[#8fa18d]/15 text-[#8fa18d]'
                          : sale.status === 'Enviado' ? 'bg-blue-500/10 text-blue-600'
                          : 'bg-emerald-500/10 text-emerald-600'
                        }`}>
                          {sale.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
