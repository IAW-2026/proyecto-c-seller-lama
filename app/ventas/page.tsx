import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { VentasClient } from '@/components/ventas/VentasClient';
import type { Orden, OrdenConItems, OrdenItem } from '@/types/orden';
import { VendedorInactivoBanner } from '@/components/ui/VendedorInactivoBanner';
import { getVendedorActivoById } from '@/lib/vendedor-status';

//Sirve para evitar errores de TypeScript cuando accedés a item.orden o item.producto.
type OrdenItemWithOrden = {
  orden_item_id: string;
  orden_id: string;
  producto_id: string;
  precio_unitario: number;
  fecha_creacion: string;
  orden: Orden | null;
  producto: OrdenItem['producto'] | null;
};

export default async function VentasPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const vendedorActivo = await getVendedorActivoById(userId);

  // Join con orden para traer los datos de la orden asociada a cada item.
  // Join con producto para traer el producto vendido y filtrar por vendedor.
  const { data: ordenItems } = await supabase
    .from('orden_item')
    .select(
      `
      orden_item_id,
      orden_id,
      producto_id,
      precio_unitario,
      fecha_creacion,
      orden:fk_orden_item_orden!inner (
        orden_id,
        clerk_user_id,
        nro_orden,
        total,
        estado_general,
        estado_pago,
        estado_envio,
        direccion_envio,
        fecha_creacion,
        fecha_actualizacion
      ),
      producto:fk_orden_item_producto!inner (
        titulo,
        clerk_user_id,
        estado_publicacion
      )
    `
    )
    .eq('producto.clerk_user_id', userId);

  const ordenesMap = new Map<string, OrdenConItems>();

  // Supabase devuelve las relaciones nested (orden y producto) como arrays,
  // Acá normalizamos esos joins tomando el primer elemento para trabajar
  // con objetos simples en lugar de arrays.
  const items = (ordenItems ?? []).map((item) => ({
    ...item,
    orden: Array.isArray(item.orden) ? item.orden[0] : item.orden,
    producto: Array.isArray(item.producto)
      ? item.producto[0]
      : item.producto,
  })) as OrdenItemWithOrden[];

  items.forEach((item) => {
    const orden = item.orden;
    const producto = item.producto;

    if (!orden) return;

    const normalizedItem: OrdenItem = {
      orden_item_id: item.orden_item_id,
      orden_id: item.orden_id,
      producto_id: item.producto_id,
      precio_unitario: item.precio_unitario,
      fecha_creacion: item.fecha_creacion,
      producto,
    };

    const existing = ordenesMap.get(orden.orden_id);

    if (!existing) {
      ordenesMap.set(orden.orden_id, {
        ...orden,
        items: [normalizedItem],
      });
      return;
    }

    existing.items.push(normalizedItem);
  });

  const ordenes = Array.from(ordenesMap.values()).sort((a, b) =>
    b.fecha_creacion.localeCompare(a.fecha_creacion)
  );

  return (
    <main className="flex-1 bg-[#f6f1e7]">
      <PageContainer>
        <div className="py-8 md:py-12">
          <PageHeader
            title="Mis Ventas"
            description="Gestiona tus órdenes, pagos y estado de envíos"
          />

          {!vendedorActivo && (
            <div className="mb-6">
              <VendedorInactivoBanner />
            </div>
          )}

          <VentasClient ordenes={ordenes} vendedorActivo={vendedorActivo} />
        </div>
      </PageContainer>
    </main>
  );
}