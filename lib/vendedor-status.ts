import 'server-only';

import { supabaseAdmin } from '@/lib/supabase-admin';

export const getVendedorActivoById = async (clerkUserId: string): Promise<boolean> => {
  const { data, error } = await supabaseAdmin
    .from('vendedor')
    .select('activo')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (error || !data) {
    return false;
  }

  return Boolean(data.activo);
};

export const getVendedorActivoOrError = async (
  clerkUserId: string
): Promise<{ activo: boolean; message?: string }> => {
  const activo = await getVendedorActivoById(clerkUserId);

  if (!activo) {
    return {
      activo: false,
      message: 'Tu cuenta de vendedor se encuentra inactiva. No podés gestionar productos o ventas hasta que un administrador reactive tu cuenta.',
    };
  }

  return { activo: true };
};