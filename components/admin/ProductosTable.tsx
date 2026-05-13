import type { Producto } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AdminTableContainer } from './AdminTableContainer';
import { AdminTableActions } from './AdminTableActions';
import { deleteProducto } from '@/actions/adminActions';

interface ProductosTableProps {
  productos: Producto[] | null;
}

export function ProductosTable({ productos }: ProductosTableProps) {
  return (
    <AdminTableContainer title="Productos">
      {productos && productos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8f6f1] border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Título</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Precio</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Estado Prenda</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Publicación</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Talle</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Creación</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((producto) => (
                <tr
                  key={producto.producto_id}
                  className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-[#37413d] max-w-xs truncate">
                    {producto.titulo}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-[#37413d]">
                    ${producto.precio.toLocaleString('es-AR')}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                    {producto.estado_prenda}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={producto.estado_publicacion} />
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {producto.talle || '-'}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(producto.fecha_creacion).toLocaleDateString('es-AR')}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <AdminTableActions
                      editHref={`/productos/${producto.producto_id}`}
                      deleteType="producto"
                      deleteId={producto.producto_id}                  
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6">
          <p className="text-slate-500">No hay productos</p>
        </div>
      )}
    </AdminTableContainer>
  );
}