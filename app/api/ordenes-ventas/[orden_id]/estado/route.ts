import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireInternalApiKey } from '@/lib/api-auth';
import { isNonEmptyString, jsonError } from '@/app/api/_utils';

/*Endpoint para obtener el estado de una orden de venta */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ orden_id: string }> }
) {
  const authError = requireInternalApiKey(request);
  if (authError) return authError;

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
    console.error('Error al obtener estado de orden', error);
    return jsonError('No se pudo obtener el estado de la orden', 500);
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
