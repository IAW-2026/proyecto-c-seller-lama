import { StatCard } from '@/components/ui/StatCard';

const iconClassName = 'h-5 w-5';

interface VentasStatsProps {
  totalVentas: number;
  totalIngresos: number;
  ventasPendientes: number;
  ventasCompletas: number;
  ventasCanceladas: number;
}

export function VentasStats({
  totalVentas,
  totalIngresos,
  ventasPendientes,
  ventasCompletas,
  ventasCanceladas,
}: VentasStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
      <StatCard
        variant="soft"
        label="Total de ventas"
        value={totalVentas}
        borderColor="#8fa18d"
        icon={
          <svg
            className={iconClassName}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 17l5-5 4 4 7-7" />
            <path d="M20 7v6h-6" />
          </svg>
        }
      />

      <StatCard
        variant="soft"
        label="Ingresos"
        value={`$${Math.round(totalIngresos).toLocaleString('es-AR')}`}
        borderColor="#8fa18d"
        icon={
          <svg
            className={iconClassName}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v18" />
            <path d="M17 7.5c-.8-1.2-2.3-2-4.2-2H10.5a3 3 0 000 6h3a3 3 0 010 6H11c-1.9 0-3.4-.8-4.2-2" />
          </svg>
        }
      />

      <StatCard
        variant="soft"
        label="Pendientes"
        value={ventasPendientes}
        borderColor="#8fa18d"
        icon={
          <svg
            className={iconClassName}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        }
      />

      <StatCard
        variant="soft"
        label="Completadas"
        value={ventasCompletas}
        borderColor="#8fa18d"
        icon={
          <svg
            className={iconClassName}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12l2.5 2.5L16 9" />
          </svg>
        }
      />

      <StatCard
        variant="soft"
        label="Canceladas"
        value={ventasCanceladas}
        borderColor="#8fa18d"
        icon={
          <svg
            className={iconClassName}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M9 9l6 6" />
            <path d="M15 9l-6 6" />
          </svg>
        }
      />
    </div>
  );
}