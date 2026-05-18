export const ESTADO_GENERAL_VALUES = [
  'pendiente_pago',
  'pagada',
  'en_preparacion',
  'enviada',
  'completada',
  'cancelada',
] as const;

export const ESTADO_GENERAL = {
  PENDIENTE_PAGO: 'pendiente_pago',
  PAGADA: 'pagada',
  EN_PREPARACION: 'en_preparacion',
  ENVIADA: 'enviada',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada',
} as const;

export const ESTADO_PAGO_VALUES = ['pendiente', 'aprobado', 'rechazado'] as const;

export const ESTADO_PAGO = {
  PENDIENTE: 'pendiente',
  APROBADO: 'aprobado',
  RECHAZADO: 'rechazado',
} as const;

export const ESTADO_ENVIO_VALUES = [
  'pendiente',
  'en_preparacion',
  'despachado',
  'entregado',
  'cancelado',
] as const;

export const ESTADO_ENVIO = {
  PENDIENTE: 'pendiente',
  EN_PREPARACION: 'en_preparacion',
  DESPACHADO: 'despachado',
  ENTREGADO: 'entregado',
  CANCELADO: 'cancelado',
} as const;

export type EstadoGeneral = (typeof ESTADO_GENERAL_VALUES)[number];
export type EstadoPago = (typeof ESTADO_PAGO_VALUES)[number];
export type EstadoEnvio = (typeof ESTADO_ENVIO_VALUES)[number];

export interface Orden {
  orden_id: string;
  clerk_user_id: string;
  nro_orden: string;
  total: number;
  estado_general: EstadoGeneral;
  estado_pago: EstadoPago;
  estado_envio: EstadoEnvio;
  estado_liquidacion_vendedor: 'pendiente' | 'pagada';
  direccion_envio: string;
  motivo: string | null;
  codigo_seguimiento: string | null;
  fecha_rechazo_pago: string | null;
  fecha_liquidacion_vendedor: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface OrdenItem {
  orden_item_id: string;
  orden_id: string;
  producto_id: string;
  precio_unitario: number;
  fecha_creacion: string;
  producto?: {
    titulo: string | null;
    clerk_user_id?: string | null;
    estado_publicacion?: 'activa' | 'inactiva' | 'vendida' | null;
  } | null;
}

export interface OrdenConItems extends Orden {
  items: OrdenItem[];
}