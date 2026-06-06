import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Producto } from '@/types';
import { isNonEmptyString, jsonError } from '@/app/api/_utils';

/*
Endpoint para obtener los detalles de un producto específico por su ID.
*/
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ producto_id: string }> }
) {
  const params = await props.params;
  const { producto_id } = params;

  if (!isNonEmptyString(producto_id)) {
    return jsonError('producto_id es requerido', 400);
  }

  const { data: producto, error } = await supabase
    .from('producto')
    .select('*')
    .eq('producto_id', producto_id)
    .eq('estado_publicacion', 'activa')
    .maybeSingle();

  if (error) {
    console.error('Error al obtener producto publico', error);
    return jsonError('No se pudo obtener el producto', 500);
  }

  if (!producto) {
    return jsonError('Producto no encontrado', 404);
  }

  const response = producto as Producto;

  return NextResponse.json(
    {
      ...response,
      vendedor_id: response.clerk_user_id,
    },
    { status: 200 }
  );
}

