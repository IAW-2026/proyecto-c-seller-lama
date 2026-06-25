import type { Vendedor } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AdminTableContainer } from './AdminTableContainer';
import { AdminTableActions } from './AdminTableActions';

interface VendedoresTableProps {
  vendedores: Vendedor[] | null;
  pagination?: React.ReactNode;
  filtersBar?: React.ReactNode;
}

export function VendedoresTable({ vendedores, pagination, filtersBar }: VendedoresTableProps) {
  const getInitials = (name: string) => {
    if (!name) return 'V';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <AdminTableContainer id="vendedores" footer={pagination}>
      {filtersBar}
      {vendedores && vendedores.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#d8cfbd]/60 bg-[#ede6d8]/30">
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Vendedor</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Email</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Teléfono</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Fecha Creación</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Estado</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#d8cfbd]/30">
              {vendedores.map((vendedor) => {
                const initials = getInitials(vendedor.nombre_vendedor);
                return (
                  <tr
                    key={vendedor.clerk_user_id}
                    className="group hover:bg-[#ede6d8]/20 transition-colors duration-200"
                  >
                    <td className="px-6 py-4.5 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8fa18d]/30 to-[#6f7f6d]/10 text-[#37413d] flex items-center justify-center font-bold text-xs shadow-sm border border-[#8fa18d]/20 transition-transform duration-300 group-hover:scale-105">
                          {initials}
                        </div>
                        <span className="font-bold text-[#37413d] group-hover:text-[#5a6d58] transition-colors duration-200">
                          {vendedor.nombre_vendedor}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4.5 text-sm text-[#6f7f6d]">
                      {vendedor.email}
                    </td>

                    <td className="px-6 py-4.5 text-sm text-[#6f7f6d]">
                      {vendedor.telefono || '-'}
                    </td>

                    <td className="px-6 py-4.5 text-sm text-[#6f7f6d]">
                      {new Date(vendedor.fecha_creacion).toLocaleDateString('es-AR')}
                    </td>

                    <td className="px-6 py-4.5 text-sm">
                      <StatusBadge status={vendedor.activo ? 'activa' : 'inactiva'} />
                    </td>

                    <td className="px-6 py-4.5 text-sm text-right">
                      <div className="inline-flex justify-end">
                        <AdminTableActions
                          editHref={`/admin/vendedores/${vendedor.clerk_user_id}`}
                          deleteType="vendedor"
                          deleteId={vendedor.clerk_user_id}
                          vendedorActivo={vendedor.activo}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center">
          <div className="inline-flex w-12 h-12 rounded-xl bg-[#f6f1e7] items-center justify-center text-[#b4b0a6] mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#37413d]">No hay vendedores disponibles</p>
        </div>
      )}
    </AdminTableContainer>
  );
}