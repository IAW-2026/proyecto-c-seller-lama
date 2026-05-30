export const ESTADOS_PUBLICACION = [
  'activa',
  'inactiva',
  'vendida',
] as const;

export type EstadoPublicacion = (typeof ESTADOS_PUBLICACION)[number];

export type EstadoPrenda = 'nuevo' | 'usado' | 'vintage';

export type GeneroProducto = 'hombre' | 'mujer' | 'niños';

export interface Producto {
  producto_id: string; 
  clerk_user_id: string; 
  categoria_id: string; 
  titulo: string;
  descripcion: string | null;
  precio: number;
  imagenes: string[] | null;
  estado_prenda: 'nuevo' | 'usado' | 'vintage';
  talle: string | null;
  marca: string | null;
  genero: GeneroProducto;
  estado_publicacion: 'activa' | 'inactiva' | 'vendida';
  fecha_creacion: string; // ISO timestamp
}

export interface ProductFormData {
  titulo: string;
  descripcion: string;
  precio: string;
  categoria_id: string;
  estado_prenda: 'nuevo' | 'usado' | 'vintage';
  talle: string;
  marca: string;
  estado_publicacion: 'activa' | 'inactiva' | 'vendida';
  genero: GeneroProducto;
}
