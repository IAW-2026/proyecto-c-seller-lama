import Link from 'next/link';
import { ProductoEditForm } from '@/components/productos/ProductoEditForm';
import { supabase } from '@/lib/supabase';
import type { Producto } from '@/types';
import { requireVendedor } from '@/lib/auth/roles';
import { getVendedorActivoById } from '@/lib/vendedor-status';

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
  const { userId } = await requireVendedor();

  const vendedorActivo = await getVendedorActivoById(userId);
  
  const { producto_id } = await params;
  const query = searchParams ? await searchParams : undefined;
  const returnPath = query?.from === 'admin' ? '/admin' : '/productos';

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
    .single(); 

  const { data: categorias } = await supabase
    .from('categoria_producto')
    .select('categoria_producto_id, nombre')
    .order('nombre', { ascending: true });

  const { data: ordenesAsociadas } = await supabase
    .from('orden_item')
    .select('orden_id')
    .eq('producto_id', producto_id)
    .limit(1);

  if (error || !producto) {
    return (
      <main className="min-h-screen bg-[#f6f1e7] p-8 pt-[calc(56px+2rem)]">
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

  const productoConCategoria = {
    ...producto,
    categoria_nombre: producto.categoria_producto?.nombre || 'Sin categoría',
  };

  return (
    <ProductoEditForm 
      producto={productoConCategoria as ProductoConCategoria}
      categorias={(categorias as Categoria[]) || []}
      returnPath={returnPath}
      vendedorActivo={vendedorActivo}
      hasOrdenAsociada={Boolean(ordenesAsociadas?.length)}
    />
  );
}
