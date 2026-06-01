import type { EnvioDetalle } from '@/types/envio';

type DespacharOrdenResponse = {
  orden_id: string;
  envio_id?: string;
  empresa_logistica?: string;
  codigo_seguimiento?: string;
  estado?: string;
  estado_envio?: string;
};

export const despacharOrden = async (
  nroOrden: string
): Promise<DespacharOrdenResponse> => {
  const response = await fetch(`/api/ordenes/${encodeURIComponent(nroOrden)}/despachar`, {
    method: 'POST',
  });

  const data = (await response.json()) as DespacharOrdenResponse | { error?: string };

  if (!response.ok) {
    const message = 'error' in data && data.error ? data.error : 'Error al despachar la orden';
    throw new Error(message);
  }

  return data as DespacharOrdenResponse;
};

export const obtenerEnvioOrden = async (
  nroOrden: string
): Promise<EnvioDetalle> => {
  const response = await fetch(
    `/api/ordenes/${encodeURIComponent(nroOrden)}/envio`
  );

  const data = (await response.json()) as EnvioDetalle | { error?: string };

  if (!response.ok) {
    const message =
      'error' in data && data.error
        ? data.error
        : 'Error al consultar el envio';
    throw new Error(message);
  }

  return data as EnvioDetalle;
};
