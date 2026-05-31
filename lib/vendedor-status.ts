import 'server-only';

import { clerkClient } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const getVendedorActivoById = async (clerkUserId: string): Promise<boolean> => {
  const { data, error } = await supabaseAdmin
    .from('vendedor')
    .select('activo')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (data) {
    return Boolean(data.activo);
  }

  if (error) {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(clerkUserId);
      const email = user.emailAddresses[0]?.emailAddress;
      const firstName = user.firstName ?? '';
      const lastName = user.lastName ?? '';
      const nombreVendedor = `${firstName} ${lastName}`.trim() || email || 'Sin nombre';

      if (!email) return false;

      const { error: upsertError } = await supabaseAdmin
        .from('vendedor')
        .upsert(
          {
            clerk_user_id: clerkUserId,
            email,
            nombre_vendedor: nombreVendedor,
            telefono: null,
            activo: true,
          },
          { onConflict: 'clerk_user_id' }
        );

      if (!upsertError) {
        return true;
      }
    } catch {
      return false;
    }
  }

  return false;
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