import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ESTADO_ENVIO, ESTADO_GENERAL, ESTADO_PAGO } from '@/types/orden';
import { isNonEmptyString, jsonError } from '@/app/api/_utils';
import { requireVendedor } from '@/lib/api-auth';
import { getVendedorActivoOrError } from '@/lib/vendedor-status';
import {
  callShippingApi,
  InternalApiConfigError,
  InternalApiRequestError,
  readInternalApiErrorMessage,
} from '@/lib/internal-api-client';

type ShippingResponse = {
  envio_id: string;
  empresa_logistica: string;
  codigo_seguimiento: string;
  estado: string;
};

/*Endpoint para despachar una orden */
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ orden_id: string }> }
) {
  const authResult = await requireVendedor();
  if (!authResult.ok) return authResult.response;

  const { userId } = authResult;
  const status = await getVendedorActivoOrError(userId);

  if (!status.activo) {
    return jsonError(status.message || 'Vendedor inactivo', 403);
  }

  const params = await props.params;
  const { orden_id } = params;

  if (!isNonEmptyString(orden_id)) {
    return jsonError('orden_id es requerido', 400);
  }

  const { data: orden, error: ordenError } = await supabase
    .from('orden')
    .select('orden_id, nro_orden, estado_pago, estado_envio, estado_general, direccion_envio')
    .eq('nro_orden', orden_id)
    .single();

  if (ordenError || !orden) {
    return jsonError('Orden no encontrada', 404);
  }

  if (orden.estado_pago !== ESTADO_PAGO.APROBADO) {
    return jsonError('La orden no esta pagada', 400);
  }

  if (
    orden.estado_envio === ESTADO_ENVIO.DESPACHADO ||
    orden.estado_envio === ESTADO_ENVIO.ENTREGADO ||
    orden.estado_envio === ESTADO_ENVIO.CANCELADO
  ) {
    return jsonError('La orden ya no puede despacharse', 400);
  }

  if (
    orden.estado_general === ESTADO_GENERAL.COMPLETADA ||
    orden.estado_general === ESTADO_GENERAL.CANCELADA
  ) {
    return jsonError('La orden ya no puede despacharse', 400);
  }

  const { data: items } = await supabase
    .from('orden_item')
    .select('orden_id, producto:producto_id!inner (clerk_user_id)')
    .eq('orden_id', orden.orden_id)
    .eq('producto.clerk_user_id', userId)
    .limit(1);

  if (!items || items.length === 0) {
    return jsonError('No autorizado para despachar esta orden', 403);
  }

  let envioData: ShippingResponse;

  try {
    const response = await callShippingApi('/api/envios', {
      method: 'POST',
      body: JSON.stringify({
        orden_id: orden.nro_orden,
        direccion_destino: orden.direccion_envio,
        vendedor_id: userId,
      }),
    });

    if (!response.ok) {
      const message = await readInternalApiErrorMessage(response);
      return jsonError(
        `Error en Shipping App (${response.status})${message ? `: ${message}` : ''}`,
        502
      );
    }

    envioData = (await response.json()) as ShippingResponse;
  } catch (error) {
    if (error instanceof InternalApiConfigError) {
      return jsonError(error.message, 500);
    }

    if (error instanceof InternalApiRequestError) {
      return jsonError('Error de red con Shipping App', 502);
    }

    console.error('Error inesperado al llamar Shipping App', { error });
    return jsonError('Error de red con Shipping App', 502);
  }

  const { error: updateError } = await supabase
    .from('orden')
    .update({
      estado_envio: ESTADO_ENVIO.DESPACHADO,
      estado_general: ESTADO_GENERAL.ENVIADA,
      codigo_seguimiento: envioData.codigo_seguimiento,
      fecha_actualizacion: new Date().toISOString(),
    })
    .eq('orden_id', orden.orden_id);

  if (updateError) {
    return jsonError('No se pudo actualizar el estado de envio', 500);
  }

  return NextResponse.json(
    {
      orden_id: orden.nro_orden,
      envio_id: envioData.envio_id,
      empresa_logistica: envioData.empresa_logistica,
      codigo_seguimiento: envioData.codigo_seguimiento,
      estado: envioData.estado,
      estado_general: ESTADO_GENERAL.ENVIADA,
      estado_envio: ESTADO_ENVIO.DESPACHADO,
    },
    { status: 200 }
  );
}
