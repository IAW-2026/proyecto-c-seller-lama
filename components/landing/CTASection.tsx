import Link from 'next/link';
import { Show } from '@clerk/nextjs';

export function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-[#f6f1e7]">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#37413d] px-8 py-20 md:px-16 md:py-24">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#8fa18d]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#8fa18d]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              ¿Listo para empezar a vender?
            </h2>
            <p className="text-base md:text-lg text-white/60 mb-10 leading-relaxed">
              Unite a miles de vendedores que ya transforman su ropa en oportunidades. Creá tu cuenta gratis y publicá tu primer producto hoy.
            </p>
            <Show when="signed-out">
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 px-10 py-4 rounded-full text-base font-semibold bg-[#8fa18d] text-white hover:bg-[#7a8c78] transition-all duration-300 shadow-xl shadow-[#8fa18d]/30 hover:shadow-2xl hover:shadow-[#8fa18d]/40 hover:-translate-y-0.5"
              >
                Crear cuenta gratis
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                href="/productos"
                className="group inline-flex items-center gap-2 px-10 py-4 rounded-full text-base font-semibold bg-[#8fa18d] text-white hover:bg-[#7a8c78] transition-all duration-300 shadow-xl shadow-[#8fa18d]/30 hover:shadow-2xl hover:shadow-[#8fa18d]/40 hover:-translate-y-0.5"
              >
                Publicar producto
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Show>
          </div>
        </div>
      </div>
    </section>
  );
}
