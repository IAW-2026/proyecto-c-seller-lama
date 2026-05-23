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
    <form method="GET" className="mb-6">
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
        <SearchInput
          name="search"
          label="Busqueda"
          placeholder="Buscar por titulo, talle o marca"
          defaultValue={search}
        />

        <FilterSelect
          name="estado"
          label="Estado"
          options={estadoOptions}
          defaultValue={estado || 'todos'}
        />

        <FilterSelect
          name="genero"
          label="Genero"
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
          label="Categoria"
          options={categoriaOptions}
          defaultValue={categoria || 'todos'}
        />

        <div className="flex flex-col gap-2 text-sm font-medium text-[#37413d]">
          <span>Acciones</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded-lg border border-[#8fa18d] bg-[#8fa18d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7e937c]"
            >
              Aplicar
            </button>
            <Link
              href="/productos"
              className="rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm font-semibold text-[#37413d] transition hover:bg-[#ede6d8]"
            >
              Limpiar
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
