import Link from 'next/link';
import { ProductoCard } from '@/components/productos/ProductoCard';
import { ProductFilters } from '@/components/productos/ProductFilters';
import { ProductosStats } from '@/components/productos/ProductosStats';
import { Pagination } from '@/components/ui/Pagination';
import { PageContainer } from '@/components/ui/PageContainer';
import { VendedorInactivoBanner } from '@/components/ui/VendedorInactivoBanner';
import { requireVendedor } from '@/lib/auth/roles';
import { getVendedorActivoById } from '@/lib/vendedor-status';
import {
  buildProductosQueryString,
  getCategoriaOptionsWithAll,
  getCategorias,
  getCategoriasOptions,
  getEstadoOptions,
  getGeneroOptions,
  getProductosConFiltros,
} from '@/lib/productos/productos-query';
import type { ProductoSearchParams } from '@/types/producto-filters';

interface ProductosPageProps {
  searchParams?: Promise<ProductoSearchParams>;
}

export default async function ProductosPage({
  searchParams,
}: ProductosPageProps) {
  const { userId } = await requireVendedor();

  const params = await searchParams;
  const vendedorActivo = await getVendedorActivoById(userId);

  const categorias = await getCategorias();
  const categoriaOptions = getCategoriaOptionsWithAll(
    getCategoriasOptions(categorias)
  );
  const estadoOptions = getEstadoOptions();
  const generoOptions = getGeneroOptions();

  const { productos, totalPages, currentPage, filters } =
    await getProductosConFiltros({
      userId,
      searchParams: params,
      categorias,
    });

  const buildPageHref = (page: number) =>
    buildProductosQueryString(filters, { page });

  return (
    <main className="flex-1 bg-gradient-to-b from-[#f6f1e7] via-[#f6f1e7] to-[#ede6d8]/40 relative overflow-hidden">
      <div className="h-14 md:h-[56px]" />

      <div className="absolute top-20 -left-32 w-80 h-80 bg-[#8fa18d]/[0.07] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-0 w-64 h-64 bg-[#8fa18d]/[0.05] rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#d8cfbd]/[0.12] rounded-full blur-[120px] pointer-events-none" />

      <PageContainer>
        <div className="relative py-7 md:py-9">
          <div className="mb-7 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px w-8 bg-[#8fa18d]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8fa18d]">
                    Catálogo
                  </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-bold text-[#37413d] leading-tight mb-2">
                  Mis Productos
                </h1>
                <p className="text-sm md:text-base text-[#6f7f6d] max-w-lg">
                  Gestioná tu catálogo de productos, editá y controlá el estado de tus artículos
                </p>
              </div>

            </div>
          </div>

          {!vendedorActivo && (
            <div className="mb-6">
              <VendedorInactivoBanner />
            </div>
          )}

          <div className="mb-6 flex items-center justify-end">
            <Link
              href="/productos/nuevo"
              className={`
                inline-flex items-center gap-2
                bg-[#8fa18d] text-white font-semibold
                py-2.5 px-5 rounded-xl
                transition-all duration-300
                shadow-[0_2px_12px_rgba(143,161,141,0.25)]
                ${
                  vendedorActivo
                    ? 'hover:bg-[#7a8c78] hover:shadow-[0_8px_24px_rgba(143,161,141,0.35)] hover:-translate-y-0.5 active:scale-[0.98]'
                    : 'opacity-60 cursor-not-allowed pointer-events-none'
                }
              `}
              aria-disabled={!vendedorActivo}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nuevo producto
            </Link>
          </div>

          {/* Stats cards */}
          <ProductosStats productos={productos} />

          {/* Filters */}
          <ProductFilters
            search={filters.search}
            estado={filters.estado}
            genero={filters.genero}
            talle={filters.talle}
            categoria={filters.categoria}
            estadoOptions={estadoOptions}
            generoOptions={generoOptions}
            categoriaOptions={categoriaOptions}
          />

          {/* Product grid */}
          {productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {productos.map((producto) => (
                <ProductoCard
                  key={producto.producto_id}
                  producto={producto}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#d8cfbd]/70 bg-white/60 backdrop-blur-sm p-12 md:p-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#f6f1e7] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#b4b0a6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-[#37413d] mb-1">
                    No hay productos disponibles
                  </p>
                  <p className="text-sm text-[#6f7f6d]">
                    Ajustá los filtros o creá un nuevo producto para comenzar
                  </p>
                </div>
              </div>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            buildHref={buildPageHref}
          />
        </div>
      </PageContainer>
    </main>
  );
}
