import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  isEstadoLiquidacion,
  isNonEmptyString,
  jsonError,
  parseJson,
  type EstadoLiquidacion,
} from '@/app/api/_utils';

type LiquidacionInput = {
  estado_liquidacion_vendedor: EstadoLiquidacion;
  fecha_liquidacion_vendedor?: string;
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
  if (!data || !isEstadoLiquidacion(data.estado_liquidacion_vendedor)) {
    return jsonError('estado_liquidacion_vendedor invalido', 400);
  }

  const now = new Date().toISOString();
  const fechaLiquidacion =
    data.fecha_liquidacion_vendedor && isNonEmptyString(data.fecha_liquidacion_vendedor)
      ? data.fecha_liquidacion_vendedor
      : null;

  const { data: updated, error: updateError } = await supabase
    .from('orden')
    .update({
      estado_liquidacion_vendedor: data.estado_liquidacion_vendedor,
      fecha_liquidacion_vendedor: fechaLiquidacion,
      fecha_actualizacion: now,
    })
    .eq('orden_id', orden_id)
    .select(
      'orden_id, estado_liquidacion_vendedor, fecha_liquidacion_vendedor, fecha_actualizacion'
    );

  if (updateError) {
    return jsonError(updateError.message, 500);
  }

  const first = updated?.[0];
  if (!first) {
    return jsonError('Orden no encontrada', 404);
  }

  return NextResponse.json(first, { status: 200 });
}
