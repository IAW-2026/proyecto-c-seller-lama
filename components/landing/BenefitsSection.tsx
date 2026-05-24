const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    title: 'Publicá en minutos',
    description: 'Subí fotos, escribí la descripción y elegí el precio. Tu producto estará visible al instante.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Gestioná tus ventas',
    description: 'Seguí cada venta en tiempo real, desde el pedido hasta la entrega. Control total en tu dashboard.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    title: 'Seguimiento de envíos',
    description: 'Mantené informados a tus compradores con estados de envío actualizados automáticamente.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Cobros seguros',
    description: 'Cada transacción está protegida. Recibí tus pagos de forma segura y puntual.',
  },
];

export function BenefitsSection() {
  return (
    <section className="py-24 md:py-32 bg-[#f6f1e7]">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-10 bg-[#8fa18d]" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8fa18d]">
              ¿Por qué LAMA?
            </span>
            <span className="h-px w-10 bg-[#8fa18d]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#37413d] mb-6 leading-tight">
            Todo lo que necesitás
            <br />
            <span className="text-[#8fa18d]">para vender mejor</span>
          </h2>
          <p className="text-base md:text-lg text-[#6f7f6d] leading-relaxed">
            Herramientas diseñadas para que te enfoques en lo que importa: tu ropa y tus clientes.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group relative p-8 rounded-2xl bg-[#ede6d8] border border-[#d8cfbd] hover:border-[#8fa18d]/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#8fa18d]/10"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#8fa18d]/10 text-[#8fa18d] flex items-center justify-center mb-6 group-hover:bg-[#8fa18d] group-hover:text-white transition-all duration-500">
                {benefit.icon}
              </div>

              <h3 className="text-lg font-bold text-[#37413d] mb-3">
                {benefit.title}
              </h3>
              <p className="text-sm text-[#6f7f6d] leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
