import Link from 'next/link';
import { ProductoCard } from '@/components/productos/ProductoCard';
import { supabase } from '@/lib/supabase';
import type { Producto } from '@/types';

export default async function ProductosPage() {
  // Traer productos activos CON el nombre de la categoría via JOIN
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
    .eq('estado_publicacion', 'activa');

  if (error) {
    console.error('Error al traer productos:', error);
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Error al cargar productos: {JSON.stringify(error)}
          </div>
        </div>
      </main>
    );
  }

  // Transformar datos para que coincidan con lo que espera ProductoCard
  const productos = (productosConCategoria || []).map((prod: any) => ({
    ...prod,
    categoria_nombre: prod.categoria_producto?.nombre || 'Sin categoría',
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Productos</h1>
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
          <div className="bg-slate-100 border border-slate-300 rounded-lg p-8 text-center text-slate-600">
            No hay productos disponibles
          </div>
        )}
      </div>
    </main>
  );
}
