import Link from 'next/link';
import { Show } from '@clerk/nextjs';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/hero-landing.png"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#37413d]/90 via-[#37413d]/70 to-[#37413d]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#37413d]/80 via-transparent to-[#37413d]/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8 w-full py-32 md:py-40">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8 animate-[fadeInUp_0.6s_ease-out]">
            <span className="h-px w-10 bg-[#8fa18d]" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8fa18d]">
              Marketplace de moda circular
            </span>
          </div>

          {/* Main title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-8 animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
            Vendé moda
            <br />
            <span className="text-[#8fa18d]">con historia</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed mb-10 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
            La plataforma donde tu ropa vintage y usada encuentra a quien la valore.
            Publicá, vendé y gestioná todo en un solo lugar.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
            <Show when="signed-out">
              <Link
                href="/sign-up"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold bg-[#8fa18d] text-white hover:bg-[#7a8c78] transition-all duration-300 shadow-xl shadow-[#8fa18d]/30 hover:shadow-2xl hover:shadow-[#8fa18d]/40 hover:-translate-y-0.5"
              >
                Comenzar ahora
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-white border border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Ya tengo cuenta
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                href="/ventas"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold bg-[#8fa18d] text-white hover:bg-[#7a8c78] transition-all duration-300 shadow-xl shadow-[#8fa18d]/30 hover:shadow-2xl hover:shadow-[#8fa18d]/40 hover:-translate-y-0.5"
              >
                Ir a Ventas
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/productos"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-white border border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Ver Productos
              </Link>
            </Show>
          </div>

          {/* Stats badges */}
          <div className="flex flex-wrap gap-8 animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
            {[
              { value: '10k+', label: 'Productos' },
              { value: '2k+', label: 'Vendedores' },
              { value: '100%', label: 'Circular' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-white/50 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f6f1e7] to-transparent" />
    </section>
  );
}
