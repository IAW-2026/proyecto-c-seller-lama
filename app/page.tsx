import Link from 'next/link';
import { PageContainer } from '@/components/ui/PageContainer';

const PRIMARY_COLOR = '#515922';

export default function Home() {
  // TODO: Cuando Clerk esté configurado, esta lógica debería ser:
  // if (isSignedIn) {
  //   redirect('/dashboard');
  // }
  
  return (
    <main className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-amber-50 border-b border-slate-200">
        <PageContainer>
          <div className="flex items-center justify-between py-6">
            <h1 className="text-2xl font-bold" style={{ color: PRIMARY_COLOR }}>
              LAMA seller app
            </h1>
          </div>
        </PageContainer>
      </header>

      {/* Contenido principal */}
      <PageContainer>
        <div className="py-12">
          {/* Título */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>
              Inicio
            </h2>
            <p className="text-slate-600">
              Accede a tu panel de vendedor o administrador
            </p>
          </div>

          {/* Grid de opciones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Dashboard */}
            <Link href="/dashboard">
              <div 
                className="bg-white border-2 rounded-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-lg h-full flex flex-col justify-between"
                style={{ borderColor: PRIMARY_COLOR }}
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>
                    Dashboard
                  </h2>
                  <p className="text-slate-600">
                    Accede a tu panel de vendedor. Visualiza tus productos, órdenes y estadísticas
                  </p>
                </div>
              </div>
            </Link>

            {/* Productos */}
            <Link href="/productos">
              <div 
                className="bg-white border-2 rounded-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-lg h-full flex flex-col justify-between"
                style={{ borderColor: PRIMARY_COLOR }}
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>
                    Productos
                  </h2>
                  <p className="text-slate-600">
                    Gestiona tu catálogo de productos. Crea, edita y visualiza tu inventario
                  </p>
                </div>
              </div>
            </Link>

            {/* Admin Panel */}
            <Link href="/admin">
              <div 
                className="bg-white border-2 rounded-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-lg h-full flex flex-col justify-between"
                style={{ borderColor: PRIMARY_COLOR }}
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>
                    Panel Admin
                  </h2>
                  <p className="text-slate-600">
                    Visualiza estadísticas generales del sistema (vendedores, productos, órdenes)
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Info section */}
          <div className="bg-slate-50 border-l-4 rounded-lg p-8" style={{ borderColor: PRIMARY_COLOR }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: PRIMARY_COLOR }}>
              Nota de desarrollo
            </h3>
            <p className="text-slate-600 text-sm">
              Este sitio está en desarrollo. Próximamente se agregará autenticación con Clerk y protección de rutas por roles (seller, admin).
            </p>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
