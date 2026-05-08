import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Orden } from '@/types';
import { PageContainer } from '@/components/ui/PageContainer';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

const PRIMARY_COLOR = '#515922';
const DATE_LOCALE = 'es-AR';
const CURRENT_SELLER_ID = 'user_2x91ab';

export default async function VentasPage() {
  // Traer todos los productos del vendedor
  const { data: productosVendedor, error: errorProductos } = await supabase
    .from('producto')
    .select('producto_id')
    .eq('clerk_user_id', CURRENT_SELLER_ID);

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
    <main className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-amber-50 border-b border-slate-200">
        <PageContainer>
          <div className="flex items-center justify-between py-6">
            <h1 className="text-2xl font-bold" style={{ color: PRIMARY_COLOR }}>
              LAMA seller app
            </h1>
            <Link 
              href="/dashboard" 
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-slate-100 border-2"
              style={{ 
                color: PRIMARY_COLOR,
                borderColor: PRIMARY_COLOR
              }}
            >
              Volver
            </Link>
          </div>
        </PageContainer>
      </header>

      {/* Contenido principal */}
      <PageContainer>
        <div className="py-12">
          {/* Título */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>
              Mis Ventas
            </h2>
            <p className="text-slate-600">
              Gestiona tus órdenes, pagos y estado de envíos
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard label="Total de Ventas" value={totalVentas} primaryColor={PRIMARY_COLOR} />
            <StatCard label="Ingresos" value={Math.round(totalIngresos)} primaryColor={PRIMARY_COLOR} />
            <StatCard label="Pendientes" value={ventasPendientes} primaryColor={PRIMARY_COLOR} />
            <StatCard label="Completadas" value={ventasCompletas} primaryColor={PRIMARY_COLOR} />
          </div>

          {/* Tabla de órdenes */}
          {ordenes.length > 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-100 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Nro. Orden</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Producto</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Estado General</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Estado Pago</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Estado Envío</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenes.map((orden) => (
                      <tr key={orden.orden_id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">#{orden.nro_orden}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{orden.producto_titulo}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          ${orden.total?.toLocaleString(DATE_LOCALE) || '0'}
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
                          {new Date(orden.fecha_creacion).toLocaleDateString(DATE_LOCALE)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-stone-100 rounded-xl p-8 text-center">
              <p className="text-slate-600 font-medium">No tienes ventas aún</p>
              <p className="text-slate-500 text-sm mt-1">Cuando vendas productos, aparecerán aquí</p>
            </div>
          )}
        </div>
      </PageContainer>
    </main>
  );
}
