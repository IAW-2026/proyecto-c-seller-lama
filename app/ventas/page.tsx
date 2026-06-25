import { PageContainer } from '@/components/ui/PageContainer';
import { VentasClient } from '@/components/ventas/VentasClient';
import { VentasStats } from '@/components/ventas/VentasStats';
import { VendedorInactivoBanner } from '@/components/ui/VendedorInactivoBanner';
import { requireVendedor } from '@/lib/auth/roles';
import { getVendedorActivoById } from '@/lib/vendedor-status';
import { VentasFilters } from '@/components/ventas/VentasFilters';
import { Pagination } from '@/components/ui/Pagination';
import {
  buildVentasQueryString,
  getEstadoEnvioOptions,
  getEstadoGeneralOptions,
  getEstadoPagoOptions,
  getVentasConFiltros,
} from '@/lib/ventas/ventas-query';
import type { VentasSearchParams } from '@/types/ventas-filters';

interface VentasPageProps {
  searchParams?: Promise<VentasSearchParams>;
}

export default async function VentasPage({ searchParams }: VentasPageProps) {
  const { userId } = await requireVendedor();

  const params = await searchParams;
  const vendedorActivo = await getVendedorActivoById(userId);
  const estadoPagoOptions = getEstadoPagoOptions();
  const estadoEnvioOptions = getEstadoEnvioOptions();
  const estadoGeneralOptions = getEstadoGeneralOptions();

  const { ordenes, totalPages, currentPage, filters, stats } =
    await getVentasConFiltros({
      userId,
      searchParams: params,
    });

  const buildPageHref = (page: number) =>
    buildVentasQueryString(filters, { page });

  return (
    <main className="flex-1 bg-gradient-to-b from-[#f6f1e7] via-[#f6f1e7] to-[#ede6d8]/40 relative overflow-hidden">
      <div className="h-14 md:h-[56px]" />

      <div className="absolute top-20 -left-32 w-80 h-80 bg-[#8fa18d]/[0.07] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-0 w-64 h-64 bg-[#8fa18d]/[0.05] rounded-full blur-[80px] pointer-events-none" />

      <PageContainer>
        <div className="relative py-7 md:py-9">
          <div className="mb-7 md:mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-[#8fa18d]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8fa18d]">
                Panel de ventas
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-[#37413d] leading-tight mb-2">
              Mis Ventas
            </h1>
            <p className="text-sm md:text-base text-[#6f7f6d] max-w-lg">
              Gestioná tus órdenes, pagos y estados de envío
            </p>
          </div>

          {!vendedorActivo && (
            <div className="mb-6">
              <VendedorInactivoBanner />
            </div>
          )}

          <VentasStats
            totalVentas={stats.totalVentas}
            totalIngresos={stats.totalIngresos}
            ventasPendientes={stats.ventasPendientes}
            ventasCompletas={stats.ventasCompletas}
            ventasCanceladas={stats.ventasCanceladas}
          />

          <VentasFilters
            search={filters.search}
            estado_pago={filters.estado_pago}
            estado_envio={filters.estado_envio}
            estado_general={filters.estado_general}
            from={filters.from}
            to={filters.to}
            estadoPagoOptions={estadoPagoOptions}
            estadoEnvioOptions={estadoEnvioOptions}
            estadoGeneralOptions={estadoGeneralOptions}
          />

          <VentasClient
            ordenes={ordenes}
            vendedorActivo={vendedorActivo}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            buildHref={buildPageHref}
          />
        </div>
      </PageContainer>
    </main>
  );
}
