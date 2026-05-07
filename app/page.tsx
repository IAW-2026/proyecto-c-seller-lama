import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold mb-4">LAMA Seller</h1>
        <p className="text-xl text-slate-300 mb-12">
          Panel de gestión para vendedores de ReWear. Administra tu catálogo, visualiza ventas y gestiona tu inventario.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/productos" className="block p-6 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
            <h2 className="text-2xl font-semibold mb-2">📦 Productos</h2>
            <p className="text-slate-300">Gestiona tu catálogo de productos</p>
          </Link>
          
          <Link href="/ventas" className="block p-6 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
            <h2 className="text-2xl font-semibold mb-2">💰 Ventas</h2>
            <p className="text-slate-300">Visualiza tus órdenes y ventas</p>
          </Link>
          
          <Link href="/panel" className="block p-6 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
            <h2 className="text-2xl font-semibold mb-2">⚙️ Panel</h2>
            <p className="text-slate-300">Administración general</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
