import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isNonEmptyString, jsonError } from '@/app/api/_utils';

/*
Endpoint para obtener el estado de una orden de venta específica por su ID.
*/
export async function GET(request: NextRequest, props: { params: Promise<{ orden_id: string }> }) {
  const params = await props.params;
  const { orden_id } = params;

  if (!isNonEmptyString(orden_id)) {
    return jsonError('orden_id es requerido', 400);
  }

  const { data, error } = await supabase
    .from('orden')
    .select('orden_id, estado_general, estado_pago, estado_envio, fecha_actualizacion')
    .eq('orden_id', orden_id)
    .order('fecha_actualizacion', { ascending: false })
    .limit(1);

  if (error) {
    return jsonError(error.message, 500);
  }

  const orden = data?.[0];
  if (!orden) {
    return jsonError('Orden no encontrada', 404);
  }

  return NextResponse.json(orden, { status: 200 });
}
