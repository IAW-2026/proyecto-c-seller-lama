'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FilterBar } from '@/components/ui/FilterBar';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterSelect } from '@/components/ui/FilterSelect';
import type { AdminDashboardFilters } from '@/types/admin-filters';
import { buildAdminQueryString } from '@/lib/admin/admin-query';
import { useAdminSearch } from '@/hooks/useAdminSearch';

interface FilterOption {
  label: string;
  value: string;
}

interface OrdenesFiltersProps {
  filters: AdminDashboardFilters;
  estadoGeneralOptions: FilterOption[];
  estadoPagoOptions: FilterOption[];
  estadoEnvioOptions: FilterOption[];
}

export function OrdenesFilters({
  filters,
  estadoGeneralOptions,
  estadoPagoOptions,
  estadoEnvioOptions,
}: OrdenesFiltersProps) {
  const router = useRouter();
  const { searchValue, handleChange } = useAdminSearch('ordenes', filters);

  const clearHref = buildAdminQueryString({
    ...filters,
    ordenes: { page: 1, pageSize: filters.ordenes.pageSize },
  }) + '#ordenes';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    // Include the current search value
    if (searchValue.trim()) {
      params.set('ordenes_search', searchValue.trim());
    }

    formData.forEach((value, key) => {
      if (value) params.set(key, value.toString());
    });
    router.push(`/admin?${params.toString()}#ordenes`);
  };

  return (
    <FilterBar>
      <form onSubmit={handleSubmit}>
        {/* Preserve vendedores params */}
        {filters.vendedores.search && (
          <input type="hidden" name="vendedores_search" value={filters.vendedores.search} />
        )}
        {filters.vendedores.activo && (
          <input type="hidden" name="vendedores_activo" value={filters.vendedores.activo} />
        )}
        {filters.vendedores.page > 1 && (
          <input type="hidden" name="vendedores_page" value={String(filters.vendedores.page)} />
        )}

        {/* Preserve productos params */}
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

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_auto] xl:items-end">
          <SearchInput
            name="ordenes_search"
            label="Búsqueda"
            placeholder="Buscar por nro de orden"
            value={searchValue}
            onChange={handleChange}
          />

          <FilterSelect
            name="ordenes_estado_general"
            label="Estado general"
            options={estadoGeneralOptions}
            defaultValue={filters.ordenes.estado_general || 'todos'}
          />

          <FilterSelect
            name="ordenes_estado_pago"
            label="Estado pago"
            options={estadoPagoOptions}
            defaultValue={filters.ordenes.estado_pago || 'todos'}
          />

          <FilterSelect
            name="ordenes_estado_envio"
            label="Estado envío"
            options={estadoEnvioOptions}
            defaultValue={filters.ordenes.estado_envio || 'todos'}
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
