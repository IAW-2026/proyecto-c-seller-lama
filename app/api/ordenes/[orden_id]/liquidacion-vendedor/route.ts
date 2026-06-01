import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isNonEmptyString, jsonError, parseJson } from '@/app/api/_utils';

type LiquidacionInput = {
  fecha_actualizacion?: string;
};

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ orden_id: string }> }
) {
  const params = await props.params;
  const { orden_id } = params;

  if (!isNonEmptyString(orden_id)) {
    return jsonError('orden_id es requerido', 400);
  }

  const { data, error } = await parseJson<LiquidacionInput>(request);
  if (error) return error;

  const fechaActualizacion =
    data?.fecha_actualizacion && isNonEmptyString(data.fecha_actualizacion)
      ? data.fecha_actualizacion
      : new Date().toISOString();

  const { data: updated, error: updateError } = await supabase
    .from('orden')
    .update({
      estado_general: 'liquidada',
      fecha_liquidacion_vendedor: fechaActualizacion,
      fecha_actualizacion: fechaActualizacion,
    })
    .eq('nro_orden', orden_id)
    .select('nro_orden')
    .maybeSingle();

  if (updateError?.code === 'PGRST116') {
    return jsonError('Orden no encontrada', 404);
  }

  if (updateError) {
    return jsonError(updateError.message, 500);
  }

  if (!updated) {
    return jsonError('Orden no encontrada', 404);
  }

  return NextResponse.json(
    {
      mensaje: 'liquidacion registrada correctamente',
    },
    { status: 200 }
  );
}