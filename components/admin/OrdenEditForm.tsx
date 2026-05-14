'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Orden } from '@/types';
import { useNotification } from '@/hooks/useNotification';
import { updateOrden } from '@/actions/adminActions';

const ESTADOS_GENERALES: Orden['estado_general'][] = [
  'pendiente_pago',
  'pagada',
  'en_preparacion',
  'enviada',
  'cancelada',
];

const ESTADOS_PAGO: Orden['estado_pago'][] = [
  'pendiente',
  'aprobado',
  'rechazado',
];

const ESTADOS_ENVIO: Orden['estado_envio'][] = [
  'pendiente',
  'en_preparacion',
  'despachado',
  'entregado',
  'cancelado',
];

interface OrdenEditFormProps {
  orden: Orden;
}

export function OrdenEditForm({ orden }: OrdenEditFormProps) {
  const router = useRouter();
  const notification = useNotification();
  const [isSaving, setIsSaving] = useState(false);

  const [nroOrden, setNroOrden] = useState(orden.nro_orden);
  const [total, setTotal] = useState(orden.total.toString());
  const [estadoGeneral, setEstadoGeneral] = useState(orden.estado_general);
  const [estadoPago, setEstadoPago] = useState(orden.estado_pago);
  const [estadoEnvio, setEstadoEnvio] = useState(orden.estado_envio);
  const [direccionEnvio, setDireccionEnvio] = useState(orden.direccion_envio);

  const handleSave = async () => {
    const nroOrdenValue = nroOrden.trim();
    const direccionValue = direccionEnvio.trim();
    const parsedTotal = Number(total);

    if (!nroOrdenValue || Number.isNaN(parsedTotal)) {
      notification.showError(
        'Nro de orden y total son obligatorios.'
      );
      return;
    }

    if (parsedTotal < 0) {
      notification.showError('El total no puede ser negativo.');
      return;
    }

    if (!direccionValue) {
      notification.showError('La dirección de envío es obligatoria.');
      return;
    }

    setIsSaving(true);

    const result = await updateOrden({
      orden_id: orden.orden_id,
      nro_orden: nroOrdenValue,
      total: parsedTotal,
      estado_general: estadoGeneral,
      estado_pago: estadoPago,
      estado_envio: estadoEnvio,
      direccion_envio: direccionValue,
    });

    if (!result.success) {
      notification.showError(result.message);
      setIsSaving(false);
      return;
    }

    notification.showSuccess(result.message, 3000);
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-[#37413d] mb-6">
        Editar orden
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#37413d] mb-2">
            Nro de orden
          </label>
          <input
            type="text"
            value={nroOrden}
            onChange={(event) => setNroOrden(event.target.value)}
            className="w-full rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm text-[#37413d] outline-none focus:border-[#8fa18d]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#37413d] mb-2">
            Total
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={total}
            onChange={(event) => setTotal(event.target.value)}
            className="w-full rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm text-[#37413d] outline-none focus:border-[#8fa18d]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#37413d] mb-2">
            Estado general
          </label>
          <select
            value={estadoGeneral}
            onChange={(event) => setEstadoGeneral(event.target.value as Orden['estado_general'])}
            className="w-full rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm text-[#37413d] outline-none focus:border-[#8fa18d]"
          >
            {ESTADOS_GENERALES.map((estado) => (
              <option key={estado} value={estado}>
                {estado.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#37413d] mb-2">
            Estado pago
          </label>
          <select
            value={estadoPago}
            onChange={(event) => setEstadoPago(event.target.value as Orden['estado_pago'])}
            className="w-full rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm text-[#37413d] outline-none focus:border-[#8fa18d]"
          >
            {ESTADOS_PAGO.map((estado) => (
              <option key={estado} value={estado}>
                {estado.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#37413d] mb-2">
            Estado envío
          </label>
          <select
            value={estadoEnvio}
            onChange={(event) => setEstadoEnvio(event.target.value as Orden['estado_envio'])}
            className="w-full rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm text-[#37413d] outline-none focus:border-[#8fa18d]"
          >
            {ESTADOS_ENVIO.map((estado) => (
              <option key={estado} value={estado}>
                {estado.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#37413d] mb-2">
            Dirección de envío
          </label>
          <input
            type="text"
            value={direccionEnvio}
            onChange={(event) => setDireccionEnvio(event.target.value)}
            className="w-full rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm text-[#37413d] outline-none focus:border-[#8fa18d]"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg border border-[#8fa18d] bg-[#8fa18d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7e937c] disabled:opacity-60"
        >
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm font-semibold text-[#37413d] transition hover:bg-[#f6f1e7]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
