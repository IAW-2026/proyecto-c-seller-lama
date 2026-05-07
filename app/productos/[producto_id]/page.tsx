import Link from 'next/link';
import { ProductoEditForm } from '@/components/productos/ProductoEditForm';
import { supabase } from '@/lib/supabase';
import type { Producto } from '@/types';

interface Props {
  params: Promise<{ producto_id: string }>;
}

export default async function ProductoDetallePage({ params }: Props) {
  const { producto_id } = await params;

  // Traer un producto específico de Supabase
  const { data: producto, error } = await supabase
    .from('producto')
    .select(
      `
      *,
      categoria_producto (
        nombre
      )
      `
    )
    .eq('producto_id', producto_id)
    .single(); // .single() porque solo espera 1 resultado

  if (error || !producto) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/productos"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-8 inline-block"
          >
            ← Volver a productos
          </Link>
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <p className="text-slate-600">
              {error ? `Error: ${error.message}` : 'Producto no encontrado'}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Agregar categoria_nombre para compatibilidad con ProductoEditForm
  const productoConCategoria = {
    ...producto,
    categoria_nombre: producto.categoria_producto?.nombre || 'Sin categoría',
  };

  return <ProductoEditForm producto={productoConCategoria as Producto & { categoria_nombre: string }} />;
}
