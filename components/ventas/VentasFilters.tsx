import Link from 'next/link';
import { FilterSelect } from '@/components/ui/FilterSelect';
import { SearchInput } from '@/components/ui/SearchInput';

interface FilterOption {
  label: string;
  value: string;
}

interface VentasFiltersProps {
  search?: string;
  estado_pago?: string;
  estado_envio?: string;
  estado_general?: string;
  from?: string;
  to?: string;
  estadoPagoOptions: FilterOption[];
  estadoEnvioOptions: FilterOption[];
  estadoGeneralOptions: FilterOption[];
}

export function VentasFilters({
  search,
  estado_pago,
  estado_envio,
  estado_general,
  from,
  to,
  estadoPagoOptions,
  estadoEnvioOptions,
  estadoGeneralOptions,
}: VentasFiltersProps) {
  return (
    <form method="GET" className="mb-6">
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto]">
        <SearchInput
          name="search"
          label="Busqueda"
          placeholder="Buscar por orden, producto o direccion"
          defaultValue={search}
        />

        <FilterSelect
          name="estado_pago"
          label="Estado pago"
          options={estadoPagoOptions}
          defaultValue={estado_pago || 'todos'}
        />

        <FilterSelect
          name="estado_envio"
          label="Estado envio"
          options={estadoEnvioOptions}
          defaultValue={estado_envio || 'todos'}
        />

        <FilterSelect
          name="estado_general"
          label="Estado general"
          options={estadoGeneralOptions}
          defaultValue={estado_general || 'todos'}
        />

        <label className="flex flex-col gap-2 text-sm font-medium text-[#37413d]">
          Desde
          <input
            type="date"
            name="from"
            defaultValue={from || ''}
            className="w-full rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm text-[#37413d] outline-none focus:border-[#8fa18d]"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-[#37413d]">
          Hasta
          <input
            type="date"
            name="to"
            defaultValue={to || ''}
            className="w-full rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm text-[#37413d] outline-none focus:border-[#8fa18d]"
          />
        </label>

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
              href="/ventas"
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
