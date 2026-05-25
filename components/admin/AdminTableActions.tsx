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
      return vendedorActivo ? 'Desactivar' : 'Activar';
    }
    return 'Eliminar';
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
      `¿Estás seguro de que querés ${getActionLabel().toLowerCase()} ${getDeleteLabel()}?`,
      'warning',
      {
        label: `Sí, ${getActionLabel()}`,
        onClick: executeDelete,
      },
      0
    );
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={editHref}
        className="
          inline-flex items-center gap-1.5
          px-3 py-1.5 rounded-lg text-xs font-semibold
          bg-white border border-[#d8cfbd] text-[#37413d]
          transition-all duration-300
          hover:bg-[#f6f1e7] hover:border-[#8fa18d]/40 hover:text-[#5a6d58]
        "
      >
        <svg className="w-3.5 h-3.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Editar
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className={`
          inline-flex items-center gap-1.5
          px-3 py-1.5 rounded-lg text-xs font-semibold
          transition-all duration-300 disabled:opacity-50 cursor-pointer
          ${
            isActivateAction
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100/70 hover:border-emerald-300'
              : 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100/70 hover:border-red-300'
          }
        `}
      >
        {isActivateAction ? (
          <svg className="w-3.5 h-3.5 opacity-85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 opacity-85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        )}
        {isPending ? 'Procesando...' : getActionLabel()}
      </button>
    </div>
  );
}