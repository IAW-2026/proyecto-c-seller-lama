import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isEstadoEnvio, isNonEmptyString, jsonError, parseJson, type EstadoEnvio } from '@/app/api/_utils';

type EstadoEnvioInput = {
  estado_envio: EstadoEnvio;
  motivo?: string;
  envio_id?: string;
  codigo_seguimiento?: string;
};

const toEstadoGeneralFromEnvio = (estadoEnvio: EstadoEnvio) => {
  if (estadoEnvio === 'cancelado') return 'cancelada';
  if (estadoEnvio === 'en_preparacion') return 'en_preparacion';
  if (estadoEnvio === 'despachado' || estadoEnvio === 'entregado') return 'enviada';
  return 'pagada';
};

/*
Endpoint para actualizar el estado de envío de una orden de venta específica por su ID.
*/
export async function PATCH(request: NextRequest, props: { params: Promise<{ orden_id: string }> }) {
  const params = await props.params;
  const { orden_id } = params;

  if (!isNonEmptyString(orden_id)) {
    return jsonError('orden_id es requerido', 400);
  }

  const { data, error } = await parseJson<EstadoEnvioInput>(request);
  if (error) return error;
  if (!data || !isEstadoEnvio(data.estado_envio)) {
    return jsonError('estado_envio invalido', 400);
  }

  const now = new Date().toISOString();
  const estado_general = toEstadoGeneralFromEnvio(data.estado_envio);

  const { data: updated, error: updateError } = await supabase
    .from('orden')
    .update({
      estado_envio: data.estado_envio,
      estado_general,
      fecha_actualizacion: now,
      // NOTE: motivo/envio_id/codigo_seguimiento no se persisten si la BD no los soporta.
    })
    .eq('orden_id', orden_id)
    .select('orden_id, estado_general, estado_envio, fecha_actualizacion');

  if (updateError) {
    return jsonError(updateError.message, 500);
  }

  const first = updated?.[0];
  if (!first) {
    return jsonError('Orden no encontrada', 404);
  }

  return NextResponse.json(first, { status: 200 });
}
