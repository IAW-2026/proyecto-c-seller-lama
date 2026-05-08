import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { PageContainer } from '@/components/ui/PageContainer';
import { StatCard } from '@/components/dashboard/StatCard';
import { PageHeader } from '@/components/ui/PageHeader';

const CURRENT_SELLER_ID = 'user_2x91ab';

export default async function DashboardPage() {
  // Protección: verificar que el usuario esté autenticado
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  // 1. Traer todos los productos del vendedor actual
  const { data: productosVendedor, error: errorProductos } = await supabase
    .from('producto')
    .select('*')
    .eq('clerk_user_id', CURRENT_SELLER_ID);

  // 2. Traer datos del vendedor
  const { data: vendedorData, error: errorVendedor } = await supabase
    .from('vendedor')
    .select('*')
    .eq('clerk_user_id', CURRENT_SELLER_ID);
  
  const vendedor = vendedorData && vendedorData.length > 0 ? vendedorData[0] : null;

  // 3. Traer órdenes de los productos del vendedor
  let ordenesVendedor = [];
  if (productosVendedor && productosVendedor.length > 0) {
    const productIds = productosVendedor.map(p => p.producto_id);
    const { data: ordenes } = await supabase
      .from('orden')
      .select('*')
      .in('producto_id', productIds);
    ordenesVendedor = ordenes || [];
  }

  // Calcular estadísticas
  const totalProductos = productosVendedor?.length || 0;
  const productosActivos = (productosVendedor || []).filter(p => p.estado_publicacion === 'activa').length;
  const productosVendidos = (productosVendedor || []).filter(p => p.estado_publicacion === 'vendida').length;
  const totalOrdenes = ordenesVendedor.length;

  if (errorProductos || errorVendedor) {
    return (
      <main className="flex-1">
        <PageContainer>
          <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
            Error al cargar datos: {errorProductos?.message || errorVendedor?.message}
          </div>
        </PageContainer>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#f6f1e7]">
      <PageContainer>
        <div className="py-8 md:py-12">
          {/* Page Header */}
          <PageHeader 
            title="Dashboard"
            description="Aquí puedes gestionar tus productos, órdenes y ver tu actividad"
          />

          {/* Estadísticas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 border-l-4 border-[#8fa18d] shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-[#6f7f6d] mb-2">Total de Productos</p>
              <p className="text-3xl md:text-4xl font-bold text-[#37413d]">{totalProductos}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-[#4CAF50] shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-[#6f7f6d] mb-2">Productos Activos</p>
              <p className="text-3xl md:text-4xl font-bold text-[#4CAF50]">{productosActivos}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-[#2196F3] shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-[#6f7f6d] mb-2">Productos Vendidos</p>
              <p className="text-3xl md:text-4xl font-bold text-[#2196F3]">{productosVendidos}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-[#FF9800] shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-[#6f7f6d] mb-2">Total de Órdenes</p>
              <p className="text-3xl md:text-4xl font-bold text-[#FF9800]">{totalOrdenes}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 mb-12">
            <h2 className="text-lg font-semibold text-[#37413d]">Acceso rápido</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link 
                href="/productos"
                className="group block p-6 md:p-8 rounded-xl bg-gradient-to-br from-white to-[#f9f8f6] border border-[#8fa18d]/20 hover:border-[#8fa18d]/60 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#8fa18d]/15 mb-4">
                      <svg className="w-6 h-6 text-[#8fa18d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4m0 0L4 7m16 0v10l-8 4m0-4L4 7" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-[#37413d] mb-1 group-hover:text-[#8fa18d] transition-colors">
                      Mis Productos
                    </h3>
                    <p className="text-[#6f7f6d] text-sm">
                      Ver, editar o crear nuevos productos
                    </p>
                  </div>
                </div>
              </Link>

              <Link 
                href="/ventas"
                className="group block p-6 md:p-8 rounded-xl bg-gradient-to-br from-white to-[#f9f8f6] border border-[#2196F3]/20 hover:border-[#2196F3]/60 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#2196F3]/15 mb-4">
                      <svg className="w-6 h-6 text-[#2196F3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-[#37413d] mb-1 group-hover:text-[#2196F3] transition-colors">
                      Mis Ventas
                    </h3>
                    <p className="text-[#6f7f6d] text-sm">
                      Visualiza tus órdenes y historial de ventas
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
