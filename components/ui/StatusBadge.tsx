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
  { bg: string; text: string; icon: string; label: string }
> = {
  activa: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    icon: '●',
    label: 'Activa',
  },
  inactiva: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    icon: '○',
    label: 'Inactiva',
  },
  vendida: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: '✓',
    label: 'Vendida',
  },
  completado: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    icon: '✓',
    label: 'Completado',
  },
  pendiente: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    icon: '⏱',
    label: 'Pendiente',
  },
  aprobado: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: '✓',
    label: 'Aprobado',
  },
  rechazado: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: '✕',
    label: 'Rechazado',
  },
  cancelado: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: '✕',
    label: 'Cancelado',
  },

  pendiente_pago: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    icon: '⏱',
    label: 'Pendiente de pago',
  },
  pagada: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    icon: '✓',
    label: 'Pagada',
  },
  en_preparacion: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: '●',
    label: 'En preparación',
  },
  enviada: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    icon: '→',
    label: 'Enviada',
  },
  completada: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    icon: '✓',
    label: 'Completada',
  },
  cancelada: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: '✕',
    label: 'Cancelada',
  },
  despachado: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    icon: '→',
    label: 'Despachado',
  },
  entregado: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    icon: '✓',
    label: 'Entregado',
  },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  if (!status) {
    return (
      <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-600">
        Sin estado
      </span>
    );
  }

  const config = statusConfig[status];
  const displayLabel = label || config.label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className="text-xs">{config.icon}</span>
      {displayLabel}
    </span>
  );
}