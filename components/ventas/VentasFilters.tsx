"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FilterSelect } from '@/components/ui/FilterSelect';

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
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(search ?? '');
  const formRef = useRef<HTMLFormElement | null>(null);
  const isFirstRender = useRef(true);
  const lastSubmittedValue = useRef((search ?? '').trim());
  const isSyncingSearch = useRef(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeFiltersCount = useMemo(() => {
    const normalizedSearch = search?.trim();

    return [
      normalizedSearch,
      estado_pago && estado_pago !== 'todos' ? estado_pago : '',
      estado_envio && estado_envio !== 'todos' ? estado_envio : '',
      estado_general && estado_general !== 'todos' ? estado_general : '',
      from?.trim(),
      to?.trim(),
    ].filter(Boolean).length;
  }, [search, estado_pago, estado_envio, estado_general, from, to]);

  useEffect(() => {
    isSyncingSearch.current = true;
    setSearchValue(search ?? '');
  }, [search]);

  const applyFilters = () => {
    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    const nextParams = new URLSearchParams(searchParams.toString());

    const normalizeValue = (value: FormDataEntryValue | null) =>
      typeof value === 'string' ? value.trim() : '';

    const searchInput = normalizeValue(formData.get('search'));
    const estadoPagoInput = normalizeValue(formData.get('estado_pago'));
    const estadoEnvioInput = normalizeValue(formData.get('estado_envio'));
    const estadoGeneralInput = normalizeValue(formData.get('estado_general'));
    const fromInput = normalizeValue(formData.get('from'));
    const toInput = normalizeValue(formData.get('to'));

    if (searchInput) {
      nextParams.set('search', searchInput);
    } else {
      nextParams.delete('search');
    }

    if (estadoPagoInput && estadoPagoInput !== 'todos') {
      nextParams.set('estado_pago', estadoPagoInput);
    } else {
      nextParams.delete('estado_pago');
    }

    if (estadoEnvioInput && estadoEnvioInput !== 'todos') {
      nextParams.set('estado_envio', estadoEnvioInput);
    } else {
      nextParams.delete('estado_envio');
    }

    if (estadoGeneralInput && estadoGeneralInput !== 'todos') {
      nextParams.set('estado_general', estadoGeneralInput);
    } else {
      nextParams.delete('estado_general');
    }

    if (fromInput) {
      nextParams.set('from', fromInput);
    } else {
      nextParams.delete('from');
    }

    if (toInput) {
      nextParams.set('to', toInput);
    } else {
      nextParams.delete('to');
    }

    nextParams.delete('page');

    const query = nextParams.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isSyncingSearch.current) {
      isSyncingSearch.current = false;
      return;
    }

    const normalizedValue = searchValue.trim();
    const normalizedSearch = (search ?? '').trim();

    if (normalizedValue === normalizedSearch) {
      return;
    }

    if (normalizedValue === lastSubmittedValue.current) {
      return;
    }

    const debounce = window.setTimeout(() => {
      lastSubmittedValue.current = normalizedValue;
      applyFilters();
    }, 300);

    return () => window.clearTimeout(debounce);
  }, [searchValue, search]);

  return (
    <div className="mb-6 sticky top-[56px] z-30">
      <form
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          applyFilters();
        }}
      >
        <div className="rounded-2xl border border-[#d8cfbd]/70 bg-white/70 backdrop-blur-lg shadow-[0_4px_18px_rgba(55,65,61,0.08)]">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-3 md:p-4">
            <div className="relative flex-1">
              <label htmlFor="ventas-search" className="sr-only">
                Buscar ventas
              </label>
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6f7f6d]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="ventas-search"
                type="text"
                name="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Buscar ventas..."
                className="
                  h-12 w-full rounded-xl border border-[#d8cfbd]
                  bg-white/90 pl-11 pr-4 text-sm text-[#37413d]
                  shadow-sm outline-none transition
                  placeholder:text-[#7b857d]
                  focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/25
                "
              />
            </div>

            <div className="flex w-full md:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-controls="ventas-filters-panel"
                className="
                  inline-flex items-center justify-center gap-2
                  h-12 rounded-xl border border-[#d8cfbd]
                  bg-[#f6f1e7] px-4 text-sm font-semibold text-[#37413d]
                  transition-all duration-200
                  hover:border-[#8fa18d]/40 hover:bg-white
                "
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="7" y1="12" x2="17" y2="12" />
                  <line x1="10" y1="18" x2="14" y2="18" />
                </svg>
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center rounded-full bg-[#8fa18d] px-2 py-0.5 text-[11px] font-semibold text-white">
                    {activeFiltersCount}
                  </span>
                )}
                {isPending && (
                  <span className="ml-1 inline-flex h-4 w-4 items-center justify-center">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#8fa18d] border-t-transparent" />
                  </span>
                )}
              </button>
            </div>
          </div>

          <div
            id="ventas-filters-panel"
            className={`
              overflow-hidden border-t border-[#d8cfbd]/50
              transition-[max-height,opacity,transform] duration-300 ease-out
              ${
                isOpen
                  ? 'max-h-[480px] opacity-100 translate-y-0'
                  : 'max-h-0 opacity-0 -translate-y-1'
              }
            `}
          >
            <div className="bg-[#f6f1e7]/60 px-4 py-4 md:px-5 md:py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
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
                      shadow-sm outline-none transition
                      focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/25
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
                      shadow-sm outline-none transition
                      focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/25
                    "
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <Link
                  href="/ventas"
                  className="
                    rounded-lg border border-[#d8cfbd] bg-white
                    px-4 py-2 text-xs font-semibold text-[#6f7f6d]
                    transition-all duration-200
                    hover:bg-[#f6f1e7] hover:text-[#37413d] hover:border-[#8fa18d]/30
                  "
                >
                  Limpiar
                </Link>
                <button
                  type="submit"
                  className="
                    rounded-lg bg-[#8fa18d]
                    px-4 py-2 text-xs font-semibold text-white
                    transition-all duration-200
                    hover:bg-[#7a8c78] hover:shadow-lg hover:shadow-[#8fa18d]/25
                    active:scale-[0.98]
                  "
                >
                  {isPending ? 'Aplicando...' : 'Aplicar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
