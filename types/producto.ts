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
 * Omite campos que se generan del lado del servidor
 */
export interface ProductFormData {
  titulo: string;
  descripcion: string | null;
  precio: string; // String porque viene del input del formulario
  categoria_id: string;
  estado_prenda: 'nuevo' | 'usado' | 'vintage';
  talle: string | null;
  marca: string | null;
  estado_publicacion: 'activa' | 'inactiva' | 'vendida';
}
