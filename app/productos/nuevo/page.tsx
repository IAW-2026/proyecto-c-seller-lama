import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ProductoCreateForm } from '@/components/productos/ProductoCreateForm';
import { supabase } from '@/lib/supabase';
import { getVendedorActivoById } from '@/lib/vendedor-status';

export default async function NuevoProductoPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const vendedorActivo = await getVendedorActivoById(userId);

  const { data: categorias, error } = await supabase
    .from('categoria_producto')
    .select('categoria_producto_id, nombre')
    .order('nombre', { ascending: true });

  if (error) {
    // Mantener fallback silencioso; la UI usa categorias vacias.
  }

  return (
    <ProductoCreateForm
      clerkUserId={userId}
      categorias={categorias || []}
      vendedorActivo={vendedorActivo}
    />
  );
}