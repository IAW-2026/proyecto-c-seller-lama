import Link from 'next/link';
import type { Producto } from '@/types';

interface ProductosTableProps {
  productos: Producto[] | null;
  primaryColor: string;
  dateLocale: string;
}

export function ProductosTable({ productos, primaryColor, dateLocale }: ProductosTableProps) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg p-8">
      <h3 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
        Mis Productos
      </h3>

      {productos && productos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderColor: primaryColor }}>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Título</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Precio</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Publicación</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Prenda</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Talle</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: primaryColor }}>Creación</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto: Producto) => (
                <tr key={producto.producto_id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-900">{producto.titulo}</td>
                  <td className="py-3 px-4 text-slate-600">${producto.precio.toLocaleString(dateLocale)}</td>
                  <td className="py-3 px-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: producto.estado_publicacion === 'activa' ? '#d4edda' : '#f8d7da',
                        color: producto.estado_publicacion === 'activa' ? '#155724' : '#721c24'
                      }}
                    >
                      {producto.estado_publicacion}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{producto.estado_prenda}</td>
                  <td className="py-3 px-4 text-slate-600">{producto.talle || '-'}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {new Date(producto.fecha_creacion).toLocaleDateString(dateLocale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">
          <p>No tienes productos aún. ¡Crea uno para comenzar!</p>
        </div>
      )}
    </div>
  );
}
