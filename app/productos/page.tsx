import Link from 'next/link';
import { ProductoCard } from '@/components/productos/ProductoCard';
import { productosFixture } from '@/lib/mocks/productos';

export default function ProductosPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Productos</h1>
          <p className="text-slate-600">
            Gestiona tu catálogo de productos. Aquí puedes ver, editar y controlar el estado de tus artículos.
          </p>
        </div>

        {/* Grid de productos, Grid responsive: 1 columna mobile, 2 tablet, 4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productosFixture.map((producto) => (
            <ProductoCard key={producto.producto_id} producto={producto} />
          ))}
        </div>
      </div>
    </main>
  );
}
