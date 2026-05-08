type StatusType = 'activa' | 'inactiva' | 'vendida' | 'pendiente' | 'aprobado' | 'rechazado' | null | undefined;

interface StatusBadgeProps {
  status?: StatusType;
  label?: string;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  activa: {
    bg: '#dbeafe',
    text: '#075985',
    label: 'Activa'
  },
  inactiva: {
    bg: '#f3f4f6',
    text: '#6b7280',
    label: 'Inactiva'
  },
  vendida: {
    bg: '#dbeafe',
    text: '#075985',
    label: 'Vendida'
  },
  pendiente: {
    bg: '#fef3c7',
    text: '#92400e',
    label: 'Pendiente'
  },
  aprobado: {
    bg: '#dcfce7',
    text: '#166534',
    label: 'Aprobado'
  },
  rechazado: {
    bg: '#fee2e2',
    text: '#991b1b',
    label: 'Rechazado'
  }
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  // Default status if not provided
  if (!status) {
    return (
      <span 
        className="px-3 py-1 rounded-lg text-xs font-medium"
        style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
      >
        Sin estado
      </span>
    );
  }

  const config = statusConfig[status] || { bg: '#f3f4f6', text: '#6b7280', label: status };
  const displayLabel = label || config.label;

  return (
    <span 
      className="px-3 py-1 rounded-lg text-xs font-medium"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {displayLabel}
    </span>
  );
}
