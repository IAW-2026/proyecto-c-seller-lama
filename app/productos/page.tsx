import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { ProductoCard } from '@/components/productos/ProductoCard';
import { supabase } from '@/lib/supabase';
import type { Producto } from '@/types';
import { PageContainer } from '@/components/ui/PageContainer';

const PRIMARY_COLOR = '#515922';
const CURRENT_SELLER_ID = 'user_2x91ab';

export default async function ProductosPage() {
  // Protección: verificar que el usuario esté autenticado
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }
  // Traer productos del vendedor actual CON el nombre de la categoría via JOIN
  const { data: productosConCategoria, error } = await supabase
    .from('producto')
    .select(
      `
      *,
      categoria_producto (
        nombre
      )
      `
    )
    .eq('clerk_user_id', CURRENT_SELLER_ID);

  if (error) {
    console.error('Error al traer productos:', error);
    return (
      <main className="min-h-screen bg-white">
        <PageContainer>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mt-8">
            Error al cargar productos: {JSON.stringify(error)}
          </div>
        </PageContainer>
      </main>
    );
  }

  // Transformar datos para que coincidan con lo que espera ProductoCard
  const productos = (productosConCategoria || []).map((prod: any) => ({
    ...prod,
    categoria_nombre: prod.categoria_producto?.nombre || 'Sin categoría',
  }));

  return (
    <main className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-amber-50 border-b border-slate-200">
        <PageContainer>
          <div className="flex items-center justify-between py-6">
            <h1 className="text-2xl font-bold" style={{ color: PRIMARY_COLOR }}>
              LAMA seller app
            </h1>
            <Link 
              href="/dashboard" 
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-slate-100 border-2"
              style={{ 
                color: PRIMARY_COLOR,
                borderColor: PRIMARY_COLOR
              }}
            >
              Volver
            </Link>
          </div>
        </PageContainer>
      </header>

      {/* Contenido principal */}
      <PageContainer>
        <div className="py-12">
          {/* Título */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>
              Productos
            </h2>
            <p className="text-slate-600">
              Gestiona tu catálogo de productos. Aquí puedes ver, editar y controlar el estado de tus artículos.
            </p>
          </div>

          {/* Grid de productos */}
          {productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productos.map((producto: Producto & { categoria_nombre: string }) => (
                <ProductoCard key={producto.producto_id} producto={producto} />
              ))}
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
