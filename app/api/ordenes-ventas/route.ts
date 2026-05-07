import { NextResponse } from 'next/server';
import type { Orden } from '@/types';

export async function POST(request: Request) {
  const orden: Orden = {
    orden_id: 'ORD-001',
    comprador_id: 'COMP-001',
    nro_orden: 'ORD-001',
    total: 150.00,
    estado_general: 'pendiente_pago',
    estado_pago: 'pendiente',
    estado_envio: 'pendiente',
    direccion_envio: 'Calle ejemplo 123',
    fecha_creacion: '2026-05-03',
    fecha_actualizacion: '2026-05-03',
  };

  return NextResponse.json(orden, { status: 201 });
}

export async function GET(request: Request) {
  const ordenes: Orden[] = [
    {
      orden_id: 'ORD-001',
      comprador_id: 'COMP-001',
      nro_orden: 'ORD-001',
      total: 150.00,
      estado_general: 'pendiente_pago',
      estado_pago: 'pendiente',
      estado_envio: 'pendiente',
      direccion_envio: 'Calle ejemplo 123',
      fecha_creacion: '2026-05-03',
      fecha_actualizacion: '2026-05-03',
    },
  ];

  return NextResponse.json(ordenes, { status: 200 });
}
