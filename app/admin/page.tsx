import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { VendedoresTable } from '@/components/admin/VendedoresTable';
import { ProductosTable } from '@/components/admin/ProductosTable';
import { OrdenesTable } from '@/components/admin/OrdenesTable';

const dateLocale = 'es-AR';

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const [
    { data: vendedores, error: vendedoresError },
    { data: productos, error: productosError },
    { data: ordenes, error: ordenesError },
  ] = await Promise.all([
    supabase
      .from('vendedor')
      .select('*')
      .order('fecha_creacion', { ascending: false }),

    supabase
      .from('producto')
      .select('*')
      .order('fecha_creacion', { ascending: false }),

    supabase
      .from('orden')
      .select('*')
      .order('fecha_creacion', { ascending: false }),
  ]);

  const hasError = vendedoresError || productosError || ordenesError;

  if (hasError) {
    return (
      <main className="flex-1 bg-[#f6f1e7]">
        <PageContainer>
          <div className="py-8 md:py-12">
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
              Error al cargar los datos del panel de administración.
            </div>
          </div>
        </PageContainer>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#f6f1e7]">
      <PageContainer>
        <div className="py-8 md:py-12">
          <PageHeader
            title="Panel de Administración"
            description="Vista general de vendedores, productos y órdenes del sistema"
          />

          <VendedoresTable
            vendedores={vendedores}
          />

          <ProductosTable
            productos={productos}
          />

          <OrdenesTable
            ordenes={ordenes}
          />
        </div>
      </PageContainer>
    </main>
  );
}