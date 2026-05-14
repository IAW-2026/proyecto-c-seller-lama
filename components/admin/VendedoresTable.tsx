import type { Vendedor } from '@/types';
import { AdminTableContainer } from './AdminTableContainer';
import { AdminTableActions } from './AdminTableActions';

interface VendedoresTableProps {
  vendedores: Vendedor[] | null;
  pagination?: React.ReactNode;
}

export function VendedoresTable({ vendedores, pagination }: VendedoresTableProps) {
  return (
    <AdminTableContainer title="Vendedores" footer={pagination}>
      {vendedores && vendedores.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8f6f1] border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">DNI</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Teléfono</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Fecha Creación</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {vendedores.map((vendedor) => (
                <tr
                  key={vendedor.clerk_user_id}
                  className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-[#37413d]">
                    {vendedor.nombre_vendedor}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {vendedor.email}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {vendedor.dni}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {vendedor.telefono || '-'}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(vendedor.fecha_creacion).toLocaleDateString('es-AR')}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <AdminTableActions
                      editHref={`/admin/vendedores/${vendedor.clerk_user_id}`}
                      deleteType="vendedor"
                      deleteId={vendedor.clerk_user_id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6">
          <p className="text-slate-500">No hay vendedores</p>
        </div>
      )}
    </AdminTableContainer>
  );
}