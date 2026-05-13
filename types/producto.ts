export const ESTADOS_PUBLICACION = [
  'activa',
  'inactiva',
  'vendida',
] as const;

export type EstadoPublicacion = (typeof ESTADOS_PUBLICACION)[number];

export type EstadoFiltroProducto = EstadoPublicacion | 'todos';

export type EstadoPrenda = 'nuevo' | 'usado' | 'vintage';

export interface Producto {
  producto_id: string; // UUID
  clerk_user_id: string; // ID del vendedor (Clerk)
  categoria_id: string; // UUID de la categoría
  titulo: string;
  descripcion: string | null;
  precio: number;
  imagenes: string[] | null;
  estado_prenda: 'nuevo' | 'usado' | 'vintage';
  talle: string | null;
  marca: string | null;
  estado_publicacion: 'activa' | 'inactiva' | 'vendida';
  fecha_creacion: string; // ISO timestamp
}

/**
 * Datos del formulario de producto (para crear o editar)
 * Representa el estado UI de React - NUNCA debe tener null
 * Omite campos que se generan del lado del servidor
 * 
 * IMPORTANTE: Los inputs React SIEMPRE reciben strings/defaults válidos
 * Cuando se cargan datos desde Producto (que sí tiene null),
 * hacer transformación explícita: producto.descripcion ?? ''
 */
export interface ProductFormData {
  titulo: string;
  descripcion: string;
  precio: string;
  categoria_id: string;
  estado_prenda: 'nuevo' | 'usado' | 'vintage';
  talle: string;
  marca: string;
  estado_publicacion: 'activa' | 'inactiva' | 'vendida';
}
