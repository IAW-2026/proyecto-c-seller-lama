'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/hooks/useNotification';
import { despacharOrden } from '@/lib/ordenes';
import type { OrdenConItems } from '@/types/orden';
import { VentasTable } from '@/components/ventas/VentasTable';
import { EmptyVentas } from '@/components/ventas/EmptyVentas';

interface VentasClientProps {
  ordenes: OrdenConItems[];
  vendedorActivo: boolean;
}

export function VentasClient({ ordenes, vendedorActivo }: VentasClientProps) {
  const router = useRouter();
  const notification = useNotification();
  const [despachandoId, setDespachandoId] = useState<string | null>(null);

  const handleDespachar = async (orden: OrdenConItems) => {
    if (!vendedorActivo) {
      notification.showWarning('Tu cuenta de vendedor se encuentra inactiva.');
      return;
    }
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
      {ordenes.length > 0 ? (
        <VentasTable
          ordenes={ordenes}
          onDespachar={handleDespachar}
          despachandoId={despachandoId}
          vendedorActivo={vendedorActivo}
        />
      ) : (
        <EmptyVentas />
      )}
    </>
  );
}
