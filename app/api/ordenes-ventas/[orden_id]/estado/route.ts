import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isNonEmptyString, jsonError } from '@/app/api/_utils';

/*
Endpoint para obtener el estado de una orden de venta específica por su ID.
*/
export async function GET(request: NextRequest, props: { params: Promise<{ orden_id: string }> }) {
  const params = await props.params;
  const { orden_id } = params;

  if (!isNonEmptyString(orden_id)) {
    return jsonError('orden_id es requerido', 400);
  }

  const { data, error } = await supabase
    .from('orden')
    .select(
      `
      orden_id,
      nro_orden,
      comprador_id,
      clerk_user_id,
      total,
      direccion_envio,
      estado_general,
      estado_pago,
      estado_envio,
      fecha_creacion,
      fecha_actualizacion,
      orden_item:orden_item!inner (
        producto_id,
        precio_unitario,
        producto:producto_id!inner (
          titulo
        )
      )
    `
    )
    .eq('orden_id', orden_id)
    .single();

  if (error) {
    return jsonError(error.message, 500);
  }

  if (!data) {
    return jsonError('Orden no encontrada', 404);
  }

  const items = Array.isArray(data.orden_item)
    ? data.orden_item
    : data.orden_item
      ? [data.orden_item]
      : [];

  if (items.length === 0) {
    return jsonError('Orden sin items', 404);
  }

  return NextResponse.json(
    {
      orden_id: data.orden_id,
      nro_orden: data.nro_orden,
      comprador_id: data.comprador_id,
      vendedor_id: data.clerk_user_id,
      items: items.map((item) => ({
        producto_id: item.producto_id,
        titulo_producto: item.producto?.titulo ?? null,
        precio_producto: item.precio_unitario,
      })),
      total: data.total,
      direccion_envio: data.direccion_envio,
      estado_general: data.estado_general,
      estado_pago: data.estado_pago,
      estado_envio: data.estado_envio,
      fecha_creacion: data.fecha_creacion,
      fecha_actualizacion: data.fecha_actualizacion,
    },
    { status: 200 }
  );
}
