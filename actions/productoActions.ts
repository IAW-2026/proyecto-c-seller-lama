'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getVendedorActivoOrError } from '@/lib/vendedor-status';
import { parsePrice } from '@/lib/product-utils';
import type { ProductFormData, GeneroProducto } from '@/types/producto';

const GENEROS_VALIDOS: GeneroProducto[] = ['hombre', 'mujer', 'niños'];

const isGeneroValido = (genero: unknown): genero is GeneroProducto =>
  GENEROS_VALIDOS.includes(genero as GeneroProducto);

type ActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

const getUserIdOrError = async (): Promise<string | null> => {
  const { userId } = await auth();
  return userId || null;
};

const ensureVendedorActivo = async (): Promise<ActionResult | null> => {
  const userId = await getUserIdOrError();

  if (!userId) {
    return { success: false, message: 'No autenticado.' };
  }

  const status = await getVendedorActivoOrError(userId);

  if (!status.activo) {
    return {
      success: false,
      message: status.message || 'Tu cuenta de vendedor se encuentra inactiva.',
    };
  }

  return null;
};

const extractStoragePaths = (imageUrls: string[]) => {
  return imageUrls
    .map((url) => {
      const parts = url.split('/productos/');
      if (parts.length < 2) return null;
      return `productos/${parts[1]}`;
    })
    .filter((path): path is string => Boolean(path));
};

export async function createProductoAction(
  formData: ProductFormData,
  imageUrls: string[]
): Promise<ActionResult> {
  const inactive = await ensureVendedorActivo();
  if (inactive) return inactive;

  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: 'No autenticado.' };
  }

  if (!isGeneroValido(formData.genero)) {
    return { success: false, message: 'El género seleccionado no es válido.' };
  }

  const precioNumerico = parsePrice(formData.precio);

  const { error } = await supabaseAdmin.from('producto').insert({
    clerk_user_id: userId,
    titulo: formData.titulo,
    descripcion: formData.descripcion || null,
    precio: precioNumerico,
    imagenes: imageUrls.length > 0 ? imageUrls : null,
    categoria_id: formData.categoria_id,
    estado_prenda: formData.estado_prenda,
    talle: formData.talle || null,
    marca: formData.marca || null,
    estado_publicacion: formData.estado_publicacion,
    genero: formData.genero,
  });

  if (error) {
    return { success: false, message: `Error al crear producto: ${error.message}` };
  }

  revalidatePath('/productos');

  return { success: true, message: 'Producto creado exitosamente.' };
}

export async function updateProductoAction(
  productoId: string,
  formData: ProductFormData,
  imageUrls: string[]
): Promise<ActionResult> {
  const inactive = await ensureVendedorActivo();
  if (inactive) return inactive;

  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: 'No autenticado.' };
  }

  if (!isGeneroValido(formData.genero)) {
    return { success: false, message: 'El género seleccionado no es válido.' };
  }

  const { data: producto } = await supabaseAdmin
    .from('producto')
    .select('producto_id, clerk_user_id')
    .eq('producto_id', productoId)
    .single();

  if (!producto || producto.clerk_user_id !== userId) {
    return { success: false, message: 'No autorizado para editar este producto.' };
  }

  const precioNumerico = parsePrice(formData.precio);

  const { error } = await supabaseAdmin
    .from('producto')
    .update({
      titulo: formData.titulo,
      descripcion: formData.descripcion || null,
      precio: precioNumerico,
      imagenes: imageUrls.length > 0 ? imageUrls : null,
      categoria_id: formData.categoria_id,
      estado_prenda: formData.estado_prenda,
      talle: formData.talle || null,
      marca: formData.marca || null,
      estado_publicacion: formData.estado_publicacion,
      genero: formData.genero,
    })
    .eq('producto_id', productoId);

  if (error) {
    return { success: false, message: `Error al actualizar el producto: ${error.message}` };
  }

  revalidatePath('/productos');
  revalidatePath(`/productos/${productoId}`);

  return { success: true, message: 'Producto actualizado exitosamente.' };
}

export async function deleteProductoAction(productoId: string): Promise<ActionResult> {
  const inactive = await ensureVendedorActivo();
  if (inactive) return inactive;

  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: 'No autenticado.' };
  }

  const { data: producto } = await supabaseAdmin
    .from('producto')
    .select('producto_id, clerk_user_id, imagenes')
    .eq('producto_id', productoId)
    .single();

  if (!producto || producto.clerk_user_id !== userId) {
    return { success: false, message: 'No autorizado para eliminar este producto.' };
  }

  const imageUrls = Array.isArray(producto.imagenes) ? producto.imagenes : [];
  const filePaths = extractStoragePaths(imageUrls);

  if (filePaths.length > 0) {
    const { error: storageError } = await supabaseAdmin.storage
      .from('productos')
      .remove(filePaths);

    if (storageError) {
      return { success: false, message: `Error al eliminar imágenes: ${storageError.message}` };
    }
  }

  const { error } = await supabaseAdmin
    .from('producto')
    .delete()
    .eq('producto_id', productoId);

  if (error) {
    return { success: false, message: `Error al eliminar el producto: ${error.message}` };
  }

  revalidatePath('/productos');

  return { success: true, message: 'Producto eliminado exitosamente.' };
}

export async function createCategoriaProductoAction(
  nombre: string
): Promise<ActionResult<{ categoria_producto_id: string; nombre: string }>> {
  const inactive = await ensureVendedorActivo();
  if (inactive) return inactive;

  const { data, error } = await supabaseAdmin
    .from('categoria_producto')
    .insert({ nombre })
    .select('categoria_producto_id, nombre')
    .single();

  if (error || !data) {
    return {
      success: false,
      message: `Error al crear categoria: ${error?.message || 'sin datos'}`,
    };
  }

  return {
    success: true,
    message: 'Categoria creada exitosamente.',
    data: data as { categoria_producto_id: string; nombre: string },
  };
}