import type {
  EstadoEnvio,
  EstadoGeneral,
  EstadoPago,
  OrdenConItems,
} from '@/types/orden';

export interface VentasSearchParams {
  search?: string;
  estado_pago?: string;
  estado_envio?: string;
  estado_general?: string;
  from?: string;
  to?: string;
  page?: string;
}

export interface VentasFilters {
  search?: string;
  estado_pago?: EstadoPago;
  estado_envio?: EstadoEnvio;
  estado_general?: EstadoGeneral;
  from?: string;
  to?: string;
  page: number;
  pageSize: number;
}

export interface VentasStatsSummary {
  totalVentas: number;
  totalIngresos: number;
  ventasPendientes: number;
  ventasCompletas: number;
  ventasCanceladas: number;
}

export interface PaginatedVentasResult {
  ordenes: OrdenConItems[];
  total: number;
  totalPages: number;
  currentPage: number;
  filters: VentasFilters;
  stats: VentasStatsSummary;
}
