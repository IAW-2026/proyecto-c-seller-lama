import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Producto, Orden, Vendedor } from '@/types';
import { StatCard } from '@/components/ui/StatCard';
import { VendedoresTable } from '@/components/admin/VendedoresTable';
import { ProductosTable } from '@/components/admin/ProductosTable';
import { OrdenesTable } from '@/components/admin/OrdenesTable';
import { PageContainer } from '@/components/ui/PageContainer';

// TODO: Proteger esta ruta con middleware de Clerk (solo admin)
// Por ahora es accesible sin autenticación (solo para desarrollo)

const PRIMARY_COLOR = '#515922';
const DATE_LOCALE = 'es-AR';

export default async function AdminPage() {
  // 1. Traer todos los vendedores
  const { data: vendedores, error: errorVendedores } = await supabase
    .from('vendedor')
    .select('*');

  // 2. Traer todos los productos
  const { data: todosProductos, error: errorProductos } = await supabase
    .from('producto')
    .select('*');

  // 3. Traer todas las órdenes
  const { data: ordenes, error: errorOrdenes } = await supabase
    .from('orden')
    .select('*');

  // Calcular estadísticas
  const totalVendedores = vendedores?.length || 0;
  const totalProductos = todosProductos?.length || 0;
  const totalOrdenes = ordenes?.length || 0;
  const productosActivos = (todosProductos || []).filter(p => p.estado_publicacion === 'activa').length;
  const productosVendidos = (todosProductos || []).filter(p => p.estado_publicacion === 'vendida').length;

  if (errorVendedores || errorProductos || errorOrdenes) {
    return (
      <main className="min-h-screen bg-amber-50">
        <PageContainer>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mt-8">
            Error al cargar datos: {errorVendedores?.message || errorProductos?.message || errorOrdenes?.message}
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

            <Link 
              href="/" 
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
              Panel Administrativo
            </h2>
            <p className="text-slate-600">
              Visualiza estadísticas y gestiona el sistema
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <StatCard label="Total Vendedores" value={totalVendedores} primaryColor={PRIMARY_COLOR} />
            <StatCard label="Total Productos" value={totalProductos} primaryColor={PRIMARY_COLOR} />
            <StatCard label="Activos" value={productosActivos} primaryColor={PRIMARY_COLOR} />
            <StatCard label="Vendidos" value={productosVendidos} primaryColor={PRIMARY_COLOR} />
            <StatCard label="Órdenes" value={totalOrdenes} primaryColor={PRIMARY_COLOR} />
          </div>

          {/* Vendedores */}
          <VendedoresTable vendedores={vendedores} primaryColor={PRIMARY_COLOR} dateLocale={DATE_LOCALE} />

          {/* Productos */}
          <ProductosTable productos={todosProductos} primaryColor={PRIMARY_COLOR} dateLocale={DATE_LOCALE} />

          {/* Órdenes */}
          <OrdenesTable ordenes={ordenes} primaryColor={PRIMARY_COLOR} dateLocale={DATE_LOCALE} />
        </div>
      </PageContainer>
    </main>
  );
}
