import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isNonEmptyString, jsonError } from '@/app/api/_utils';

type ProductoOrdenRecord = {
  clerk_user_id: string;
  titulo?: string | null;
  imagenes?: string[] | null;
};

type OrdenItemRecord = {
  producto_id: string;
  precio_unitario: number;
  producto?: ProductoOrdenRecord | ProductoOrdenRecord[] | null;
};

type OrdenRecord = {
  nro_orden: string;
  clerk_user_id: string;
  total: number;
  direccion_envio: string;
  estado_general: string;
  estado_pago: string;
  estado_envio: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  orden_item: OrdenItemRecord[] | null;
};

const ordenDetailSelect = `
  nro_orden,
  clerk_user_id,
  total,
  estado_general,
  estado_pago,
  estado_envio,
  direccion_envio,
  fecha_creacion,
  fecha_actualizacion,
  orden_item (
    producto_id,
    precio_unitario,
    producto (
      clerk_user_id,
      titulo,
      imagenes
    )
  )
`;

const mapOrdenResponse = (orden: OrdenRecord) => {
  const vendedorId = (orden.orden_item || []).reduce<string | null>(
    (current, item) => {
      if (current) return current;
      const producto = item.producto;
      const clerkUserId = Array.isArray(producto)
        ? producto[0]?.clerk_user_id
        : producto?.clerk_user_id;
      return clerkUserId ?? null;
    },
    null
  );

  const items = (orden.orden_item || []).map((item) => {
    const producto = item.producto;
    const productoData = Array.isArray(producto) ? producto[0] : producto;

    return {
      producto_id: item.producto_id,
      precio_unitario: item.precio_unitario,
      titulo: productoData?.titulo ?? null,
      imagenes: productoData?.imagenes ?? [],
    };
  });

  return {
    orden_id: orden.nro_orden,
    comprador_id: orden.clerk_user_id,
    vendedor_id: vendedorId,
    items,
    producto_ids: items.map((item) => item.producto_id),
    total: orden.total,
    direccion_envio: orden.direccion_envio,
    estado_general: orden.estado_general,
    estado_pago: orden.estado_pago,
    estado_envio: orden.estado_envio,
    fecha_creacion: orden.fecha_creacion,
    fecha_actualizacion: orden.fecha_actualizacion,
  };
};

/*Endpoint para obtener los detalles de una orden de venta */
export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ orden_id: string }> }
) {
  const params = await props.params;
  const { orden_id } = params;

  if (!isNonEmptyString(orden_id)) {
    return jsonError('orden_id es requerido', 400);
  }

  const { data, error } = await supabase
    .from('orden')
    .select(ordenDetailSelect)
    .eq('nro_orden', orden_id)
    .maybeSingle();

  if (error) {
    return jsonError(error.message, 500);
  }

  if (!data) {
    return jsonError('Orden no encontrada', 404);
  }

  return NextResponse.json(mapOrdenResponse(data as OrdenRecord), {
    status: 200,
  });
}
