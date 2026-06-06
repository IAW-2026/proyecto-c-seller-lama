'use client';

import Link from 'next/link';

interface FormActionsProps {
  isSaving: boolean;
  onSubmit: () => void;
  submitLabel?: string;
  cancelHref?: string;
  onDelete?: () => void;
  showDelete?: boolean;
  deleteDisabled?: boolean;
  deleteDisabledMessage?: string;
  isBlocked?: boolean;
}

export function FormActions({
  isSaving,
  onSubmit,
  submitLabel = 'Crear producto',
  cancelHref = '/productos',
  onDelete,
  showDelete = false,
  deleteDisabled = false,
  deleteDisabledMessage,
  isBlocked = false,
}: FormActionsProps) {
  const isDisabled = isSaving || isBlocked;
  const isDeleteDisabled = isDisabled || deleteDisabled;

  return (
    <div className="space-y-3 pt-4">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isDisabled}
          className="flex-1 bg-[#8fa18d] hover:bg-[#7a8c78] disabled:bg-[#8fa18d] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-sm"
        >
          {isSaving ? 'Guardando...' : submitLabel}
        </button>

        <Link
          href={cancelHref}
          className="flex-1 bg-[#f6f1e7] hover:bg-[#e8dfcf] text-[#37413d] font-semibold py-3 px-4 rounded-lg border border-[#d8cfbd] transition duration-200 text-center"
        >
          Cancelar
        </Link>
      </div>

      {showDelete && onDelete && (
        <div>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleteDisabled}
            className="w-full bg-red-50 hover:bg-red-100 disabled:opacity-60 disabled:cursor-not-allowed text-red-700 font-semibold py-3 px-4 rounded-lg border border-red-300 transition duration-200"
          >
            Eliminar producto
          </button>
          {deleteDisabled && deleteDisabledMessage && (
            <p className="mt-2 text-xs font-medium text-[#7d3c36]">
              {deleteDisabledMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
