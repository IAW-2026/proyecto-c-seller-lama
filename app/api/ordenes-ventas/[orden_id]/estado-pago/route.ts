import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireM2MFrom } from '@/lib/api-auth';
import {
  isEstadoPago,
  isNonEmptyString,
  jsonError,
  parseJson,
  type EstadoPago,
} from '@/app/api/_utils';

const PAYMENTS_WRITE_MACHINES = ['payments'] as const;

type EstadoPagoInput = {
  estado_pago: EstadoPago;
  pago_id?: string;
  motivo?: string;
};

/*
Endpoint para actualizar el estado de pago de una orden de venta específica por su ID.
*/
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ orden_id: string }> }
) {
  const authResult = await requireM2MFrom(request, PAYMENTS_WRITE_MACHINES);
  if (!authResult.ok) return authResult.response;

  const params = await props.params;
  const { orden_id } = params;

  if (!isNonEmptyString(orden_id)) {
    return jsonError('orden_id es requerido', 400);
  }

  const { data, error } = await parseJson<EstadoPagoInput>(request);

  if (error) return error;

  if (!data || !isEstadoPago(data.estado_pago)) {
    return jsonError('estado_pago invalido', 400);
  }

  if (!isNonEmptyString(data.pago_id)) {
    return jsonError('pago_id es requerido', 400);
  }

  const now = new Date().toISOString();

  const { data: updated, error: updateError } = await supabase
    .from('orden')
    .update({
      estado_pago: data.estado_pago,
      motivo: data.motivo || null,
      fecha_actualizacion: now,
    })
    .eq('nro_orden', orden_id)
    .select('nro_orden, estado_pago, estado_general, fecha_actualizacion');

  if (updateError) {
    console.error('Error al actualizar estado de pago', updateError);
    return jsonError('No se pudo actualizar el estado de pago', 500);
  }

  const first = updated?.[0];

  if (!first) {
    return jsonError('Orden no encontrada', 404);
  }

  return NextResponse.json(
    {
      orden_id: first.nro_orden,
      estado_pago: first.estado_pago,
      estado_general: first.estado_general,
      fecha_actualizacion: first.fecha_actualizacion,
    },
    { status: 200 }
  );
}
