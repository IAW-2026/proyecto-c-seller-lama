import type { Producto } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AdminTableContainer } from './AdminTableContainer';
import { AdminTableActions } from './AdminTableActions';

type ProductoConVendedor = Producto & {
  vendedor?: {
    nombre_vendedor: string;
  } | null;
};

interface ProductosTableProps {
  productos: ProductoConVendedor[] | null;
  pagination?: React.ReactNode;
  filtersBar?: React.ReactNode;
}

export function ProductosTable({ productos, pagination, filtersBar }: ProductosTableProps) {
  return (
    <AdminTableContainer id="productos" footer={pagination}>
      {filtersBar}
      {productos && productos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#d8cfbd]/60 bg-[#ede6d8]/30">
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Producto</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Vendedor</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Precio</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Prenda</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Publicación</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Talle</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Género</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Creación</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-[#6f7f6d]">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#d8cfbd]/30">
              {productos.map((producto) => (
                <tr
                  key={producto.producto_id}
                  className="group hover:bg-[#ede6d8]/20 transition-colors duration-200"
                >
                  <td className="px-6 py-4.5 text-sm font-bold text-[#37413d] max-w-xs truncate group-hover:text-[#5a6d58] transition-colors duration-200">
                    {producto.titulo}
                  </td>

                  <td className="px-6 py-4.5 text-sm text-[#6f7f6d]">
                    {producto.vendedor?.nombre_vendedor || 'Sin vendedor'}
                  </td>

                  <td className="px-6 py-4.5 text-sm font-bold text-[#37413d]">
                    ${producto.precio.toLocaleString('es-AR')}
                  </td>

                  <td className="px-6 py-4.5 text-sm text-[#6f7f6d] capitalize">
                    {producto.estado_prenda}
                  </td>

                  <td className="px-6 py-4.5 text-sm">
                    <StatusBadge status={producto.estado_publicacion} />
                  </td>

                  <td className="px-6 py-4.5 text-sm text-[#6f7f6d]">
                    {producto.talle || '-'}
                  </td>

                  <td className="px-6 py-4.5 text-sm text-[#6f7f6d] capitalize">
                    {producto.genero}
                  </td>

                  <td className="px-6 py-4.5 text-sm text-[#6f7f6d]">
                    {new Date(producto.fecha_creacion).toLocaleDateString('es-AR')}
                  </td>

                  <td className="px-6 py-4.5 text-sm text-right">
                    <div className="inline-flex justify-end">
                      <AdminTableActions
                        editHref={`/productos/${producto.producto_id}?from=admin`}
                        deleteType="producto"
                        deleteId={producto.producto_id}
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
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#37413d]">No hay productos disponibles</p>
        </div>
      )}
    </AdminTableContainer>
  );
}