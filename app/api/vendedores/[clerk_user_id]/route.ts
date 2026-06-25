import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireInternalApiKey } from '@/lib/api-auth';
import { isNonEmptyString, jsonError, parseJson } from '@/app/api/_utils';

type VendedorUpdateInput = {
  nombre_vendedor?: string;
  dni?: string;
  email?: string;
  telefono?: string;
  activo?: boolean;
  clerk_user_id?: unknown;
};

type VendedorUpdatePayload = {
  nombre_vendedor?: string;
  dni?: string;
  email?: string;
  telefono?: string;
  activo?: boolean;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const addStringField = (
  payload: VendedorUpdatePayload,
  data: VendedorUpdateInput,
  field: keyof Pick<
    VendedorUpdateInput,
    'nombre_vendedor' | 'dni' | 'email' | 'telefono'
  >
) => {
  if (!(field in data)) return null;

  const value = data[field];

  if (typeof value !== 'string') {
    return jsonError(`${field} debe ser string`, 400);
  }

  payload[field] = value;
  return null;
};

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ clerk_user_id: string }> }
) {
  const authError = requireInternalApiKey(request);
  if (authError) return authError;

  const params = await props.params;
  const { clerk_user_id } = params;

  if (!isNonEmptyString(clerk_user_id)) {
    return jsonError('clerk_user_id es requerido', 400);
  }

  const { data, error } = await parseJson<VendedorUpdateInput>(request);
  if (error) return error;

  if (!isPlainObject(data) || Object.keys(data).length === 0) {
    return jsonError('Body requerido', 400);
  }

  if ('clerk_user_id' in data) {
    return jsonError('No se puede modificar clerk_user_id', 400);
  }

  const updatePayload: VendedorUpdatePayload = {};

  const stringFields: Array<
    keyof Pick<
      VendedorUpdateInput,
      'nombre_vendedor' | 'dni' | 'email' | 'telefono'
    >
  > = ['nombre_vendedor', 'dni', 'email', 'telefono'];

  for (const field of stringFields) {
    const fieldError = addStringField(updatePayload, data, field);
    if (fieldError) return fieldError;
  }

  if ('activo' in data) {
    if (typeof data.activo !== 'boolean') {
      return jsonError('activo debe ser boolean', 400);
    }

    updatePayload.activo = data.activo;
  }

  if (Object.keys(updatePayload).length === 0) {
    return jsonError('No hay campos validos para actualizar', 400);
  }

  const { data: updated, error: updateError } = await supabase
    .from('vendedor')
    .update(updatePayload)
    .eq('clerk_user_id', clerk_user_id)
    .select('clerk_user_id, nombre_vendedor, dni, email, telefono, activo')
    .maybeSingle();

  if (updateError) {
    console.error('Error al actualizar vendedor desde Control Plane', updateError);
    return jsonError('No se pudo actualizar el vendedor', 500);
  }

  if (!updated) {
    return jsonError('Vendedor no encontrado', 404);
  }

  return NextResponse.json(
    {
      clerk_user_id: updated.clerk_user_id,
      nombre_vendedor: updated.nombre_vendedor,
      dni: updated.dni,
      email: updated.email,
      telefono: updated.telefono,
      activo: updated.activo,
    },
    { status: 200 }
  );
}
