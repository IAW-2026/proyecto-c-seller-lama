import type { Orden, Producto, Vendedor } from '@/types';

export interface AdminSearchParams {
  vendedores_search?: string;
  vendedores_activo?: string;
  vendedores_page?: string;

  productos_search?: string;
  productos_vendedor?: string;
  productos_estado_publicacion?: string;
  productos_page?: string;

  ordenes_search?: string;
  ordenes_estado_pago?: string;
  ordenes_estado_envio?: string;
  ordenes_estado_general?: string;
  ordenes_page?: string;
}

export interface AdminVendedoresFilters {
  search?: string;
  activo?: 'activa' | 'inactiva';
  page: number;
  pageSize: number;
}

export interface AdminProductosFilters {
  search?: string;
  vendedor?: string;
  estado_publicacion?: string;
  page: number;
  pageSize: number;
}

export interface AdminOrdenesFilters {
  search?: string;
  estado_pago?: string;
  estado_envio?: string;
  estado_general?: string;
  page: number;
  pageSize: number;
}

export type ProductoConVendedor = Producto & {
  vendedor?: {
    nombre_vendedor: string;
  } | null;
};

export interface AdminPagedResult<T> {
  items: T[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface AdminDashboardFilters {
  vendedores: AdminVendedoresFilters;
  productos: AdminProductosFilters;
  ordenes: AdminOrdenesFilters;
}

export interface AdminDashboardResult {
  vendedores: AdminPagedResult<Vendedor>;
  productos: AdminPagedResult<ProductoConVendedor>;
  ordenes: AdminPagedResult<Orden>;
  filters: AdminDashboardFilters;
}