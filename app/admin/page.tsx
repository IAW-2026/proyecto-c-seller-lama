import { requireSuperAdmin } from '@/lib/auth/roles';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { VendedoresTable } from '@/components/admin/VendedoresTable';
import { ProductosTable } from '@/components/admin/ProductosTable';
import { OrdenesTable } from '@/components/admin/OrdenesTable';
import { VendedoresFilters } from '@/components/admin/VendedoresFilters';
import { ProductosFilters } from '@/components/admin/ProductosFilters';
import { OrdenesFilters } from '@/components/admin/OrdenesFilters';
import {
  buildAdminQueryString,
  getAdminDashboardData,
  getEstadoEnvioOptions,
  getEstadoGeneralOptions,
  getEstadoPagoOptions,
  getEstadoPublicacionOptions,
  getVendedorActivoOptions,
  getVendedorOptions,
} from '@/lib/admin/admin-query';
import type { AdminSearchParams } from '@/types/admin-filters';

interface AdminPageProps {
  searchParams?: Promise<AdminSearchParams>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await requireSuperAdmin();

  const params = await searchParams;
  const { vendedores, productos, ordenes, filters } =
    await getAdminDashboardData(params);

  const estadoPublicacionOptions = getEstadoPublicacionOptions();
  const estadoPagoOptions = getEstadoPagoOptions();
  const estadoEnvioOptions = getEstadoEnvioOptions();
  const estadoGeneralOptions = getEstadoGeneralOptions();
  const vendedorActivoOptions = getVendedorActivoOptions();
  const vendedorOptions = await getVendedorOptions();

  // Independent pagination builders per section
  const buildVendedoresPageHref = (page: number) =>
    buildAdminQueryString(filters, { vendedores: { page } }) + '#vendedores';

  const buildProductosPageHref = (page: number) =>
    buildAdminQueryString(filters, { productos: { page } }) + '#productos';

  const buildOrdenesPageHref = (page: number) =>
    buildAdminQueryString(filters, { ordenes: { page } }) + '#ordenes';

  return (
    <main className="flex-1 bg-[#f6f1e7]">
      <PageContainer>
        <div className="py-8 md:py-12">
          <PageHeader
            title="Panel de Administración"
            description="Vista general de vendedores, productos y órdenes del sistema"
          />

          <VendedoresTable
            vendedores={vendedores.items}
            filtersBar={(
              <VendedoresFilters
                filters={filters}
                vendedorActivoOptions={vendedorActivoOptions}
              />
            )}
            pagination={(
              <Pagination
                currentPage={vendedores.currentPage}
                totalPages={vendedores.totalPages}
                buildHref={buildVendedoresPageHref}
              />
            )}
          />

          <ProductosTable
            productos={productos.items}
            filtersBar={(
              <ProductosFilters
                filters={filters}
                estadoPublicacionOptions={estadoPublicacionOptions}
                vendedorOptions={vendedorOptions}
              />
            )}
            pagination={(
              <Pagination
                currentPage={productos.currentPage}
                totalPages={productos.totalPages}
                buildHref={buildProductosPageHref}
              />
            )}
          />

          <OrdenesTable
            ordenes={ordenes.items}
            filtersBar={(
              <OrdenesFilters
                filters={filters}
                estadoGeneralOptions={estadoGeneralOptions}
                estadoPagoOptions={estadoPagoOptions}
                estadoEnvioOptions={estadoEnvioOptions}
              />
            )}
            pagination={(
              <Pagination
                currentPage={ordenes.currentPage}
                totalPages={ordenes.totalPages}
                buildHref={buildOrdenesPageHref}
              />
            )}
          />
        </div>
      </PageContainer>
    </main>
  );
}