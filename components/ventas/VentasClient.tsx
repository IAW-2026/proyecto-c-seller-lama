'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/hooks/useNotification';
import { despacharOrden, obtenerEnvioOrden } from '@/lib/ordenes';
import type { EnvioDetalle } from '@/types/envio';
import type { OrdenConItems } from '@/types/orden';
import { VentasTable } from '@/components/ventas/VentasTable';
import { EmptyVentas } from '@/components/ventas/EmptyVentas';
import { EnvioModal } from '@/components/ventas/EnvioModal';

interface VentasClientProps {
  ordenes: OrdenConItems[];
  vendedorActivo: boolean;
}

export function VentasClient({ ordenes, vendedorActivo }: VentasClientProps) {
  const router = useRouter();
  const notification = useNotification();
  const [despachandoId, setDespachandoId] = useState<string | null>(null);
  const [viendoEnvioId, setViendoEnvioId] = useState<string | null>(null);
  const [envioModalOpen, setEnvioModalOpen] = useState(false);
  const [envioOrden, setEnvioOrden] = useState<OrdenConItems | null>(null);
  const [envioData, setEnvioData] = useState<EnvioDetalle | null>(null);
  const [envioError, setEnvioError] = useState<string | null>(null);

  const handleDespachar = async (orden: OrdenConItems) => {
    if (!vendedorActivo) {
      notification.showWarning('Tu cuenta de vendedor se encuentra inactiva.');
      return;
    }
    if (despachandoId) return;
    setDespachandoId(orden.orden_id);

    try {
      await despacharOrden(orden.nro_orden);
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

  const handleVerEnvio = async (orden: OrdenConItems) => {
    if (!vendedorActivo) {
      notification.showWarning('Tu cuenta de vendedor se encuentra inactiva.');
      return;
    }

    if (viendoEnvioId) return;

    setEnvioOrden(orden);
    setEnvioModalOpen(true);
    setEnvioData(null);
    setEnvioError(null);
    setViendoEnvioId(orden.orden_id);

    try {
      const data = await obtenerEnvioOrden(orden.nro_orden);
      setEnvioData(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo obtener la informacion del envio.';
      setEnvioError(message);
    } finally {
      setViendoEnvioId(null);
    }
  };

  const closeEnvioModal = () => {
    setEnvioModalOpen(false);
    setEnvioOrden(null);
    setEnvioData(null);
    setEnvioError(null);
  };

  return (
    <>
      {ordenes.length > 0 ? (
        <VentasTable
          ordenes={ordenes}
          onDespachar={handleDespachar}
          onVerEnvio={handleVerEnvio}
          despachandoId={despachandoId}
          viendoEnvioId={viendoEnvioId}
          vendedorActivo={vendedorActivo}
        />
      ) : (
        <EmptyVentas />
      )}
      <EnvioModal
        isOpen={envioModalOpen}
        onClose={closeEnvioModal}
        envio={envioData}
        loading={Boolean(viendoEnvioId)}
        error={envioError}
        nroOrden={envioOrden?.nro_orden}
      />
    </>
  );
}
