"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
    const normalizedTalle = talle?.trim();

    return [
      normalizedSearch,
      normalizedTalle,
      estado && estado !== 'todos' ? estado : '',
      genero && genero !== 'todos' ? genero : '',
      categoria && categoria !== 'todos' ? categoria : '',
    ].filter(Boolean).length;
  }, [search, talle, estado, genero, categoria]);

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
    const talleInput = normalizeValue(formData.get('talle'));
    const estadoInput = normalizeValue(formData.get('estado'));
    const generoInput = normalizeValue(formData.get('genero'));
    const categoriaInput = normalizeValue(formData.get('categoria'));

    if (searchInput) {
      nextParams.set('search', searchInput);
    } else {
      nextParams.delete('search');
    }

    if (talleInput) {
      nextParams.set('talle', talleInput);
    } else {
      nextParams.delete('talle');
    }

    if (estadoInput && estadoInput !== 'todos') {
      nextParams.set('estado', estadoInput);
    } else {
      nextParams.delete('estado');
    }

    if (generoInput && generoInput !== 'todos') {
      nextParams.set('genero', generoInput);
    } else {
      nextParams.delete('genero');
    }

    if (categoriaInput && categoriaInput !== 'todos') {
      nextParams.set('categoria', categoriaInput);
    } else {
      nextParams.delete('categoria');
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
              <label htmlFor="product-search" className="sr-only">
                Buscar productos
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
                id="product-search"
                type="text"
                name="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Buscar productos..."
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
                aria-controls="product-filters-panel"
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
            id="product-filters-panel"
            className={`
              overflow-hidden border-t border-[#d8cfbd]/50
              transition-[max-height,opacity,transform] duration-300 ease-out
              ${
                isOpen
                  ? 'max-h-[420px] opacity-100 translate-y-0'
                  : 'max-h-0 opacity-0 -translate-y-1'
              }
            `}
          >
            <div className="bg-[#f6f1e7]/60 px-4 py-4 md:px-5 md:py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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

                <FilterSelect
                  name="categoria"
                  label="Categoría"
                  options={categoriaOptions}
                  defaultValue={categoria || 'todos'}
                />

                <SearchInput
                  name="talle"
                  label="Talle"
                  placeholder="Ej: M, 10, XL"
                  defaultValue={talle}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <Link
                  href="/productos"
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
