import Link from 'next/link';
import type { EstadoFiltroProducto } from '@/types/producto';

interface ProductStatusFilterProps {
  selectedStatus: EstadoFiltroProducto;
}

const filters: {
  label: string;
  value: EstadoFiltroProducto;
}[] = [
  { label: 'Activos', value: 'activa' },
  { label: 'Inactivos', value: 'inactiva' },
  { label: 'Vendidos', value: 'vendida' },
  { label: 'Todos', value: 'todos' },
];

export function ProductStatusFilter({
  selectedStatus,
}: ProductStatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => {
        const isActive = selectedStatus === filter.value;

        const href =
          filter.value === 'activa'
            ? '/productos'
            : `/productos?estado=${filter.value}`;

        return (
          <Link
            key={filter.value}
            href={href}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold transition border
              ${
                isActive
                  ? 'bg-[#8fa18d] text-white border-[#8fa18d]'
                  : 'bg-[#ede6d8] text-[#37413d] border-[#d8cfbd] hover:bg-[#e8dfcf]'
              }
            `}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}