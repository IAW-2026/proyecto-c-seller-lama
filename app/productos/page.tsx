import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { ProductoCard } from '@/components/productos/ProductoCard';
import { ProductStatusFilter } from '@/components/productos/ProductStatusFilter';
import { supabase } from '@/lib/supabase';
import type { Producto } from '@/types';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { VendedorInactivoBanner } from '@/components/ui/VendedorInactivoBanner';
import { getVendedorActivoById } from '@/lib/vendedor-status';
import {
  ESTADOS_PUBLICACION,
  type EstadoFiltroProducto,
  type EstadoPublicacion,
} from '@/types/producto';

interface ProductosPageProps {
  searchParams?: Promise<{
    estado?: string;
  }>;
}

export default async function ProductosPage({
  searchParams,
}: ProductosPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const params = await searchParams;
  const estadoParam = params?.estado;

  const vendedorActivo = await getVendedorActivoById(userId);

  const estado: EstadoFiltroProducto =
    estadoParam === 'todos' ||
    ESTADOS_PUBLICACION.includes(estadoParam as EstadoPublicacion)
      ? (estadoParam as EstadoFiltroProducto)
      : 'activa';

  let query = supabase
    .from('producto')
    .select(
      `
      *,
      categoria_producto (
        nombre
      )
      `
    )
    .eq('clerk_user_id', userId);

  if (estado !== 'todos') {
    query = query.eq('estado_publicacion', estado);
  }

  const { data: productosConCategoria, error } = await query;

  if (error) {
    console.error('Error al traer productos:', error);

    return (
      <main className="min-h-screen bg-[#f6f1e7]">
        <PageContainer>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mt-8">
            Error al cargar productos: {JSON.stringify(error)}
          </div>
        </PageContainer>
      </main>
    );
  }

  const productos = (productosConCategoria || []).map((prod: any) => ({
    ...prod,
    categoria_nombre: prod.categoria_producto?.nombre || 'Sin categoría',
  }));

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

          <ProductStatusFilter selectedStatus={estado} />

          {productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productos.map(
                (producto: Producto & { categoria_nombre: string }) => (
                  <ProductoCard
                    key={producto.producto_id}
                    producto={producto}
                  />
                )
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-8 text-center text-slate-600">
              No hay productos disponibles 
            </div>
          )}
        </div>
      </PageContainer>
    </main>
  );
}