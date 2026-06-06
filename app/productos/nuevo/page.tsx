import { ProductoCreateForm } from '@/components/productos/ProductoCreateForm';
import { supabase } from '@/lib/supabase';
import { requireVendedor } from '@/lib/auth/roles';
import { getVendedorActivoById } from '@/lib/vendedor-status';

export default async function NuevoProductoPage() {
  const { userId } = await requireVendedor();

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
