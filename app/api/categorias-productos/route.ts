import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireServiceApiKey } from '@/lib/api-auth';
import { jsonError } from '@/app/api/_utils';

/*Endpoint para obtener la lista de categorías de productos */
export async function GET(request: NextRequest) {
  const authError = requireServiceApiKey(request, [
    'buyer',
    'control-plane',
    'analytics',
  ]);
  if (authError) return authError;

  const { data, error } = await supabase
    .from('categoria_producto')
    .select('categoria_producto_id, nombre, descripcion, fecha_creacion')
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error al listar categorias publicas', error);
    return jsonError('No se pudieron obtener las categorias', 500);
  }

  return NextResponse.json({ items: data || [] }, { status: 200 });
}
