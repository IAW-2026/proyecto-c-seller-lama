import { NextResponse, type NextRequest } from 'next/server';
import { isNonEmptyString, jsonError } from '@/app/api/_utils';
import { requireVendedor } from '@/lib/api-auth';
import { getVendedorActivoOrError } from '@/lib/vendedor-status';
import { supabase } from '@/lib/supabase';
import type { EnvioDetalle } from '@/types/envio';
import {
  callShippingApi,
  InternalApiConfigError,
  InternalApiRequestError,
} from '@/lib/internal-api-client';

/*Endpoint para obtener los detalles de un envio */
export async function GET(
  _request: NextRequest,
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
    .select('orden_id, nro_orden')
    .eq('nro_orden', orden_id)
    .single();

  if (ordenError || !orden) {
    return jsonError('Orden no encontrada', 404);
  }

  const { data: items } = await supabase
    .from('orden_item')
    .select('orden_id, producto:producto_id!inner (clerk_user_id)')
    .eq('orden_id', orden.orden_id)
    .eq('producto.clerk_user_id', userId)
    .limit(1);

  if (!items || items.length === 0) {
    return jsonError('No autorizado para ver este envio', 403);
  }

  try {
    const response = await callShippingApi(
      `/api/envios/orden/${encodeURIComponent(orden.nro_orden)}`,
      {
        method: 'GET',
        expectedStatuses: [404, 204],
      }
    );

    if (response.status === 404 || response.status === 204) {
      return jsonError('No hay envio disponible', 404);
    }

    if (!response.ok) {
      return jsonError('Error en Shipping App', 502);
    }

    const envioData = (await response.json()) as EnvioDetalle;

    return NextResponse.json(envioData, { status: 200 });
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
}
