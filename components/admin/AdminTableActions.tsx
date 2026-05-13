'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { useNotification } from '@/hooks/useNotification';
import {
  deleteOrden,
  deleteProducto,
  deleteVendedor,
} from '@/actions/adminActions';

type DeleteType = 'producto' | 'orden' | 'vendedor';

interface AdminTableActionsProps {
  editHref: string;
  deleteType: DeleteType;
  deleteId: string;
}

export function AdminTableActions({
  editHref,
  deleteType,
  deleteId,
}: AdminTableActionsProps) {
  const [isPending, startTransition] = useTransition();
  const notification = useNotification();

  const handleDelete = () => {
    startTransition(async () => {
      let result;

      if (deleteType === 'producto') {
        result = await deleteProducto(deleteId);
      }

      if (deleteType === 'orden') {
        result = await deleteOrden(deleteId);
      }

      if (deleteType === 'vendedor') {
        result = await deleteVendedor(deleteId);
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
        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        {isPending ? 'Eliminando...' : 'Eliminar'}
      </button>
    </div>
  );
}