import { supabase } from '@/lib/supabase';
import {
  ESTADOS_PUBLICACION,
  type EstadoPublicacion,
} from '@/types/producto';
import type {
  CategoriaOption,
  PaginatedProductosResult,
  ProductoFilters,
  ProductoSearchParams,
} from '@/types/producto-filters';

const PAGE_SIZE = 12;
const GENERO_HOMBRE = 'hombre';
const GENERO_HOMBRE_ALT = 'hombre ';
const GENEROS_VALIDOS = ['hombre', 'mujer', 'niños'] as const;
const TODOS_VALUE = 'todos';

export interface CategoriaRecord {
  categoria_producto_id: string;
  nombre: string;
}

interface GetProductosParams {
  userId: string;
  searchParams?: ProductoSearchParams;
  categorias?: CategoriaRecord[];
}

const normalizeString = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const normalizeEstado = (value?: string): EstadoPublicacion | undefined => {
  if (!value || value === TODOS_VALUE) return undefined;
  if (ESTADOS_PUBLICACION.includes(value as EstadoPublicacion)) {
    return value as EstadoPublicacion;
  }
  return undefined;
};

const normalizeGenero = (value?: string): string | undefined => {
  if (!value || value === TODOS_VALUE) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (GENEROS_VALIDOS.includes(trimmed as (typeof GENEROS_VALIDOS)[number])) {
    return trimmed;
  }
  return undefined;
};

const normalizeCategoria = (
  value?: string,
  categorias?: CategoriaRecord[]
): string | undefined => {
  if (!value || value === TODOS_VALUE) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!categorias || categorias.length === 0) {
    return trimmed;
  }
  const exists = categorias.some(
    (categoria) => categoria.categoria_producto_id === trimmed
  );
  return exists ? trimmed : undefined;
};

const normalizePage = (value?: string) => {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

export const buildProductosQueryString = (
  filters: ProductoFilters,
  overrides: Partial<ProductoFilters> = {}
) => {
  const params = new URLSearchParams();
  const merged = {
    ...filters,
    ...overrides,
  };

  if (merged.search) params.set('search', merged.search);
  if (merged.estado) params.set('estado', merged.estado);
  if (merged.genero) params.set('genero', merged.genero);
  if (merged.talle) params.set('talle', merged.talle);
  if (merged.categoria) params.set('categoria', merged.categoria);
  if (merged.page && merged.page > 1) params.set('page', String(merged.page));

  const query = params.toString();
  return query ? `/productos?${query}` : '/productos';
};

export const getCategorias = async (): Promise<CategoriaRecord[]> => {
  const { data, error } = await supabase
    .from('categoria_producto')
    .select('categoria_producto_id, nombre')
    .order('nombre', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
};

export const getCategoriasOptions = (
  categorias: CategoriaRecord[]
): CategoriaOption[] =>
  categorias.map((categoria) => ({
    value: categoria.categoria_producto_id,
    label: categoria.nombre,
  }));

export const parseProductosFilters = (
  searchParams?: ProductoSearchParams,
  categorias?: CategoriaRecord[]
): ProductoFilters => {
  const search = normalizeString(searchParams?.search);
  const estado = normalizeEstado(searchParams?.estado);
  const genero = normalizeGenero(searchParams?.genero);
  const talle = normalizeString(searchParams?.talle);
  const categoria = normalizeCategoria(searchParams?.categoria, categorias);
  const page = normalizePage(searchParams?.page);

  return {
    search,
    estado,
    genero,
    talle,
    categoria,
    page,
    pageSize: PAGE_SIZE,
  };
};

export const getProductosConFiltros = async ({
  userId,
  searchParams,
  categorias,
}: GetProductosParams): Promise<PaginatedProductosResult> => {
  const filters = parseProductosFilters(searchParams, categorias);
  const from = (filters.page - 1) * filters.pageSize;
  const to = from + filters.pageSize - 1;

  let query = supabase
    .from('producto')
    .select(
      `
      *,
      categoria_producto (
        nombre
      )
      `,
      { count: 'exact' }
    )
    .eq('clerk_user_id', userId);

  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    query = query.or(
      `titulo.ilike.${searchTerm},talle.ilike.${searchTerm},marca.ilike.${searchTerm}`
    );
  }

  if (filters.estado) {
    query = query.eq('estado_publicacion', filters.estado);
  }

  if (filters.genero) {
    if (filters.genero === GENERO_HOMBRE) {
      query = query.in('genero', [GENERO_HOMBRE, GENERO_HOMBRE_ALT]);
    } else {
      query = query.eq('genero', filters.genero);
    }
  }

  if (filters.talle) {
    query = query.eq('talle', filters.talle);
  }

  if (filters.categoria) {
    query = query.eq('categoria_id', filters.categoria);
  }

  const { data: productosConCategoria, error, count } = await query.range(
    from,
    to
  );

  if (error) {
    return {
      productos: [],
      total: 0,
      totalPages: 1,
      currentPage: filters.page,
      filters,
    };
  }

  const productos = (productosConCategoria || []).map((prod: any) => ({
    ...prod,
    categoria_nombre: prod.categoria_producto?.nombre || 'Sin categoría',
  }));

  const total = count || 0;
  const totalPages = total > 0 ? Math.ceil(total / filters.pageSize) : 1;
  const currentPage = Math.min(filters.page, totalPages);

  return {
    productos,
    total,
    totalPages,
    currentPage,
    filters,
  };
};

export const getEstadoOptions = () => [
  { label: 'Todos', value: TODOS_VALUE },
  { label: 'Activa', value: 'activa' },
  { label: 'Inactiva', value: 'inactiva' },
  { label: 'Vendida', value: 'vendida' },
];

export const getGeneroOptions = () => [
  { label: 'Todos', value: TODOS_VALUE },
  { label: 'Hombre', value: 'hombre' },
  { label: 'Mujer', value: 'mujer' },
  { label: 'Ninos', value: 'niños' },
];

export const getCategoriaOptionsWithAll = (
  categorias: CategoriaOption[]
): CategoriaOption[] => [{ label: 'Todas', value: TODOS_VALUE }, ...categorias];
