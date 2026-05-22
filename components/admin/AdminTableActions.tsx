'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { useNotification } from '@/hooks/useNotification';
import {
  activateVendedor,
  deleteOrden,
  deleteProducto,
  deleteVendedor,
} from '@/actions/adminActions';

type DeleteType = 'producto' | 'orden' | 'vendedor';

interface AdminTableActionsProps {
  editHref: string;
  deleteType: DeleteType;
  deleteId: string;
  vendedorActivo?: boolean;
}

export function AdminTableActions({
  editHref,
  deleteType,
  deleteId,
  vendedorActivo = true,
}: AdminTableActionsProps) {
  const [isPending, startTransition] = useTransition();
  const notification = useNotification();
  const isVendedor = deleteType === 'vendedor';
  const isActivateAction = isVendedor && !vendedorActivo;

  const getDeleteLabel = () => {
    if (deleteType === 'producto') return 'este producto';
    if (deleteType === 'orden') return 'esta orden';
    return 'este vendedor';
  };

  const getActionLabel = () => {
    if (deleteType === 'vendedor') {
      return vendedorActivo ? 'desactivar' : 'activar';
    }
    return 'eliminar';
  };

  const executeDelete = () => {
    startTransition(async () => {
      let result;

      if (deleteType === 'producto') {
        result = await deleteProducto(deleteId);
      }

      if (deleteType === 'orden') {
        result = await deleteOrden(deleteId);
      }

      if (deleteType === 'vendedor') {
        if (vendedorActivo) {
          result = await deleteVendedor(deleteId);
        } else {
          result = await activateVendedor(deleteId);
        }
      }

      if (!result) {
        notification.showError('No se pudo completar la acción.');
        return;
      }

      if (!result.success) {
        notification.showError(result.message);
        return;
      }

      notification.showSuccess(result.message, 3000);
    });
  };

  const handleDelete = () => {
    notification.showWithAction(
      `¿Estás seguro de que querés ${getActionLabel()} ${getDeleteLabel()}?`,
      'warning',
      {
        label: `Sí, ${getActionLabel()}`,
        onClick: executeDelete,
      },
      0
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={editHref}
        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#8fa18d]/15 text-[#37413d] hover:bg-[#8fa18d]/25 transition-colors"
      >
        Editar
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className={
          isActivateAction
            ? 'px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50'
            : 'px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50'
        }
      >
        {isPending ? 'Procesando...' : getActionLabel()}
      </button>
    </div>
  );
}