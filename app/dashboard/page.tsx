import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Producto } from '@/types';

// TODO: Reemplazar este vendedor_id temporal con el usuario autenticado de Clerk
const CURRENT_SELLER_ID = 'user_2x91ab';

export default async function DashboardPage() {
  // 1. Traer todos los productos del vendedor actual
  const { data: productosVendedor, error: errorProductos } = await supabase
    .from('producto')
    .select('*')
    .eq('clerk_user_id', CURRENT_SELLER_ID);

  // 2. Traer datos del vendedor
  const { data: vendedor, error: errorVendedor } = await supabase
    .from('vendedor')
    .select('*')
    .eq('clerk_user_id', CURRENT_SELLER_ID)
    .single();

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
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Error al cargar datos: {errorProductos?.message || errorVendedor?.message}
          </div>
        </div>
      </main>
    );
  }

  const nombreVendedor = vendedor?.nombre_vendedor || 'Vendedor';

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: '#515922' }}
              >
                L
              </div>
              <h1 className="text-2xl font-bold" style={{ color: '#515922' }}>
                LAMA seller app
              </h1>
            </div>

            <Link 
              href="/" 
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
              style={{ 
                color: '#515922',
                border: '1px solid #515922'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#515922';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#515922';
              }}
            >
              Salir
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Bienvenida */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2" style={{ color: '#515922' }}>
            ¡Hola, {nombreVendedor}! 👋
          </h2>
          <p className="text-slate-600">
            Aquí puedes gestionar tus productos, órdenes y ver tu actividad
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Productos */}
          <div className="bg-white border-2 border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total de Productos</p>
                <p className="text-4xl font-bold text-slate-900">{totalProductos}</p>
              </div>
              <div 
                className="w-14 h-14 rounded-lg flex items-center justify-center text-white text-2xl"
                style={{ backgroundColor: '#515922' }}
              >
                📦
              </div>
            </div>
          </div>

          {/* Productos Activos */}
          <div className="bg-white border-2 border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Productos Activos</p>
                <p className="text-4xl font-bold text-slate-900">{productosActivos}</p>
              </div>
              <div 
                className="w-14 h-14 rounded-lg flex items-center justify-center text-white text-2xl"
                style={{ backgroundColor: '#515922' }}
              >
                ✅
              </div>
            </div>
          </div>

          {/* Productos Vendidos */}
          <div className="bg-white border-2 border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Productos Vendidos</p>
                <p className="text-4xl font-bold text-slate-900">{productosVendidos}</p>
              </div>
              <div 
                className="w-14 h-14 rounded-lg flex items-center justify-center text-white text-2xl"
                style={{ backgroundColor: '#515922' }}
              >
                🎉
              </div>
            </div>
          </div>

          {/* Total Órdenes */}
          <div className="bg-white border-2 border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total de Órdenes</p>
                <p className="text-4xl font-bold text-slate-900">{totalOrdenes}</p>
              </div>
              <div 
                className="w-14 h-14 rounded-lg flex items-center justify-center text-white text-2xl"
                style={{ backgroundColor: '#515922' }}
              >
                📋
              </div>
            </div>
          </div>
        </div>

        {/* Acceso rápido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/productos">
            <div 
              className="bg-white border-2 border-slate-200 rounded-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-lg"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#515922';
                e.currentTarget.style.backgroundColor = '#f5f5f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mb-4"
                style={{ backgroundColor: '#515922' }}
              >
                📦
              </div>
              <h3 className="text-xl font-bold text-slate-900">Mis Productos</h3>
              <p className="text-sm text-slate-600 mt-2">
                Ver, editar o crear nuevos productos
              </p>
            </div>
          </Link>

          <Link href="/ventas">
            <div 
              className="bg-white border-2 border-slate-200 rounded-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-lg"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#515922';
                e.currentTarget.style.backgroundColor = '#f5f5f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mb-4"
                style={{ backgroundColor: '#515922' }}
              >
                💰
              </div>
              <h3 className="text-xl font-bold text-slate-900">Mis Ventas</h3>
              <p className="text-sm text-slate-600 mt-2">
                Visualiza tus órdenes y estado de pagos
              </p>
            </div>
          </Link>
        </div>

        {/* Listado de productos */}
        <div className="bg-white border-2 border-slate-200 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#515922' }}>
            Mis Productos
          </h3>

          {productosVendedor && productosVendedor.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: '#515922' }}>
                    <th className="text-left py-3 px-4 font-bold" style={{ color: '#515922' }}>Título</th>
                    <th className="text-left py-3 px-4 font-bold" style={{ color: '#515922' }}>Precio</th>
                    <th className="text-left py-3 px-4 font-bold" style={{ color: '#515922' }}>Estado</th>
                    <th className="text-left py-3 px-4 font-bold" style={{ color: '#515922' }}>Estado Prenda</th>
                    <th className="text-left py-3 px-4 font-bold" style={{ color: '#515922' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosVendedor.map((producto: Producto) => (
                    <tr key={producto.producto_id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-900">{producto.titulo}</td>
                      <td className="py-3 px-4 text-slate-600">${producto.precio.toLocaleString()}</td>
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
                      <td className="py-3 px-4">
                        <Link 
                          href={`/productos/${producto.producto_id}`}
                          className="text-sm font-medium px-3 py-1 rounded transition-all duration-200"
                          style={{ color: '#515922' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#515922';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#515922';
                          }}
                        >
                          Ver
                        </Link>
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
      </div>
    </main>
  );
}
