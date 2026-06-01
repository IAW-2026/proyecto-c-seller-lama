import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jsonError } from '@/app/api/_utils';

/*Endpoint para obtener la lista de categorías de productos */
export async function GET(_request: NextRequest) {
  const { data, error } = await supabase
    .from('categoria_producto')
    .select('categoria_producto_id, nombre, descripcion, fecha_creacion')
    .order('nombre', { ascending: true });

  if (error) {
    return jsonError(error.message, 500);
  }

  return NextResponse.json({ items: data || [] }, { status: 200 });
}
