import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { ProductoCard } from '@/components/productos/ProductoCard';
import { ProductFilters } from '@/components/productos/ProductFilters';
import { Pagination } from '@/components/ui/Pagination';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { VendedorInactivoBanner } from '@/components/ui/VendedorInactivoBanner';
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
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

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
    <main className="min-h-screen bg-[#f6f1e7]">
      <PageContainer>
        <div className="py-12">
          <PageHeader
            title="Productos"
            description="Gestiona tu catálogo de productos. Aquí puedes ver, editar y controlar el estado de tus artículos."
            action={
              <Link
                href="/productos/nuevo"
                className={`bg-[#8fa18d] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-sm ${
                  vendedorActivo
                    ? 'hover:bg-[#7a8c78]'
                    : 'opacity-60 cursor-not-allowed pointer-events-none'
                }`}
                aria-disabled={!vendedorActivo}
              >
                + Nuevo producto
              </Link>
            }
          />

          {!vendedorActivo && (
            <div className="mb-6">
              <VendedorInactivoBanner />
            </div>
          )}

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

          {productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productos.map((producto) => (
                <ProductoCard
                  key={producto.producto_id}
                  producto={producto}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-8 text-center text-slate-600">
              No hay productos disponibles 
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