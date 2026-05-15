import { Show } from '@clerk/nextjs';
import Link from 'next/link';
import { PageContainer } from '@/components/ui/PageContainer';

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#f6f1e7] to-[#ede6d8]">
        <PageContainer>
          <div className="py-20 md:py-32 flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)]">
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-[#37413d] mb-4 leading-tight">
              Bienvenido a LAMA seller
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-[#6f7f6d] mb-4 max-w-2xl">
              Tu plataforma para vender ropa vintage y usada con estilo
            </p>

            {/* Description */}
            <p className="text-base md:text-lg text-[#6f7f6d]/80 mb-12 max-w-2xl leading-relaxed">
              Gestiona tu catálogo, tus ventas y tus clientes en un solo lugar. 
            </p>

            {/* CTA Buttons */}
            <Show when="signed-out">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sign-in"
                  className="px-8 py-3 md:py-4 rounded-xl font-semibold border-2 border-[#8fa18d] text-[#8fa18d] bg-white hover:bg-[#8fa18d] hover:text-white transition-all duration-200 active:scale-95"
                >
                  Iniciar sesión
                </Link>

                <Link
                  href="/sign-up"
                  className="px-8 py-3 md:py-4 rounded-xl font-semibold bg-[#8fa18d] text-white hover:bg-[#6f7f6d] transition-all duration-200 active:scale-95 shadow-lg shadow-[#8fa18d]/25"
                >
                  Crear cuenta
                </Link>
              </div>
            </Show>

            <Show when="signed-in">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/ventas"
                  className="px-8 py-3 md:py-4 rounded-xl font-semibold bg-[#8fa18d] text-white hover:bg-[#6f7f6d] transition-all duration-200 active:scale-95 shadow-lg shadow-[#8fa18d]/25"
                >
                  Ir a Ventas
                </Link>

                <Link
                  href="/productos"
                  className="px-8 py-3 md:py-4 rounded-xl font-semibold border-2 border-[#8fa18d] text-[#8fa18d] bg-white hover:bg-[#8fa18d] hover:text-white transition-all duration-200 active:scale-95"
                >
                  Ver Productos
                </Link>
              </div>
            </Show>
          </div>
        </PageContainer>
      </section>

      {/* Features Section (subtle, for signed-in users) */}
      <Show when="signed-in">
        <section className="bg-[#f6f1e7] py-16 md:py-20">
          <PageContainer>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-[#ede6d8] border border-[#8fa18d]/10 hover:border-[#8fa18d]/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-[#8fa18d]/10 flex items-center justify-center mb-4 text-2xl">
                  📦
                </div>
                <h3 className="text-lg font-semibold text-[#37413d] mb-2">
                  Gestiona tu catálogo
                </h3>
                <p className="text-sm text-[#6f7f6d]">
                  Organiza tus productos con fotos, descripciones y precios
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-[#ede6d8] border border-[#8fa18d]/10 hover:border-[#8fa18d]/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-[#8fa18d]/10 flex items-center justify-center mb-4 text-2xl">
                  📊
                </div>
                <h3 className="text-lg font-semibold text-[#37413d] mb-2">
                  Seguimiento de ventas
                </h3>
                <p className="text-sm text-[#6f7f6d]">
                  Visualiza tus ventas y ganancias en tiempo real
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-[#ede6d8] border border-[#8fa18d]/10 hover:border-[#8fa18d]/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-[#8fa18d]/10 flex items-center justify-center mb-4 text-2xl">
                  👥
                </div>
                <h3 className="text-lg font-semibold text-[#37413d] mb-2">
                  Gestión de clientes
                </h3>
                <p className="text-sm text-[#6f7f6d]">
                  Mantén registro de tus clientes y sus compras
                </p>
              </div>
            </div>
          </PageContainer>
        </section>
      </Show>
    </main>
  );
}