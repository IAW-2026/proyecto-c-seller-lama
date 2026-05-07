import { NextResponse } from 'next/server';
import type { Orden } from '@/types';

export async function GET(request: Request, props: { params: Promise<{ orden_id: string }> }) {
  const params = await props.params;
  const { orden_id } = params;

  const orden: Partial<Orden> = {
    orden_id,
    estado_general: 'pendiente_pago',
    estado_pago: 'pendiente',
    estado_envio: 'pendiente',
  };

  return NextResponse.json(orden, { status: 200 });
}
