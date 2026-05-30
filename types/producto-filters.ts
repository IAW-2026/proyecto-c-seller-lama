import type { Producto, EstadoPublicacion } from '@/types/producto';

export interface ProductoSearchParams {
  search?: string;
  estado?: string;
  genero?: string;
  talle?: string;
  categoria?: string;
  page?: string;
}

export interface ProductoFilters {
  search?: string;
  estado?: EstadoPublicacion;
  genero?: string;
  talle?: string;
  categoria?: string;
  page: number;
  pageSize: number;
}

export interface CategoriaOption {
  value: string;
  label: string;
}

export interface ProductoConCategoria extends Producto {
  categoria_nombre: string;
}

export interface PaginatedProductosResult {
  productos: ProductoConCategoria[];
  total: number;
  totalPages: number;
  currentPage: number;
  filters: ProductoFilters;
}
