'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { requireSuperAdmin } from '@/lib/auth/roles';
import { parsePrice } from '@/lib/product-utils';
import type { Orden } from '@/types';
import type { ProductFormData } from '@/types/producto';

type ActionResult = {
  success: boolean;
  message: string;
};

const GENEROS_VALIDOS = new Set(['hombre', 'mujer', 'niÃ±os']);

const isGeneroValido = (genero: unknown): genero is ProductFormData['genero'] =>
  typeof genero === 'string' && GENEROS_VALIDOS.has(genero);

type UpdateVendedorPayload = {
  clerk_user_id: string;
  nombre_vendedor: string;
  email: string;
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

type UpdateProductoPayload = {
  producto_id: string;
  formData: ProductFormData;
  imageUrls: string[];
};

export async function deleteProducto(productoId: string): Promise<ActionResult> {
  await requireSuperAdmin();

  const { data: ordenesAsociadas } = await supabase
    .from('orden_item')
    .select('orden_id, orden:orden_id (nro_orden)')
    .eq('producto_id', productoId)
    .limit(1);

  if (ordenesAsociadas && ordenesAsociadas.length > 0) {
    const orden = ordenesAsociadas[0].orden as { nro_orden?: string } | null;
    const ordenLabel = orden?.nro_orden ? ` ${orden.nro_orden}` : '';
    return {
      success: false,
      message: `No se puede eliminar este producto porque tiene ordenes asociadas. Primero elimina la orden${ordenLabel}.`,
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
  await requireSuperAdmin();

  const { error: itemsError } = await supabase
    .from('orden_item')
    .delete()
    .eq('orden_id', ordenId);

  if (itemsError) {
    return {
      success: false,
      message: 'No se pudo eliminar los items de la orden. Intenta nuevamente.',
    };
  }

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
  await requireSuperAdmin();

  const { error: productosError } = await supabase
    .from('producto')
    .update({ estado_publicacion: 'inactiva' })
    .eq('clerk_user_id', clerkUserId)
    .neq('estado_publicacion', 'vendida');

  if (productosError) {
    return {
      success: false,
      message: 'No se pudieron desactivar los productos del vendedor. Intenta nuevamente.',
    };
  }

  const { error } = await supabase
    .from('vendedor')
    .update({ activo: false })
    .eq('clerk_user_id', clerkUserId);

  if (error) {
    return {
      success: false,
      message: 'No se pudo desactivar el vendedor. Intenta nuevamente.',
    };
  }

  revalidatePath('/admin');

  return {
    success: true,
    message: 'Vendedor desactivado exitosamente.',
  };
}

export async function activateVendedor(clerkUserId: string): Promise<ActionResult> {
  await requireSuperAdmin();

  const { error } = await supabase
    .from('vendedor')
    .update({ activo: true })
    .eq('clerk_user_id', clerkUserId);

  if (error) {
    return {
      success: false,
      message: 'No se pudo activar el vendedor. Intenta nuevamente.',
    };
  }

  revalidatePath('/admin');

  return {
    success: true,
    message: 'Vendedor activado exitosamente.',
  };
}

export async function updateVendedor(
  payload: UpdateVendedorPayload
): Promise<ActionResult> {
  await requireSuperAdmin();

  const { error } = await supabase
    .from('vendedor')
    .update({
      nombre_vendedor: payload.nombre_vendedor,
      email: payload.email,
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

export async function updateProductoAdmin(
  payload: UpdateProductoPayload
): Promise<ActionResult> {
  await requireSuperAdmin();

  if (!isGeneroValido(payload.formData.genero)) {
    return { success: false, message: 'El gÃ©nero seleccionado no es vÃ¡lido.' };
  }

  const precioNumerico = parsePrice(payload.formData.precio);

  const { error } = await supabase
    .from('producto')
    .update({
      titulo: payload.formData.titulo,
      descripcion: payload.formData.descripcion || null,
      precio: precioNumerico,
      imagenes: payload.imageUrls.length > 0 ? payload.imageUrls : null,
      categoria_id: payload.formData.categoria_id,
      estado_prenda: payload.formData.estado_prenda,
      talle: payload.formData.talle || null,
      marca: payload.formData.marca || null,
      estado_publicacion: payload.formData.estado_publicacion,
      genero: payload.formData.genero,
    })
    .eq('producto_id', payload.producto_id);

  if (error) {
    return {
      success: false,
      message: 'No se pudo actualizar el producto. Intenta nuevamente.',
    };
  }

  revalidatePath('/admin');
  revalidatePath(`/admin/productos/${payload.producto_id}`);
  revalidatePath('/productos');
  revalidatePath(`/productos/${payload.producto_id}`);

  return {
    success: true,
    message: 'Producto actualizado exitosamente.',
  };
}

export async function updateOrden(
  payload: UpdateOrdenPayload
): Promise<ActionResult> {
  await requireSuperAdmin();

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
