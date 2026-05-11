import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ProductoCreateForm } from '@/components/productos/ProductoCreateForm';
import { supabase } from '@/lib/supabase';

export default async function NuevoProductoPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { data: categorias, error } = await supabase
    .from('categoria_producto')
    .select('categoria_producto_id, nombre')
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error al traer categorías:', error);
  }

  return (
    <ProductoCreateForm
      clerkUserId={userId}
      categorias={categorias || []}
    />
  );
}