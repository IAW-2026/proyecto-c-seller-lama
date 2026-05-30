import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isNonEmptyString, jsonError } from '@/app/api/_utils';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ orden_id: string }> }
) {
  const params = await props.params;
  const { orden_id } = params;

  if (!isNonEmptyString(orden_id)) {
    return jsonError('orden_id es requerido', 400);
  }

  const { data, error } = await supabase
    .from('orden')
    .select(
      `
      nro_orden,
      estado_general,
      estado_pago,
      estado_envio,
      fecha_actualizacion
      `
    )
    .eq('nro_orden', orden_id)
    .maybeSingle();

  if (error) {
    return jsonError(error.message, 500);
  }

  if (!data) {
    return jsonError('Orden no encontrada', 404);
  }

  return NextResponse.json(
    {
      orden_id: data.nro_orden,
      estado_general: data.estado_general,
      estado_pago: data.estado_pago,
      estado_envio: data.estado_envio,
      fecha_actualizacion: data.fecha_actualizacion,
    },
    { status: 200 }
  );
}