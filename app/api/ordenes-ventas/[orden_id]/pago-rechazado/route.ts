import { NextResponse } from 'next/server';

export async function POST(request: Request, props: { params: Promise<{ orden_id: string }> }) {
  const params = await props.params;
  const { orden_id } = params;

  const respuesta = {
    orden_id,
    estado_pago: 'rechazado',
    estado_general: 'cancelada',
    fecha_actualizacion: '2026-05-03',
  };

  return NextResponse.json(respuesta, { status: 200 });
}
