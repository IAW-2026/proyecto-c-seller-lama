import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Producto } from '@/types';
import { isNonEmptyString, jsonError } from '@/app/api/_utils';

const parseIds = (raw: string | null) => {
  if (!raw) return [];
  return raw
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
};

const mapProductoResponse = (producto: Producto) => ({
  ...producto,
  vendedor_id: producto.clerk_user_id,
});

/*Endpoint para obtener los detalles de múltiples productos por sus IDs */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ids = parseIds(searchParams.get('ids'));

  if (ids.length === 0) {
    return jsonError('ids es requerido', 400);
  }

  if (!ids.every(isNonEmptyString)) {
    return jsonError('ids contiene valores invalidos', 400);
  }

  const { data, error } = await supabase
    .from('producto')
    .select('*')
    .in('producto_id', ids)
    .eq('estado_publicacion', 'activa');

  if (error) {
    console.error('Error al obtener productos bulk publicos', error);
    return jsonError('No se pudieron obtener los productos', 500);
  }

  const productos = (data || []) as Producto[];

  return NextResponse.json(
    {
      items: productos.map(mapProductoResponse),
    },
    { status: 200 }
  );
}
