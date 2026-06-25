export type EnvioHistorialItem = {
  estado: string;
  fecha?: string | null;
};

export type EnvioDetalle = {
  codigo_seguimiento: string;
  empresa_logistica: string;
  estado: string;
  historial?: Array<EnvioHistorialItem | string>;
};
