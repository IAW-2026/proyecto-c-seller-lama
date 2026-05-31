import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isNonEmptyString, jsonError } from '@/app/api/_utils';

type OrdenItemRecord = {
  producto_id: string;
  precio_unitario: number;
  producto?: {
    clerk_user_id: string;
  }[] | null;
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
      clerk_user_id
    )
  )
`;

const mapOrdenResponse = (orden: OrdenRecord) => {
  const items = (orden.orden_item || []).map((item) => ({
    producto_id: item.producto_id,
    precio_unitario: item.precio_unitario,
  }));

  return {
    orden_id: orden.nro_orden,
    comprador_id: orden.clerk_user_id,
    vendedor_id: orden.orden_item?.[0]?.producto?.[0]?.clerk_user_id ?? null,
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
