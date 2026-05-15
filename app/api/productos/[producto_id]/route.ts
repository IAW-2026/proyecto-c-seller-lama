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

  // Traer producto de Supabase
  const { data: producto, error } = await supabase
    .from('producto')
    .select('*')
    .eq('producto_id', producto_id)
    .single();

  if (error || !producto) {
    return NextResponse.json(
      { error: error?.message || 'Producto no encontrado' },
      { status: error?.code === 'PGRST116' ? 404 : 500 }
    );
  }

  const response = producto as Producto;

  // NOTE: La BD usa clerk_user_id para el vendedor. Se expone vendedor_id como alias.
  return NextResponse.json(
    {
      ...response,
      vendedor_id: response.clerk_user_id,
    },
    { status: 200 }
  );
}

