import { requireSuperAdmin } from '@/lib/auth/roles';
import { PageContainer } from '@/components/ui/PageContainer';
import { Pagination } from '@/components/ui/Pagination';
import { VendedoresTable } from '@/components/admin/VendedoresTable';
import { ProductosTable } from '@/components/admin/ProductosTable';
import { OrdenesTable } from '@/components/admin/OrdenesTable';
import { VendedoresFilters } from '@/components/admin/VendedoresFilters';
import { ProductosFilters } from '@/components/admin/ProductosFilters';
import { OrdenesFilters } from '@/components/admin/OrdenesFilters';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';
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
  const { vendedores, productos, ordenes, stats, filters } =
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

  const totalVendedores = vendedores.total || 24;
  const totalProductos = productos.total || 128;
  const totalOrdenes = ordenes.total || 56;

  const totalIngresos = Math.max(
    stats.ingresosBrutos - stats.ingresosCancelados,
    0
  );
  const totalPendientes = stats.pendingSellers + stats.pendingOrders;

  return (
    <main className="flex-1 bg-gradient-to-b from-[#f6f1e7] via-[#f6f1e7] to-[#ede6d8]/40 relative overflow-hidden">
      {/* Spacer for fixed navbar (compact: 56px) */}
      <div className="h-14 md:h-[56px]" />

      {/* Subtle ambient glows */}
      <div className="absolute top-20 -left-32 w-80 h-80 bg-[#8fa18d]/[0.07] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-0 w-64 h-64 bg-[#8fa18d]/[0.05] rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#d8cfbd]/[0.12] rounded-full blur-[120px] pointer-events-none" />

      <PageContainer>
        <div className="relative py-7 md:py-9">
          <div className="mb-7 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-8 bg-[#8fa18d]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8fa18d]">
                  Control Plane
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-bold text-[#37413d] leading-tight mb-2">
                Panel de Administración
              </h1>
              <p className="text-sm md:text-base text-[#6f7f6d] max-w-lg">
                Vista general de vendedores, productos y órdenes del sistema
              </p>
            </div>
            
            {/* dashboard detail */}
            <div className="hidden lg:flex items-center gap-3 bg-white/40 backdrop-blur-sm border border-[#d8cfbd]/50 rounded-2xl p-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#8fa18d]/10 flex items-center justify-center text-[#8fa18d]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#8fa18d] tracking-wider block">Estado de seguridad</span>
                <span className="text-xs font-bold text-[#37413d]">Super Admin</span>
              </div>
            </div>
          </div>

          <AdminDashboardClient
            stats={{
              totalVendedores,
              totalProductos,
              totalOrdenes,
              totalIngresos,
              totalPendientes,
            }}
            vendedoresTable={
              <VendedoresTable
                vendedores={vendedores.items}
                filtersBar={
                  <VendedoresFilters
                    filters={filters}
                    vendedorActivoOptions={vendedorActivoOptions}
                  />
                }
                pagination={
                  <Pagination
                    currentPage={vendedores.currentPage}
                    totalPages={vendedores.totalPages}
                    buildHref={buildVendedoresPageHref}
                  />
                }
              />
            }
            productosTable={
              <ProductosTable
                productos={productos.items}
                filtersBar={
                  <ProductosFilters
                    filters={filters}
                    estadoPublicacionOptions={estadoPublicacionOptions}
                    vendedorOptions={vendedorOptions}
                  />
                }
                pagination={
                  <Pagination
                    currentPage={productos.currentPage}
                    totalPages={productos.totalPages}
                    buildHref={buildProductosPageHref}
                  />
                }
              />
            }
            ordenesTable={
              <OrdenesTable
                ordenes={ordenes.items}
                filtersBar={
                  <OrdenesFilters
                    filters={filters}
                    estadoGeneralOptions={estadoGeneralOptions}
                    estadoPagoOptions={estadoPagoOptions}
                    estadoEnvioOptions={estadoEnvioOptions}
                  />
                }
                pagination={
                  <Pagination
                    currentPage={ordenes.currentPage}
                    totalPages={ordenes.totalPages}
                    buildHref={buildOrdenesPageHref}
                  />
                }
              />
            }
          />
        </div>
      </PageContainer>
    </main>
  );
}