import { NextResponse } from 'next/server';
import type { Producto } from '@/types';

export async function GET(request: Request, props: { params: Promise<{ producto_id: string }> }) {
  const params = await props.params;
  const { producto_id } = params;

  const producto: Producto = {
    producto_id,
    vendedor_id: 'VED-001',
    categoria_id: 'CAT-001',
    titulo: 'Producto de ejemplo',
    descripcion: 'Descripción del producto',
    precio: 99.99,
    imagenes: [],
    estado_prenda: 'nuevo',
    talle: 'M',
    marca: 'Marca ejemplo',
    stock: 10,
    estado_publicacion: 'activa',
    fecha_creacion: '2026-05-03',
  };

  return NextResponse.json(producto, { status: 200 });
}
