import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { VentasStats } from '@/components/ventas/VentasStats';
import { VentasTable } from '@/components/ventas/VentasTable';
import { EmptyVentas } from '@/components/ventas/EmptyVentas';
import type { OrdenConProducto } from '@/types/orden';

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

    ordenes =
      ordenesData?.map((orden: any) => ({
        ...orden,
        producto_titulo: orden.producto?.titulo || 'Producto sin título',
      })) || [];
  }

  const totalVentas = ordenes.length;
  const ventasPendientes = ordenes.filter(
    (orden) => orden.estado_general === 'pendiente_pago'
  ).length;
  const ventasCompletas = ordenes.filter(
    (orden) => orden.estado_general === 'enviada'
  ).length;
  const totalIngresos = ordenes.reduce(
    (sum, orden) => sum + (orden.total || 0),
    0
  );

  return (
    <main className="flex-1 bg-[#f6f1e7]">
      <PageContainer>
        <div className="py-8 md:py-12">
          <PageHeader
            title="Mis Ventas"
            description="Gestiona tus órdenes, pagos y estado de envíos"
          />

          <VentasStats
            totalVentas={totalVentas}
            totalIngresos={totalIngresos}
            ventasPendientes={ventasPendientes}
            ventasCompletas={ventasCompletas}
          />

          {ordenes.length > 0 ? (
            <VentasTable ordenes={ordenes} />
          ) : (
            <EmptyVentas />
          )}
        </div>
      </PageContainer>
    </main>
  );
}