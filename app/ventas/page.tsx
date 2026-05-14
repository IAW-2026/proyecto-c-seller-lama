import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { VentasClient } from '@/components/ventas/VentasClient';
import type { OrdenConProducto } from '@/types/orden';

type OrdenWithProducto = OrdenConProducto & {
  producto?: {
    titulo: string | null;
  } | null;
};

export default async function VentasPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { data: productosVendedor } = await supabase
    .from('producto')
    .select('producto_id')
    .eq('clerk_user_id', userId);

  let ordenes: OrdenConProducto[] = [];

  if (productosVendedor && productosVendedor.length > 0) {
    const productIds = productosVendedor.map((p) => p.producto_id);

    const { data: ordenesData } = await supabase
      .from('orden')
      .select(`
        *,
        producto (
          titulo
        )
      `)
      .in('producto_id', productIds);

    const typedOrdenes = (ordenesData || []) as OrdenWithProducto[];

    ordenes = typedOrdenes.map((orden) => ({
      ...orden,
      producto_titulo: orden.producto?.titulo || 'Producto sin titulo',
    }));
  }

  return (
    <main className="flex-1 bg-[#f6f1e7]">
      <PageContainer>
        <div className="py-8 md:py-12">
          <PageHeader
            title="Mis Ventas"
            description="Gestiona tus órdenes, pagos y estado de envíos"
          />

          <VentasClient ordenes={ordenes} />
        </div>
      </PageContainer>
    </main>
  );
}