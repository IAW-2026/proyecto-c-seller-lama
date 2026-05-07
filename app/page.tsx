import Link from 'next/link';

export default function Home() {
  // TODO: Cuando Clerk esté configurado, esta lógica debería ser:
  // if (isSignedIn) {
  //   redirect('/dashboard');
  // }
  
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold" style={{ color: '#515922' }}>
              LAMA seller app
            </h1>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#515922' }}>
            Bienvenido a LAMA Seller
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            Panel de gestión para vendedores de ropa usada y vintage
          </p>
          <p className="text-slate-600">
            Administra tu catálogo, visualiza ventas y gestiona tu inventario desde un único lugar
          </p>
        </div>

        {/* Grid de opciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dashboard */}
          <Link href="/dashboard">
            <div 
              className="bg-white border-2 border-slate-200 rounded-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-slate-900 hover:bg-slate-50 h-full flex flex-col justify-between"
            >
              <div>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mb-4"
                  style={{ backgroundColor: '#515922' }}
                >
                  📊
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Dashboard</h2>
                <p className="text-slate-600">
                  Accede a tu panel de vendedor. Visualiza tus productos, órdenes y estadísticas
                </p>
              </div>
            </div>
          </Link>

          {/* Productos */}
          <Link href="/productos">
            <div 
              className="bg-white border-2 border-slate-200 rounded-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-slate-900 hover:bg-slate-50 h-full flex flex-col justify-between"
            >
              <div>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mb-4"
                  style={{ backgroundColor: '#515922' }}
                >
                  📦
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Productos</h2>
                <p className="text-slate-600">
                  Gestiona tu catálogo de productos. Crea, edita y visualiza tu inventario
                </p>
              </div>
            </div>
          </Link>

          {/* Admin Panel */}
          <Link href="/admin">
            <div 
              className="bg-white border-2 border-slate-200 rounded-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-slate-900 hover:bg-slate-50 h-full flex flex-col justify-between"
            >
              <div>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mb-4"
                  style={{ backgroundColor: '#515922' }}
                >
                  ⚙️
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Panel Admin</h2>
                <p className="text-slate-600">
                  Visualiza estadísticas generales del sistema (vendedores, productos, órdenes)
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Info section */}
        <div className="mt-16 bg-slate-50 border-l-4 rounded-lg p-8" style={{ borderColor: '#515922' }}>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#515922' }}>
            📝 Nota de desarrollo
          </h3>
          <p className="text-slate-600 text-sm">
            Este sitio está en desarrollo. Próximamente se agregará autenticación con Clerk y protección de rutas por roles (seller, admin).
          </p>
        </div>
      </div>
    </main>
  );
}
