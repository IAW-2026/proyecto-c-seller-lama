import Link from 'next/link';
import { ProductoEditForm } from '@/components/productos/ProductoEditForm';
import { supabase } from '@/lib/supabase';
import type { Producto } from '@/types';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ producto_id: string }>;
  searchParams?: Promise<{ from?: string }>;
}

type ProductoConCategoria = Producto & {
  categoria_nombre: string;
};

interface Categoria {
  categoria_producto_id: string;
  nombre: string;
}

export default async function ProductoDetallePage({ params, searchParams }: Props) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }
  
  const { producto_id } = await params;
  const query = searchParams ? await searchParams : undefined;
  const returnPath = query?.from === 'admin' ? '/admin' : '/productos';

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

  // Traer todas las categorías
  const { data: categorias, error: categoriasError } = await supabase
    .from('categoria_producto')
    .select('categoria_producto_id, nombre')
    .order('nombre', { ascending: true });

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

  return (
    <ProductoEditForm 
      producto={productoConCategoria as ProductoConCategoria}
      categorias={(categorias as Categoria[]) || []}
      returnPath={returnPath}
    />
  );
}
