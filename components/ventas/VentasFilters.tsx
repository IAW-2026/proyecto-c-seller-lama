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
    <div className="mb-6 sticky top-[56px] z-30">
      <form method="GET">
        <div className="rounded-2xl border border-[#d8cfbd]/70 bg-white/60 backdrop-blur-lg p-5 md:p-6 shadow-[0_2px_12px_rgba(55,65,61,0.05)]">
          {/* Top row: search */}
          <div className="mb-4">
            <SearchInput
              name="search"
              label="Búsqueda"
              placeholder="Buscar por orden, producto o dirección"
              defaultValue={search}
            />
          </div>

          {/* Filter selects grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
            <FilterSelect
              name="estado_pago"
              label="Estado pago"
              options={estadoPagoOptions}
              defaultValue={estado_pago || 'todos'}
            />

            <FilterSelect
              name="estado_envio"
              label="Estado envío"
              options={estadoEnvioOptions}
              defaultValue={estado_envio || 'todos'}
            />

            <FilterSelect
              name="estado_general"
              label="Estado general"
              options={estadoGeneralOptions}
              defaultValue={estado_general || 'todos'}
            />

            <label className="flex flex-col gap-2 text-sm font-semibold text-[#37413d]">
              <span>Desde</span>
              <input
                type="date"
                name="from"
                defaultValue={from || ''}
                className="
                  h-12 w-full rounded-xl border border-[#d8cfbd]
                  bg-white px-4 text-sm text-[#37413d]
                  shadow-sm outline-none transition-all duration-300
                  focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20
                  focus:shadow-[0_0_0_3px_rgba(143,161,141,0.08)]
                "
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-[#37413d]">
              <span>Hasta</span>
              <input
                type="date"
                name="to"
                defaultValue={to || ''}
                className="
                  h-12 w-full rounded-xl border border-[#d8cfbd]
                  bg-white px-4 text-sm text-[#37413d]
                  shadow-sm outline-none transition-all duration-300
                  focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20
                  focus:shadow-[0_0_0_3px_rgba(143,161,141,0.08)]
                "
              />
            </label>
          </div>

          {/* Actions row */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#d8cfbd]/40">
            <Link
              href="/ventas"
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
