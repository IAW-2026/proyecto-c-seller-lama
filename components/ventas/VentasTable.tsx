import { StatusBadge } from '@/components/ui/StatusBadge';
import type { OrdenConItems } from '@/types/orden';

interface VentasTableProps {
  ordenes: OrdenConItems[];
}

const formatProductos = (items: OrdenConItems['items']) => {
  if (items.length === 0) return 'Sin productos';

  const titles = items.map(
    (item) => item.producto?.titulo || 'Producto sin titulo'
  );

  if (titles.length === 1) return titles[0];

  return `${titles[0]} +${titles.length - 1}`;
};

export function VentasTable({ ordenes }: VentasTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-stone-100 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Nro. Orden
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Producto
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Total
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Estado General
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Estado Pago
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Estado Envío
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Fecha
              </th>
            </tr>
          </thead>

          <tbody>
            {ordenes.map((orden) => (
              <tr
                key={orden.orden_id}
                className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                  #{orden.nro_orden}
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {formatProductos(orden.items)}
                </td>

                <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                  ${orden.total?.toLocaleString('es-AR') || '0'}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}