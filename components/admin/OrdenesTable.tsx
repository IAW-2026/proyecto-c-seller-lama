import type { Orden } from '@/types';

interface OrdenesTableProps {
  ordenes: Orden[] | null;
  primaryColor: string;
  dateLocale: string;
}

export function OrdenesTable({ ordenes, primaryColor, dateLocale }: OrdenesTableProps) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg p-8">
      <h3 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
        Órdenes
      </h3>

      {ordenes && ordenes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderColor: primaryColor }}>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Nro Orden</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Total</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Estado General</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Estado Pago</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Estado Envío</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden: Orden) => (
                <tr key={orden.orden_id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-900">{orden.nro_orden}</td>
                  <td className="py-3 px-4 text-slate-600">${orden.total.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span 
                      className="px-2 py-1 rounded text-xs font-bold"
                      style={{
                        backgroundColor: orden.estado_general === 'pagada' ? '#d4edda' : '#fff3cd',
                        color: orden.estado_general === 'pagada' ? '#155724' : '#856404'
                      }}
                    >
                      {orden.estado_general}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span 
                      className="px-2 py-1 rounded text-xs font-bold"
                      style={{
                        backgroundColor: orden.estado_pago === 'aprobado' ? '#d4edda' : '#f8d7da',
                        color: orden.estado_pago === 'aprobado' ? '#155724' : '#721c24'
                      }}
                    >
                      {orden.estado_pago}
                    </span>
                  </td>
                  <td className="py-3 px-4">{orden.estado_envio}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {new Date(orden.fecha_creacion).toLocaleDateString(dateLocale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-500">No hay órdenes</p>
      )}
    </div>
  );
}
