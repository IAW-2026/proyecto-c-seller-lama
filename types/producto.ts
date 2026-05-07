export interface Producto {
  producto_id: string;
  vendedor_id: string;
  categoria_id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagenes: string[];
  estado_prenda: 'nuevo' | 'usado' | 'vintage';
  talle: string;
  marca: string;
  stock: number;
  estado_publicacion: 'activa' | 'inactiva' | 'vendida';
  fecha_creacion: string;
}
