'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import type { Orden } from '@/types';

type ActionResult = {
  success: boolean;
  message: string;
};

type UpdateVendedorPayload = {
  clerk_user_id: string;
  nombre_vendedor: string;
  email: string;
  dni: string;
  telefono: string | null;
};

type UpdateOrdenPayload = {
  orden_id: string;
  nro_orden: string;
  total: number;
  estado_general: Orden['estado_general'];
  estado_pago: Orden['estado_pago'];
  estado_envio: Orden['estado_envio'];
  direccion_envio: string;
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

export async function updateVendedor(
  payload: UpdateVendedorPayload
): Promise<ActionResult> {
  const { error } = await supabase
    .from('vendedor')
    .update({
      nombre_vendedor: payload.nombre_vendedor,
      email: payload.email,
      dni: payload.dni,
      telefono: payload.telefono,
    })
    .eq('clerk_user_id', payload.clerk_user_id);

  if (error) {
    return {
      success: false,
      message: 'No se pudo actualizar el vendedor. Intenta nuevamente.',
    };
  }

  revalidatePath('/admin');

  return {
    success: true,
    message: 'Vendedor actualizado exitosamente.',
  };
}

export async function updateOrden(
  payload: UpdateOrdenPayload
): Promise<ActionResult> {
  const { error } = await supabase
    .from('orden')
    .update({
      nro_orden: payload.nro_orden,
      total: payload.total,
      estado_general: payload.estado_general,
      estado_pago: payload.estado_pago,
      estado_envio: payload.estado_envio,
      direccion_envio: payload.direccion_envio,
    })
    .eq('orden_id', payload.orden_id);

  if (error) {
    return {
      success: false,
      message: 'No se pudo actualizar la orden. Intenta nuevamente.',
    };
  }

  revalidatePath('/admin');

  return {
    success: true,
    message: 'Orden actualizada exitosamente.',
  };
}