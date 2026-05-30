'use client';

import { useMemo } from 'react';
import type { EnvioDetalle } from '@/types/envio';

interface EnvioModalProps {
  isOpen: boolean;
  onClose: () => void;
  envio: EnvioDetalle | null;
  loading: boolean;
  error?: string | null;
  nroOrden?: string | null;
}

type HistorialItem = NonNullable<EnvioDetalle['historial']>[number];

const formatHistorialItem = (item: HistorialItem) => {
  if (typeof item === 'string') return item;

  const base = item.estado;
  if (!item.fecha) return base;

  const date = new Date(item.fecha);
  if (Number.isNaN(date.getTime())) return base;

  return `${base} · ${date.toLocaleDateString('es-AR')}`;
};

export function EnvioModal({
  isOpen,
  onClose,
  envio,
  loading,
  error,
  nroOrden,
}: EnvioModalProps) {
  const historial = useMemo(() => {
    if (!envio?.historial || envio.historial.length === 0) return [];
    return envio.historial.map(formatHistorialItem);
  }, [envio?.historial]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl border border-[#d8cfbd] bg-[#f6f1e7] p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#37413d]">
              Informacion del envio
            </h2>
            {nroOrden ? (
              <p className="text-xs text-[#6f7f6d] mt-1">
                Orden #{nroOrden}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6f7f6d] text-lg font-bold hover:text-[#37413d]"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        <div className="mt-5">
          {loading ? (
            <div className="flex flex-col gap-3 text-sm text-[#6f7f6d] animate-pulse">
              <div className="h-4 w-1/3 rounded-full bg-[#e6ddcc]" />
              <div className="h-4 w-2/3 rounded-full bg-[#e6ddcc]" />
              <div className="h-4 w-1/2 rounded-full bg-[#e6ddcc]" />
              <div className="h-20 w-full rounded-xl bg-[#e6ddcc]" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-[#d17d6f] bg-white px-4 py-3 text-sm text-[#7d3c36]">
              {error}
            </div>
          ) : envio ? (
            <div className="space-y-4">
              <div className="grid gap-3 text-sm text-[#37413d]">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8fa18d]">
                    Codigo de seguimiento
                  </p>
                  <p className="mt-1 font-semibold">
                    {envio.codigo_seguimiento || 'Sin asignar'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8fa18d]">
                    Empresa
                  </p>
                  <p className="mt-1 font-semibold">
                    {envio.empresa_logistica || 'Sin definir'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8fa18d]">
                    Estado
                  </p>
                  <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#e6ddcc] px-3 py-1 text-xs font-semibold text-[#37413d]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8fa18d]" />
                    {envio.estado || 'Sin definir'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#8fa18d] mb-2">
                  Historial
                </p>
                {historial.length > 0 ? (
                  <ul className="space-y-2 text-sm text-[#37413d]">
                    {historial.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex items-center gap-2"
                      >
                        <span className="h-2 w-2 rounded-full bg-[#8fa18d]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#6f7f6d]">
                    Sin historial disponible.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#6f7f6d]">
              No hay informacion para mostrar.
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm font-semibold text-[#37413d] transition hover:bg-[#ede6d8]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
