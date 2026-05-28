import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { ESTADO_ENVIO, ESTADO_GENERAL, ESTADO_PAGO } from '@/types/orden';
import { isNonEmptyString, jsonError } from '@/app/api/_utils';
import { getVendedorActivoOrError } from '@/lib/vendedor-status';

type ShippingResponse = {
  envio_id: string;
  empresa_logistica: string;
  codigo_seguimiento: string;
  estado: string;
};

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ orden_id: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return jsonError('No autenticado', 401);
  }

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
    .select('orden_id, estado_pago, estado_envio, estado_general, direccion_envio')
    .eq('orden_id', orden_id)
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
    .eq('orden_id', orden_id)
    .eq('producto.clerk_user_id', userId)
    .limit(1);

  if (!items || items.length === 0) {
    return jsonError('No autorizado para despachar esta orden', 403);
  }

  // Mock temporal de Shipping App para Etapa 2.
  // En integración real, reemplazar por fetch a `${SHIPPING_APP_URL}/api/envios`.
  const envioData: ShippingResponse = {
    envio_id: `envio_${orden_id}`,
    empresa_logistica: 'Mock Logistics',
    codigo_seguimiento: `MOCK-${orden_id.slice(-6).toUpperCase()}`,
    estado: 'pending',
  };

  const { error: updateError } = await supabase
    .from('orden')
    .update({
      estado_envio: ESTADO_ENVIO.DESPACHADO,
      codigo_seguimiento: envioData.codigo_seguimiento,
      fecha_actualizacion: new Date().toISOString(),
    })
    .eq('orden_id', orden_id);

  if (updateError) {
    return jsonError('No se pudo actualizar el estado de envio', 500);
  }

  return NextResponse.json(
    {
      orden_id,
      envio_id: envioData.envio_id,
      empresa_logistica: envioData.empresa_logistica,
      codigo_seguimiento: envioData.codigo_seguimiento,
      estado: envioData.estado,
      estado_envio: ESTADO_ENVIO.DESPACHADO,
    },
    { status: 200 }
  );
}
