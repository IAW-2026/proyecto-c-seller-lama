import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireServiceApiKey } from '@/lib/api-auth';
import type { Producto, Vendedor } from '@/types';
import { isNonEmptyString, jsonError } from '@/app/api/_utils';

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;
const SORT_RECENT = 'recent';
const SORT_PRICE_ASC = 'price_asc';
const SORT_PRICE_DESC = 'price_desc';

const parsePositiveInt = (
  value: string | null,
  fallback: number,
  max?: number
) => {
  const parsed = Number.parseInt(value || '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return max ? Math.min(parsed, max) : parsed;
};

const normalizeString = (value: string | null) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const normalizeSort = (value: string | null) => {
  if (!value) return SORT_RECENT;
  if (value === SORT_PRICE_ASC || value === SORT_PRICE_DESC) return value;
  return SORT_RECENT;
};

const buildSearchFilter = (search: string) => {
  const searchTerm = `%${search}%`;
  return [
    `titulo.ilike.${searchTerm}`,
    `descripcion.ilike.${searchTerm}`,
    `marca.ilike.${searchTerm}`,
  ].join(',');
};

const mapProductoResponse = (producto: Producto) => ({
  ...producto,
  vendedor_id: producto.clerk_user_id,
});

const getCategoriasForProductos = async (categoriaIds: string[]) => {
  if (categoriaIds.length === 0) return [];

  const { data, error } = await supabase
    .from('categoria_producto')
    .select('categoria_producto_id, nombre')
    .in('categoria_producto_id', categoriaIds)
    .order('nombre', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
};

const getVendedoresForProductos = async (
  vendedorIds: string[]
): Promise<Vendedor[]> => {
  if (vendedorIds.length === 0) return [];

  const { data, error } = await supabase
    .from('vendedor')
    .select('clerk_user_id, nombre_vendedor, email, telefono, fecha_creacion, activo')
    .in('clerk_user_id', vendedorIds);

  if (error || !data) {
    return [];
  }

  return data as Vendedor[];
};

/*Endpoint para listar productos con filtros de búsqueda, categoría, talle, género y ordenamiento */
export async function GET(request: NextRequest) {
  const authError = requireServiceApiKey(request, [
    'buyer',
    'control-plane',
    'analytics',
  ]);
  if (authError) return authError;

  const { searchParams } = request.nextUrl;

  const search = normalizeString(searchParams.get('search'));
  const categoria_id = normalizeString(searchParams.get('categoria_id'));
  const talle = normalizeString(searchParams.get('talle'));
  const genero = normalizeString(searchParams.get('genero'));
  const sort = normalizeSort(searchParams.get('sort'));
  const page = parsePositiveInt(searchParams.get('page'), 1);
  const pageSize = parsePositiveInt(
    searchParams.get('pageSize'),
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE
  );

  let query = supabase
    .from('producto')
    .select('*', { count: 'exact' })
    .eq('estado_publicacion', 'activa');

  if (search) {
    query = query.or(buildSearchFilter(search));
  }

  if (isNonEmptyString(categoria_id)) {
    query = query.eq('categoria_id', categoria_id);
  }

  if (isNonEmptyString(talle)) {
    query = query.eq('talle', talle);
  }

  if (isNonEmptyString(genero)) {
    query = query.eq('genero', genero);
  }

  if (sort === SORT_PRICE_ASC) {
    query = query.order('precio', { ascending: true });
  } else if (sort === SORT_PRICE_DESC) {
    query = query.order('precio', { ascending: false });
  } else {
    query = query.order('fecha_creacion', { ascending: false });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error('Error al listar productos publicos', error);
    return jsonError('No se pudieron obtener los productos', 500);
  }

  const productos = (data || []) as Producto[];
  const items = productos.map(mapProductoResponse);

  const categoriaIds = Array.from(
    new Set(productos.map((producto) => producto.categoria_id).filter(Boolean))
  ) as string[];
  const vendedorIds = Array.from(
    new Set(productos.map((producto) => producto.clerk_user_id).filter(Boolean))
  ) as string[];

  const [categorias, vendedores] = await Promise.all([
    getCategoriasForProductos(categoriaIds),
    getVendedoresForProductos(vendedorIds),
  ]);

  return NextResponse.json(
    {
      items,
      total: count || 0,
      page,
      pageSize,
      categorias,
      vendedores,
    },
    { status: 200 }
  );
}
