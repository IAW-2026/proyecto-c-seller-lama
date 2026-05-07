import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Producto } from '@/types';

export async function GET(
  request: Request,
  props: { params: Promise<{ producto_id: string }> }
) {
  const params = await props.params;
  const { producto_id } = params;

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

  return NextResponse.json(producto as Producto, { status: 200 });
}

