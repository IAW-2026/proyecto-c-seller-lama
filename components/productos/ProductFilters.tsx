import Link from 'next/link';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterSelect } from '@/components/ui/FilterSelect';
import type { CategoriaOption } from '@/types/producto-filters';

interface FilterOption {
  label: string;
  value: string;
}

interface ProductFiltersProps {
  search?: string;
  estado?: string;
  genero?: string;
  talle?: string;
  categoria?: string;
  estadoOptions: FilterOption[];
  generoOptions: FilterOption[];
  categoriaOptions: CategoriaOption[];
}

export function ProductFilters({
  search,
  estado,
  genero,
  talle,
  categoria,
  estadoOptions,
  generoOptions,
  categoriaOptions,
}: ProductFiltersProps) {
  return (
    <div className="mb-8 sticky top-[56px] z-30">
      <form method="GET">
        <div className="rounded-2xl border border-[#d8cfbd]/70 bg-white/60 backdrop-blur-lg p-5 md:p-6 shadow-[0_2px_12px_rgba(55,65,61,0.05)]">
          {/* Top row: search */}
          <div className="mb-4">
            <SearchInput
              name="search"
              label="Búsqueda"
              placeholder="Buscar por título, talle o marca"
              defaultValue={search}
            />
          </div>

          {/* Filter selects grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <FilterSelect
              name="estado"
              label="Estado"
              options={estadoOptions}
              defaultValue={estado || 'todos'}
            />

            <FilterSelect
              name="genero"
              label="Género"
              options={generoOptions}
              defaultValue={genero || 'todos'}
            />

            <SearchInput
              name="talle"
              label="Talle"
              placeholder="Ej: M, 10, XL"
              defaultValue={talle}
            />

            <FilterSelect
              name="categoria"
              label="Categoría"
              options={categoriaOptions}
              defaultValue={categoria || 'todos'}
            />
          </div>

          {/* Actions row */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#d8cfbd]/40">
            <Link
              href="/productos"
              className="
                rounded-xl border border-[#d8cfbd] bg-white
                px-5 py-2.5 text-sm font-semibold text-[#6f7f6d]
                transition-all duration-300
                hover:bg-[#f6f1e7] hover:text-[#37413d] hover:border-[#8fa18d]/30
              "
            >
              Limpiar
            </Link>
            <button
              type="submit"
              className="
                rounded-xl bg-[#8fa18d]
                px-6 py-2.5 text-sm font-semibold text-white
                transition-all duration-300
                hover:bg-[#7a8c78] hover:shadow-lg hover:shadow-[#8fa18d]/25
                active:scale-[0.98]
              "
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
