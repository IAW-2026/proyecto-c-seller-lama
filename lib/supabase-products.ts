/**
 * Servicios de Supabase para productos
 * Maneja uploads de imágenes y operaciones CRUD en la BD
 */

import { supabase } from '@/lib/supabase';
import { generateImageFileName, parsePrice } from '@/lib/product-utils';
import type { ProductFormData } from '@/types/producto';

export type { ProductFormData };

/**
 * Sube una imagen a Supabase Storage
 * Retorna la URL pública
 */
export const uploadProductImage = async (
  userId: string,
  file: File
): Promise<string> => {
  const fileName = generateImageFileName(userId, file.name);
  const filePath = `productos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('productos')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Error al subir imagen: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from('productos')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

/**
 * Sube múltiples imágenes y retorna array de URLs públicas
 */
export const uploadProductImages = async (
  userId: string,
  files: File[]
): Promise<string[]> => {
  const uploadPromises = files.map((file) =>
    uploadProductImage(userId, file)
  );

  return Promise.all(uploadPromises);
};

//no se usa quedo viejo cuando usaba directo de supabase, 
// ahora uso server actions que valida y verifica antes de insertar o actulizar en la bd.
export const createProduct = async (
  userId: string,
  formData: ProductFormData,
  imageUrls: string[]
): Promise<void> => {
  const precioNumerico = parsePrice(formData.precio);

  const { error } = await supabase.from('producto').insert({
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
  });

  if (error) {
    throw new Error(`Error al crear producto: ${error.message}`);
  }
};


