'use client';

import { useMemo, useState } from 'react';
import type { OrdenConProducto } from '@/types/orden';
import { AdminFilters } from '@/components/admin/AdminFilters';
import { VentasStats } from '@/components/ventas/VentasStats';
import { VentasTable } from '@/components/ventas/VentasTable';
import { EmptyVentas } from '@/components/ventas/EmptyVentas';

interface VentasClientProps {
  ordenes: OrdenConProducto[];
}

const normalizeText = (value: string) => value.trim().toLowerCase();

const matchesText = (value: string | null | undefined, term: string) => {
  if (!value) return false;
  return value.toLowerCase().includes(term);
};

const parseDateInput = (value: string) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const endOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

export function VentasClient({ ordenes }: VentasClientProps) {
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filteredOrdenes = useMemo(() => {
    const term = normalizeText(search);
    const fromDate = parseDateInput(from);
    const toDate = parseDateInput(to);
    const toEnd = toDate ? endOfDay(toDate) : null;

    return ordenes.filter((orden) => {
      if (term) {
        const matchesOrden =
          matchesText(orden.nro_orden, term) ||
          matchesText(orden.estado_general, term) ||
          matchesText(orden.estado_pago, term) ||
          matchesText(orden.estado_envio, term) ||
          matchesText(orden.producto_titulo, term);

        if (!matchesOrden) return false;
      }

      if (fromDate || toEnd) {
        const createdAt = new Date(orden.fecha_creacion);
        if (Number.isNaN(createdAt.getTime())) return false;
        if (fromDate && createdAt < fromDate) return false;
        if (toEnd && createdAt > toEnd) return false;
      }

      return true;
    });
  }, [ordenes, search, from, to]);

  const totalVentas = filteredOrdenes.length;
  const ventasPendientes = filteredOrdenes.filter(
    (orden) => orden.estado_general === 'pendiente_pago'
  ).length;
  const ventasCompletas = filteredOrdenes.filter(
    (orden) => orden.estado_general === 'enviada'
  ).length;
  const totalIngresos = filteredOrdenes.reduce(
    (sum, orden) => sum + (orden.total || 0),
    0
  );

  return (
    <>
      <VentasStats
        totalVentas={totalVentas}
        totalIngresos={totalIngresos}
        ventasPendientes={ventasPendientes}
        ventasCompletas={ventasCompletas}
      />

      <AdminFilters
        value={search}
        onChange={setSearch}
        placeholder="Buscar venta por nro, estado o producto"
        showDateFilters
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
        onClear={() => {
          setSearch('');
          setFrom('');
          setTo('');
        }}
      />

      {filteredOrdenes.length > 0 ? (
        <VentasTable ordenes={filteredOrdenes} />
      ) : (
        <EmptyVentas />
      )}
    </>
  );
}
