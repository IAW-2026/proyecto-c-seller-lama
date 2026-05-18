'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/hooks/useNotification';
import { despacharOrden } from '@/lib/ordenes';
import { ESTADO_GENERAL, type OrdenConItems } from '@/types/orden';
import { AdminFilters } from '@/components/admin/AdminFilters';
import { VentasStats } from '@/components/ventas/VentasStats';
import { VentasTable } from '@/components/ventas/VentasTable';
import { EmptyVentas } from '@/components/ventas/EmptyVentas';

interface VentasClientProps {
  ordenes: OrdenConItems[];
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
  const router = useRouter();
  const notification = useNotification();
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [despachandoId, setDespachandoId] = useState<string | null>(null);

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
          orden.items.some((item) => matchesText(item.producto?.titulo, term));

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

  const filteredItems = filteredOrdenes.flatMap((orden) => orden.items);

  const totalVentas = filteredItems.length;
  const ventasCompletas = filteredOrdenes.reduce((count, orden) => {
    if (orden.estado_general !== ESTADO_GENERAL.COMPLETADA) return count;
    return count + orden.items.length;
  }, 0);
  const ventasCanceladas = filteredOrdenes.reduce((count, orden) => {
    if (orden.estado_general !== ESTADO_GENERAL.CANCELADA) return count;
    return count + orden.items.length;
  }, 0);
  const ventasPendientes = filteredOrdenes.reduce((count, orden) => {
    if (
      orden.estado_general === ESTADO_GENERAL.COMPLETADA ||
      orden.estado_general === ESTADO_GENERAL.CANCELADA
    ) {
      return count;
    }
    return count + orden.items.length;
  }, 0);
  const totalIngresos = filteredOrdenes.reduce((sum, orden) => {
    if (orden.estado_general !== ESTADO_GENERAL.COMPLETADA) return sum;
    const ordenTotal = orden.items.reduce(
      (ordenSum, item) => ordenSum + (item.precio_unitario || 0),
      0
    );
    return sum + ordenTotal;
  }, 0);

  const handleDespachar = async (orden: OrdenConItems) => {
    if (despachandoId) return;
    setDespachandoId(orden.orden_id);

    try {
      await despacharOrden(orden.orden_id);
      notification.showSuccess('Orden despachada exitosamente.', 3000);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo despachar la orden.';
      notification.showError(message);
    } finally {
      setDespachandoId(null);
    }
  };

  return (
    <>
      <VentasStats
        totalVentas={totalVentas}
        totalIngresos={totalIngresos}
        ventasPendientes={ventasPendientes}
        ventasCompletas={ventasCompletas}
        ventasCanceladas={ventasCanceladas}
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
        <VentasTable
          ordenes={filteredOrdenes}
          onDespachar={handleDespachar}
          despachandoId={despachandoId}
        />
      ) : (
        <EmptyVentas />
      )}
    </>
  );
}
