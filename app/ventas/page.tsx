import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { VentasClient } from '@/components/ventas/VentasClient';
import { VentasStats } from '@/components/ventas/VentasStats';
import { VendedorInactivoBanner } from '@/components/ui/VendedorInactivoBanner';
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
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

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
    <main className="flex-1 bg-[#f6f1e7]">
      <PageContainer>
        <div className="py-8 md:py-12">
          <PageHeader
            title="Mis Ventas"
            description="Gestiona tus órdenes, pagos y estado de envíos"
          />

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