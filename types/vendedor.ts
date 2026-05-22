export interface Vendedor {
  clerk_user_id: string;
  nombre_vendedor: string;
  email: string;
  telefono: string | null;
  fecha_creacion: string;
  activo: boolean;
}
