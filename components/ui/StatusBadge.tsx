/*
Componente reutilizable para mostrar estados visuales
consistentes en toda la aplicación.
Centraliza colores, etiquetas e iconos según el estado.
*/

type StatusType =
  | 'activa'
  | 'inactiva'
  | 'vendida'
  | 'pendiente'
  | 'aprobado'
  | 'rechazado'
  | 'completado'
  | 'cancelado'
  | 'pendiente_pago'
  | 'pagada'
  | 'en_preparacion'
  | 'enviada'
  | 'completada'
  | 'cancelada'
  | 'despachado'
  | 'entregado'
  | null
  | undefined;

interface StatusBadgeProps {
  status?: StatusType;
  label?: string;
}

const statusConfig: Record<
  Exclude<StatusType, null | undefined>,
  { bg: string; text: string; dot: string; label: string }
> = {
  activa: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    label: 'Activa',
  },
  inactiva: {
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    dot: 'bg-slate-400',
    label: 'Inactiva',
  },
  vendida: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    label: 'Vendida',
  },
  completado: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    label: 'Completado',
  },
  pendiente: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    label: 'Pendiente',
  },
  aprobado: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    label: 'Aprobado',
  },
  rechazado: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    label: 'Rechazado',
  },
  cancelado: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    label: 'Cancelado',
  },
  pendiente_pago: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    label: 'Pendiente de pago',
  },
  pagada: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    label: 'Pagada',
  },
  en_preparacion: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    label: 'En preparación',
  },
  enviada: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    dot: 'bg-indigo-500',
    label: 'Enviada',
  },
  completada: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    label: 'Completada',
  },
  cancelada: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    label: 'Cancelada',
  },
  despachado: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    dot: 'bg-violet-500',
    label: 'Despachado',
  },
  entregado: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    label: 'Entregado',
  },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  if (!status) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Sin estado
      </span>
    );
  }

  const config = statusConfig[status];
  const displayLabel = label || config.label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {displayLabel}
    </span>
  );
}