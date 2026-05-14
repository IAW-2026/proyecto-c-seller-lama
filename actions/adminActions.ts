'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

type ActionResult = {
  success: boolean;
  message: string;
};

export async function deleteProducto(productoId: string): Promise<ActionResult> {
  const { data: ordenesAsociadas } = await supabase
    .from('orden')
    .select('nro_orden')
    .eq('producto_id', productoId)
    .limit(1);

  if (ordenesAsociadas && ordenesAsociadas.length > 0) {
    return {
      success: false,
      message: `No se puede eliminar este producto porque tiene órdenes asociadas. Primero elimina la orden ${ordenesAsociadas[0].nro_orden}.`,
    };
  }

  const { error } = await supabase
    .from('producto')
    .delete()
    .eq('producto_id', productoId);

  if (error) {
    return {
      success: false,
      message: 'No se pudo eliminar el producto. Intenta nuevamente.',
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
      message: 'No se pudo eliminar la orden. Intenta nuevamente.',
    };
  }

  revalidatePath('/admin');

  return {
    success: true,
    message: 'Orden eliminada exitosamente.',
  };
}

export async function deleteVendedor(clerkUserId: string): Promise<ActionResult> {
  const { data: productosAsociados } = await supabase
    .from('producto')
    .select('titulo')
    .eq('clerk_user_id', clerkUserId)
    .limit(1);

  if (productosAsociados && productosAsociados.length > 0) {
    return {
      success: false,
      message: `No se puede eliminar este vendedor porque tiene productos asociados. Primero elimina o reasigna el producto "${productosAsociados[0].titulo}".`,
    };
  }

  const { error } = await supabase
    .from('vendedor')
    .delete()
    .eq('clerk_user_id', clerkUserId);

  if (error) {
    return {
      success: false,
      message: 'No se pudo eliminar el vendedor. Intenta nuevamente.',
    };
  }

  revalidatePath('/admin');

  return {
    success: true,
    message: 'Vendedor eliminado exitosamente.',
  };
}