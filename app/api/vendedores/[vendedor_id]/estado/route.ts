import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireInternalApiKey } from '@/lib/api-auth';
import { isNonEmptyString, jsonError, parseJson } from '@/app/api/_utils';

type VendedorEstadoInput = {
  activo: boolean;
};

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ vendedor_id: string }> }
) {
  const authError = requireInternalApiKey(request);
  if (authError) return authError;

  const params = await props.params;
  const { vendedor_id } = params;

  if (!isNonEmptyString(vendedor_id)) {
    return jsonError('vendedor_id es requerido', 400);
  }

  const { data, error } = await parseJson<Partial<VendedorEstadoInput>>(request);
  if (error) return error;

  if (!data || typeof data.activo !== 'boolean') {
    return jsonError('activo debe ser boolean', 400);
  }

  const { data: updated, error: updateError } = await supabase
    .from('vendedor')
    .update({ activo: data.activo })
    .eq('clerk_user_id', vendedor_id)
    .select('clerk_user_id, nombre_vendedor, activo, fecha_actualizacion')
    .maybeSingle();

  if (updateError) {
    console.error('Error al actualizar estado de vendedor', updateError);
    return jsonError('No se pudo actualizar el estado del vendedor', 500);
  }

  if (!updated) {
    return jsonError('Vendedor no encontrado', 404);
  }

  return NextResponse.json(
    {
      vendedor_id: updated.clerk_user_id,
      nombre_vendedor: updated.nombre_vendedor,
      activo: updated.activo,
      fecha_actualizacion: updated.fecha_actualizacion,
    },
    { status: 200 }
  );
}
