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
    <AdminTableContainer id="ordenes" title="Órdenes" footer={pagination}>
      {filtersBar}
      {ordenes && ordenes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8f6f1] border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Nro Orden</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Total</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Estado General</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Estado Pago</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Estado Envío</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {ordenes.map((orden) => (
                <tr
                  key={orden.orden_id}
                  className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-[#37413d]">
                    #{orden.nro_orden}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-[#37413d]">
                    ${orden.total.toLocaleString('es-AR')}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={orden.estado_general} />
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={orden.estado_pago} />
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={orden.estado_envio} />
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(orden.fecha_creacion).toLocaleDateString('es-AR')}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <AdminTableActions
                      editHref={`/admin/ordenes/${orden.orden_id}`}
                      deleteType="orden"
                      deleteId={orden.orden_id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6">
          <p className="text-slate-500">No hay órdenes</p>
        </div>
      )}
    </AdminTableContainer>
  );
}