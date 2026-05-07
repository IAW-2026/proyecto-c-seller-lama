import Link from 'next/link';
import { ProductoEditForm } from '@/components/productos/ProductoEditForm';
import { productosFixture } from '@/lib/mocks/productos';

interface Props {
  params: Promise<{ producto_id: string }>;
}

export default async function ProductoDetallePage({ params }: Props) {
  const { producto_id } = await params;
  const producto = productosFixture.find((p) => p.producto_id === producto_id);

  if (!producto) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/productos"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-8 inline-block"
          >
            ← Volver a productos
          </Link>
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <p className="text-slate-600">Producto no encontrado</p>
          </div>
        </div>
      </main>
    );
  }

  return <ProductoEditForm producto={producto} />;
}
