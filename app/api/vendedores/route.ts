import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireServiceApiKey } from '@/lib/api-auth';
import { isNonEmptyString, jsonError } from '@/app/api/_utils';

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

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

/*Endpoint para listar vendedores con filtros de búsqueda y paginación */
export async function GET(request: NextRequest) {
  const authError = requireServiceApiKey(request, [
    'control-plane',
    'analytics',
    'buyer',
  ]);
  if (authError) return authError;

  const { searchParams } = request.nextUrl;

  const search = normalizeString(searchParams.get('search'));
  const page = parsePositiveInt(searchParams.get('page'), 1);
  const pageSize = parsePositiveInt(
    searchParams.get('pageSize'),
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE
  );

  let query = supabase
    .from('vendedor')
    .select('clerk_user_id, nombre_vendedor', { count: 'exact' })
    .eq('activo', true);

  if (isNonEmptyString(search)) {
    const searchTerm = `%${search}%`;
    query = query.ilike('nombre_vendedor', searchTerm);
  }

  query = query.order('nombre_vendedor', { ascending: true });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error('Error al listar vendedores publicos', error);
    return jsonError('No se pudieron obtener los vendedores', 500);
  }

  const items = (data || []).map((vendedor) => ({
    vendedor_id: vendedor.clerk_user_id,
    nombre_vendedor: vendedor.nombre_vendedor,
  }));

  return NextResponse.json(
    {
      items,
      total: count || 0,
      page,
      pageSize,
    },
    { status: 200 }
  );
}
