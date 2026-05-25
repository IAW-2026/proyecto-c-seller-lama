import type { Orden } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AdminTableContainer } from './AdminTableContainer';
import { AdminTableActions } from './AdminTableActions';

interface OrdenesTableProps {
  ordenes: Orden[] | null;
  pagination?: React.ReactNode;
  filtersBar?: React.ReactNode;
}

export function OrdenesTable({ ordenes, pagination, filtersBar }: OrdenesTableProps) {
  return (
    <AdminTableContainer id="ordenes" footer={pagination}>
      {filtersBar}
      {ordenes && ordenes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#d8cfbd]/60 bg-[#ede6d8]/30">
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Nro Orden</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Total</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Estado General</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Estado Pago</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Estado Envío</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Fecha</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#d8cfbd]/30">
              {ordenes.map((orden) => (
                <tr
                  key={orden.orden_id}
                  className="group hover:bg-[#ede6d8]/20 transition-colors duration-200"
                >
                  <td className="px-6 py-4.5 text-sm font-bold text-[#37413d] group-hover:text-[#5a6d58] transition-colors duration-200">
                    #{orden.nro_orden}
                  </td>

                  <td className="px-6 py-4.5 text-sm font-bold text-[#37413d]">
                    ${orden.total.toLocaleString('es-AR')}
                  </td>

                  <td className="px-6 py-4.5 text-sm">
                    <StatusBadge status={orden.estado_general} />
                  </td>

                  <td className="px-6 py-4.5 text-sm">
                    <StatusBadge status={orden.estado_pago} />
                  </td>

                  <td className="px-6 py-4.5 text-sm">
                    <StatusBadge status={orden.estado_envio} />
                  </td>

                  <td className="px-6 py-4.5 text-sm text-[#6f7f6d]">
                    {new Date(orden.fecha_creacion).toLocaleDateString('es-AR')}
                  </td>

                  <td className="px-6 py-4.5 text-sm text-right">
                    <div className="inline-flex justify-end">
                      <AdminTableActions
                        editHref={`/admin/ordenes/${orden.orden_id}`}
                        deleteType="orden"
                        deleteId={orden.orden_id}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center">
          <div className="inline-flex w-12 h-12 rounded-xl bg-[#f6f1e7] items-center justify-center text-[#b4b0a6] mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#37413d]">No hay órdenes disponibles</p>
        </div>
      )}
    </AdminTableContainer>
  );
}