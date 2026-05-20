import { supabase } from '@/lib/supabase';
import { requireSuperAdmin } from '@/lib/auth/roles';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export default async function AdminPage() {
  await requireSuperAdmin();

  const vendedoresQuery = supabase
    .from('vendedor')
    .select('*')
    .order('fecha_creacion', { ascending: false });

  const productosQuery = supabase
    .from('producto')
    .select(`
      *,
      vendedor (
        nombre_vendedor
      )
    `)
    .order('fecha_creacion', { ascending: false });

  const ordenesQuery = supabase
    .from('orden')
    .select('*')
    .order('fecha_creacion', { ascending: false });

  const [
    { data: vendedores, error: vendedoresError },
    { data: productos, error: productosError },
    { data: ordenes, error: ordenesError },
  ] = await Promise.all([vendedoresQuery, productosQuery, ordenesQuery]);

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

          <AdminDashboardClient
            vendedores={vendedores}
            productos={productos}
            ordenes={ordenes}
          />
        </div>
      </PageContainer>
    </main>
  );
}