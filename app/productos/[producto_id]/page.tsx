import Link from 'next/link';
import { ProductoEditForm } from '@/components/productos/ProductoEditForm';
import { supabase } from '@/lib/supabase';
import type { Producto } from '@/types';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ producto_id: string }>;
}

type ProductoConCategoria = Producto & {
  categoria_nombre: string;
};

export default async function ProductoDetallePage({ params }: Props) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }
  
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
    .eq('clerk_user_id', userId)
    .single(); // .single() porque solo espera 1 resultado

  if (error || !producto) {
    return (
      <main className="min-h-screen bg-[#f6f1e7] p-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/productos"
            className="text-[#6f7f6d] hover:text-[#37413d] text-sm font-medium mb-8 inline-block">
            ← Volver a productos
          </Link>
          <div className="bg-[#ede6d8] rounded-lg border border-[#d8cfbd] p-8">
            <p className="text-[#37413d]">
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

  return <ProductoEditForm producto={productoConCategoria as ProductoConCategoria} />;
}
