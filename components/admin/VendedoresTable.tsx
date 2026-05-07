import type { Vendedor } from '@/types';

interface VendedoresTableProps {
  vendedores: Vendedor[] | null;
  primaryColor: string;
  dateLocale: string;
}

export function VendedoresTable({ vendedores, primaryColor, dateLocale }: VendedoresTableProps) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg p-8 mb-12">
      <h3 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
        Vendedores
      </h3>

      {vendedores && vendedores.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderColor: primaryColor }}>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Nombre</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Email</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>DNI</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Teléfono</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Fecha Creación</th>
              </tr>
            </thead>
            <tbody>
              {vendedores.map((vendedor: Vendedor) => (
                <tr key={vendedor.clerk_user_id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-900">{vendedor.nombre_vendedor}</td>
                  <td className="py-3 px-4 text-slate-600">{vendedor.email}</td>
                  <td className="py-3 px-4 text-slate-600">{vendedor.dni}</td>
                  <td className="py-3 px-4 text-slate-600">{vendedor.telefono || '-'}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {new Date(vendedor.fecha_creacion).toLocaleDateString(dateLocale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-500">No hay vendedores</p>
      )}
    </div>
  );
}
