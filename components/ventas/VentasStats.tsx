import { StatCard } from '@/components/ui/StatCard';

interface VentasStatsProps {
  totalVentas: number;
  totalIngresos: number;
  ventasPendientes: number;
  ventasCompletas: number;
}

export function VentasStats({
  totalVentas,
  totalIngresos,
  ventasPendientes,
  ventasCompletas,
}: VentasStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <StatCard
        variant="dashboard"
        label="Total de Ventas"
        value={totalVentas}
        borderColor="#8fa18d"
      />

      <StatCard
        variant="dashboard"
        label="Ingresos"
        value={Math.round(totalIngresos)}
        borderColor="#22c55e"
      />

      <StatCard
        variant="dashboard"
        label="Pendientes"
        value={ventasPendientes}
        borderColor="#2196f3"
      />

      <StatCard
        variant="dashboard"
        label="Completadas"
        value={ventasCompletas}
        borderColor="#fb8c00"
      />
    </div>
  );
}