'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

type ActionResult = {
  success: boolean;
  message: string;
};

export async function deleteProducto(productoId: string): Promise<ActionResult> {
  const { error } = await supabase
    .from('producto')
    .delete()
    .eq('producto_id', productoId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath('/admin');

  return {
    success: true,
    message: 'Producto eliminado exitosamente.',
  };
}

export async function deleteOrden(ordenId: string): Promise<ActionResult> {
  const { error } = await supabase
    .from('orden')
    .delete()
    .eq('orden_id', ordenId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath('/admin');

  return {
    success: true,
    message: 'Orden eliminada exitosamente.',
  };
}

export async function deleteVendedor(clerkUserId: string): Promise<ActionResult> {
  const { error } = await supabase
    .from('vendedor')
    .delete()
    .eq('clerk_user_id', clerkUserId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath('/admin');

  return {
    success: true,
    message: 'Vendedor eliminado exitosamente.',
  };
}