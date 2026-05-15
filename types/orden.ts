export interface Orden {
  orden_id: string;
  clerk_user_id: string;
  nro_orden: string;
  total: number;
  estado_general: 'pendiente_pago' | 'pagada' | 'en_preparacion' | 'enviada' | 'cancelada';
  estado_pago: 'pendiente' | 'aprobado' | 'rechazado';
  estado_envio: 'pendiente' | 'en_preparacion' | 'despachado' | 'entregado' | 'cancelado';
  direccion_envio: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface OrdenConProducto extends Orden {
  producto_titulo?: string;
}