import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isNonEmptyString, jsonError, parseJson } from '@/app/api/_utils';

type PagoRechazadoInput = {
  pago_id?: string;
  motivo_rechazo?: string;
  fecha_rechazo?: string;
};

/*
Endpoint para marcar el pago de una orden de venta como rechazado.
*/

export async function POST(request: NextRequest, props: { params: Promise<{ orden_id: string }> }) {
  const params = await props.params;
  const { orden_id } = params;

  if (!isNonEmptyString(orden_id)) {
    return jsonError('orden_id es requerido', 400);
  }

  const { data, error } = await parseJson<PagoRechazadoInput>(request);
  if (error) return error;

  if (!data || !isNonEmptyString(data.pago_id)) {
    return jsonError('pago_id es requerido', 400);
  }

  if (!isNonEmptyString(data.motivo_rechazo)) {
    return jsonError('motivo_rechazo es requerido', 400);
  }

  if (!isNonEmptyString(data.fecha_rechazo)) {
    return jsonError('fecha_rechazo es requerido', 400);
  }

  const now = new Date().toISOString();

  const { data: updated, error: updateError } = await supabase
    .from('orden')
    .update({
      estado_pago: 'rechazado',
      estado_general: 'cancelada',
      fecha_actualizacion: now,
      // NOTE: pago_id/motivo_rechazo/fecha_rechazo no se persisten si la BD no los soporta.
    })
    .eq('orden_id', orden_id)
    .select('orden_id, estado_general, estado_pago, fecha_actualizacion');

  if (updateError) {
    return jsonError(updateError.message, 500);
  }

  const first = updated?.[0];
  if (!first) {
    return jsonError('Orden no encontrada', 404);
  }

  return NextResponse.json(first, { status: 200 });
}
