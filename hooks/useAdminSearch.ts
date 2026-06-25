'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminDashboardFilters } from '@/types/admin-filters';
import { buildAdminQueryString } from '@/lib/admin/admin-query';

type SectionKey = 'productos' | 'vendedores' | 'ordenes';

const DEBOUNCE_MS = 400;

/**
 Hook reutilizable que implementa búsqueda automática con debounce de 400ms.
 */
export function useAdminSearch(
  section: SectionKey,
  filters: AdminDashboardFilters
) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(
    filters[section].search ?? ''
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMount = useRef(true);

  // Sync local state when URL-driven filters change (e.g. "Limpiar" resets)
  useEffect(() => {
    setSearchValue(filters[section].search ?? '');
  }, [filters, section]);

  const navigate = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      const href =
        buildAdminQueryString(filters, {
          [section]: {
            search: trimmed || undefined,
            page: 1,
          },
        }) + `#${section}`;

      router.push(href);
    },
    [filters, section, router]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchValue(newValue);

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        navigate(newValue);
      }, DEBOUNCE_MS);
    },
    [navigate]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { searchValue, handleChange };
}
