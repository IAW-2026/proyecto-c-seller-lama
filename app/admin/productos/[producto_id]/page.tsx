import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { requireSuperAdmin } from '@/lib/auth/roles';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProductoAdminEditForm } from '@/components/admin/ProductoAdminEditForm';
import type { Producto } from '@/types';

interface Props {
  params: Promise<{ producto_id: string }>;
}

interface Categoria {
  categoria_producto_id: string;
  nombre: string;
}

export default async function ProductoAdminEditPage({ params }: Props) {
  await requireSuperAdmin();

  const { producto_id } = await params;

  const [
    { data: producto, error: productoError },
    { data: categorias, error: categoriasError },
  ] = await Promise.all([
    supabase
      .from('producto')
      .select('*')
      .eq('producto_id', producto_id)
      .single(),
    supabase
      .from('categoria_producto')
      .select('categoria_producto_id, nombre')
      .order('nombre', { ascending: true }),
  ]);

  if (productoError || !producto) {
    return (
      <main className="min-h-screen bg-[#f6f1e7] pt-[56px]">
        <PageContainer>
          <div className="py-8 md:py-12">
            <Link
              href="/admin#productos"
              className="text-[#6f7f6d] hover:text-[#37413d] text-sm font-medium mb-6 inline-block transition"
            >
              Volver al panel
            </Link>

            <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] p-6 text-[#37413d]">
              {productoError
                ? `Error: ${productoError.message}`
                : 'Producto no encontrado'}
            </div>
          </div>
        </PageContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1e7] pt-[56px]">
      <PageContainer>
        <div className="py-8 md:py-12">
          <Link
            href="/admin#productos"
            className="text-[#6f7f6d] hover:text-[#37413d] text-sm font-medium mb-6 inline-block transition"
          >
            Volver al panel
          </Link>

          <PageHeader
            title="Editar producto"
            description={producto.titulo}
          />

          {categoriasError && (
            <div className="mb-6 rounded-xl border border-[#d17d6f] bg-red-50 p-4 text-sm text-[#7d3c36]">
              No se pudieron cargar las categorias. Intenta nuevamente.
            </div>
          )}

          <ProductoAdminEditForm
            producto={producto as Producto}
            categorias={(categorias as Categoria[]) || []}
          />
        </div>
      </PageContainer>
    </main>
  );
}
