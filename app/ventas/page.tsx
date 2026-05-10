import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import type { Orden } from '@/types';
import { PageContainer } from '@/components/ui/PageContainer';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default async function VentasPage() {
  // Protección: verificar que el usuario esté autenticado
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Traer todos los productos del vendedor
  const { data: productosVendedor, error: errorProductos } = await supabase
    .from('producto')
    .select('producto_id')
    .eq('clerk_user_id', userId);

  // Traer órdenes de los productos del vendedor
  let ordenes: (Orden & { producto_titulo?: string })[] = [];
  let totalVentas = 0;
  let ventasPendientes = 0;
  let ventasCompletas = 0;

  if (productosVendedor && productosVendedor.length > 0) {
    const productIds = productosVendedor.map(p => p.producto_id);
    
    const { data: ordenesData, error: errorOrdenes } = await supabase
      .from('orden')
      .select(`
        *,
        producto (
          titulo
        )
      `)
      .in('producto_id', productIds);

    if (ordenesData) {
      ordenes = ordenesData.map((orden: any) => ({
        ...orden,
        producto_titulo: orden.producto?.titulo || 'Producto sin título',
      }));

      // Calcular estadísticas
      totalVentas = ordenes.length;
      ventasPendientes = ordenes.filter(o => o.estado_general === 'pendiente_pago').length;
      ventasCompletas = ordenes.filter(o => o.estado_general === 'enviada').length;
    }
  }

  const totalIngresos = ordenes.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <main className="flex-1 bg-[#f6f1e7]">
      {/* Contenido principal */}
      <PageContainer>
        <div className="py-8 md:py-12">
          {/* Título */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-2 text-[#37413d]">
              Mis Ventas
            </h2>

            <p className="text-slate-600">
              Gestiona tus órdenes, pagos y estado de envíos
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard 
              variant="dashboard"
              label="Total de Ventas" 
              value={totalVentas}
              borderColor="#8fa18d"
            />
            <StatCard 
              variant="dashboard"
              label="Ingresos" 
              value={Math.round(totalIngresos)}
              borderColor="#22c55e"
            />
            <StatCard 
              variant="dashboard"
              label="Pendientes" 
              value={ventasPendientes}
              borderColor="#2196f3"
            />
            <StatCard 
              variant="dashboard"
              label="Completadas" 
              value={ventasCompletas}
              borderColor="#fb8c00"
            />
          </div>

          {/* Tabla de órdenes */}
          {ordenes.length > 0 ? (
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
                          {orden.producto_titulo}
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          ${orden.total?.toLocaleString('es-AR') || '0'}
                        </td>

                        <td className="px-6 py-4 text-sm">
                          <StatusBadge status={orden.estado_general?.toLowerCase() as any} />
                        </td>

                        <td className="px-6 py-4 text-sm">
                          <StatusBadge status={orden.estado_pago?.toLowerCase() as any} />
                        </td>

                        <td className="px-6 py-4 text-sm">
                          <StatusBadge status={orden.estado_envio?.toLowerCase() as any} />
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
          ) : (
            <div className="bg-stone-100 rounded-xl p-8 text-center">
              <p className="text-slate-600 font-medium">
                No tienes ventas aún
              </p>

              <p className="text-slate-500 text-sm mt-1">
                Cuando vendas productos, aparecerán aquí
              </p>
            </div>
          )}
        </div>
      </PageContainer>
    </main>
  );
}