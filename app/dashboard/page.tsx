import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { PageContainer } from '@/components/ui/PageContainer';
import { StatCard } from '@/components/ui/StatCard';

// TODO: Reemplazar por Clerk useAuth() cuando esté configurado
const PRIMARY_COLOR = '#515922';
const DATE_LOCALE = 'es-AR';
const CURRENT_SELLER_ID = 'user_2x91ab';

export default async function DashboardPage() {
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
      <main className="min-h-screen bg-white">
        <PageContainer>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mt-8">
            Error al cargar datos: {errorProductos?.message || errorVendedor?.message}
          </div>
        </PageContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-amber-50 border-b border-slate-200">
        <PageContainer>
          <div className="flex items-center justify-between py-6">
            <h1 className="text-2xl font-bold" style={{ color: PRIMARY_COLOR }}>
              LAMA seller app
            </h1>

            <Link href="/" className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-slate-100 border-2"
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
          {/* Bienvenida */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>
              Dashboard
            </h2>
            <p className="text-slate-600">
              Aquí puedes gestionar tus productos, órdenes y ver tu actividad
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard label="Total de Productos" value={totalProductos} primaryColor={PRIMARY_COLOR} />
            <StatCard label="Productos Activos" value={productosActivos} primaryColor={PRIMARY_COLOR} />
            <StatCard label="Productos Vendidos" value={productosVendidos} primaryColor={PRIMARY_COLOR} />
            <StatCard label="Total de Órdenes" value={totalOrdenes} primaryColor={PRIMARY_COLOR} />
          </div>

          {/* Acceso rápido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Link 
              href="/productos"
              className="group block p-6 rounded-2xl transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: '#d4e8d4' }}
            >
              <h3 className="font-semibold text-lg mb-1 text-slate-700">
                Mis Productos
              </h3>
              <p className="text-slate-500">Ver, editar o crear nuevos</p>
            </Link>
            <Link 
              href="/ventas"
              className="group block p-6 rounded-2xl transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: '#d4e8d4' }}
            >
              <h3 className="font-semibold text-lg mb-1 text-slate-700">
                Mis Ventas
              </h3>
              <p className="text-slate-500">Visualiza tus órdenes</p>
            </Link>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
