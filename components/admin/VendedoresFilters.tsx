'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FilterBar } from '@/components/ui/FilterBar';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterSelect } from '@/components/ui/FilterSelect';
import type { AdminDashboardFilters } from '@/types/admin-filters';
import { buildAdminQueryString } from '@/lib/admin/admin-query';

interface FilterOption {
  label: string;
  value: string;
}

interface VendedoresFiltersProps {
  filters: AdminDashboardFilters;
  vendedorActivoOptions: FilterOption[];
}

export function VendedoresFilters({
  filters,
  vendedorActivoOptions,
}: VendedoresFiltersProps) {
  const router = useRouter();
  const clearHref = buildAdminQueryString({
    ...filters,
    vendedores: { page: 1, pageSize: filters.vendedores.pageSize },
  }) + '#vendedores';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      if (value) params.set(key, value.toString());
    });
    router.push(`/admin?${params.toString()}#vendedores`);
  };

  return (
    <FilterBar>
      <form onSubmit={handleSubmit}>
        {/* Preserve other sections' params as hidden inputs */}
        {filters.productos.search && (
          <input type="hidden" name="productos_search" value={filters.productos.search} />
        )}
        {filters.productos.vendedor && (
          <input type="hidden" name="productos_vendedor" value={filters.productos.vendedor} />
        )}
        {filters.productos.estado_publicacion && (
          <input type="hidden" name="productos_estado_publicacion" value={filters.productos.estado_publicacion} />
        )}
        {filters.productos.page > 1 && (
          <input type="hidden" name="productos_page" value={String(filters.productos.page)} />
        )}
        {filters.ordenes.search && (
          <input type="hidden" name="ordenes_search" value={filters.ordenes.search} />
        )}
        {filters.ordenes.estado_pago && (
          <input type="hidden" name="ordenes_estado_pago" value={filters.ordenes.estado_pago} />
        )}
        {filters.ordenes.estado_envio && (
          <input type="hidden" name="ordenes_estado_envio" value={filters.ordenes.estado_envio} />
        )}
        {filters.ordenes.estado_general && (
          <input type="hidden" name="ordenes_estado_general" value={filters.ordenes.estado_general} />
        )}
        {filters.ordenes.page > 1 && (
          <input type="hidden" name="ordenes_page" value={String(filters.ordenes.page)} />
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[2fr_1fr_auto] xl:items-end">
          <SearchInput
            name="vendedores_search"
            label="Búsqueda"
            placeholder="Buscar por nombre o email"
            defaultValue={filters.vendedores.search}
          />

          <FilterSelect
            name="vendedores_activo"
            label="Estado"
            options={vendedorActivoOptions}
            defaultValue={filters.vendedores.activo || 'todos'}
          />

          <div className="flex flex-col gap-2 text-sm font-semibold text-[#37413d]">
            <span>Acciones</span>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex h-12 flex-1 items-center justify-center rounded-xl border border-[#8fa18d] bg-[#8fa18d] px-6 text-sm font-semibold text-white transition hover:bg-[#7e937c]"
              >
                Aplicar
              </button>
              <Link
                href={clearHref}
                onClick={(e) => {
                  const form = e.currentTarget.closest('form');
                  if (form) form.reset();
                }}
                className="flex h-12 flex-1 items-center justify-center rounded-xl border border-[#d8cfbd] bg-white px-6 text-sm font-semibold text-[#37413d] transition hover:bg-[#ede6d8]"
              >
                Limpiar
              </Link>
            </div>
          </div>
        </div>
      </form>
    </FilterBar>
  );
}
