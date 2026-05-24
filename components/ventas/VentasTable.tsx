import { StatusBadge } from '@/components/ui/StatusBadge';
import { ESTADO_ENVIO, ESTADO_PAGO, type OrdenConItems } from '@/types/orden';

interface VentasTableProps {
  ordenes: OrdenConItems[];
  onDespachar: (orden: OrdenConItems) => void;
  despachandoId?: string | null;
  vendedorActivo: boolean;
}

const formatProductos = (items: OrdenConItems['items']) => {
  if (items.length === 0) return 'Sin productos';

  const titles = items.map(
    (item) => item.producto?.titulo || 'Producto sin titulo'
  );

  if (titles.length === 1) return titles[0];

  return `${titles[0]} +${titles.length - 1}`;
};

const estadosNoDespachables: string[] = [
  ESTADO_ENVIO.DESPACHADO,
  ESTADO_ENVIO.ENTREGADO,
  ESTADO_ENVIO.CANCELADO,
];

const PuedeDespachar = (orden: OrdenConItems) => {
  if (orden.estado_pago !== ESTADO_PAGO.APROBADO) return false;

  return !estadosNoDespachables.includes(orden.estado_envio);
};

export function VentasTable({
  ordenes,
  onDespachar,
  despachandoId,
  vendedorActivo,
}: VentasTableProps) {
  return (
    <div className="rounded-2xl border border-[#d8cfbd]/70 bg-white/70 backdrop-blur-sm shadow-[0_2px_16px_rgba(55,65,61,0.06)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#37413d]">
              <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Nro. Orden
              </th>
              <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Producto
              </th>
              <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Total
              </th>
              <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                General
              </th>
              <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Pago
              </th>
              <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Envío
              </th>
              <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Fecha
              </th>
              <th className="px-6 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {ordenes.map((orden, i) => (
              <tr
                key={orden.orden_id}
                className={`
                  group transition-all duration-200
                  hover:bg-[#f6f1e7]/60
                  ${i < ordenes.length - 1 ? 'border-b border-[#d8cfbd]/25' : ''}
                `}
              >
                <td className="px-6 py-4 text-sm font-semibold text-[#37413d]">
                  <span className="text-[#8fa18d] font-mono text-xs">#</span>{orden.nro_orden}
                </td>

                <td className="px-6 py-4 text-sm text-[#6f7f6d] max-w-[200px]">
                  <span className="block truncate group-hover:text-[#37413d] transition-colors">
                    {formatProductos(orden.items)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-[#37413d]">
                    ${orden.total?.toLocaleString('es-AR') || '0'}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={orden.estado_general} />
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={orden.estado_pago} />
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={orden.estado_envio} />
                </td>

                <td className="px-6 py-4 text-sm text-[#6f7f6d] tabular-nums">
                  {new Date(orden.fecha_creacion).toLocaleDateString('es-AR')}
                </td>

                <td className="px-6 py-4">
                  {PuedeDespachar(orden) && vendedorActivo ? (
                    <button
                      type="button"
                      onClick={() => onDespachar(orden)}
                      disabled={despachandoId === orden.orden_id}
                      className="
                        rounded-lg bg-[#8fa18d] px-4 py-2
                        text-xs font-semibold text-white
                        transition-all duration-300
                        hover:bg-[#7a8c78] hover:shadow-md hover:shadow-[#8fa18d]/25
                        active:scale-[0.97]
                        disabled:opacity-50 disabled:cursor-not-allowed
                      "
                    >
                      {despachandoId === orden.orden_id
                        ? 'Despachando...'
                        : 'Despachar'}
                    </button>
                  ) : (
                    <span className="text-xs text-[#d8cfbd]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}