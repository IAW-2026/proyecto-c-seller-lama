'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductImageManager } from '@/components/productos/FormSections/ProductImageManager';
import { ProductFormFields } from '@/components/productos/FormSections/ProductFormFields';
import { FormActions } from '@/components/productos/FormSections/FormActions';
import { useNotification } from '@/hooks/useNotification';
import { useProductoForm } from '@/hooks/useProductoForm';
import { uploadProductImages } from '@/lib/supabase-products';
import { validateProductForm } from '@/lib/product-utils';
import { updateProductoAdmin } from '@/actions/adminActions';
import type { Producto, ProductFormData } from '@/types/producto';

interface Categoria {
  categoria_producto_id: string;
  nombre: string;
}

interface ProductoAdminEditFormProps {
  producto: Producto;
  categorias: Categoria[];
}

export function ProductoAdminEditForm({
  producto,
  categorias,
}: ProductoAdminEditFormProps) {
  const router = useRouter();
  const notification = useNotification();
  const [isSaving, setIsSaving] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(
    producto.imagenes || []
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const initialFormData: ProductFormData = {
    titulo: producto.titulo,
    descripcion: producto.descripcion ?? '',
    precio: producto.precio.toString(),
    categoria_id: producto.categoria_id,
    estado_prenda: producto.estado_prenda,
    talle: producto.talle ?? '',
    marca: producto.marca ?? '',
    estado_publicacion: producto.estado_publicacion,
    genero: producto.genero,
  };

  const {
    formData,
    errors,
    handleChange,
    handlePriceChange,
    setErrors,
  } = useProductoForm({
    initialData: initialFormData,
  });

  const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    setNewImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...previews]);

    event.target.value = '';
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const validation = validateProductForm({
      titulo: formData.titulo,
      precio: formData.precio,
      categoria_id: formData.categoria_id,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      notification.showError(
        'Por favor completa los campos obligatorios: TÃ­tulo, Precio y CategorÃ­a.'
      );
      return;
    }

    setIsSaving(true);

    try {
      const uploadedImageUrls = await uploadProductImages(
        producto.clerk_user_id,
        newImages
      );
      const finalImageUrls = Array.from(
        new Set([...existingImages, ...uploadedImageUrls])
      );

      const result = await updateProductoAdmin({
        producto_id: producto.producto_id,
        formData,
        imageUrls: finalImageUrls,
      });

      if (!result.success) {
        notification.showError(result.message);
        setIsSaving(false);
        return;
      }

      notification.showSuccess(result.message, 3000);
      router.push('/admin#productos');
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al actualizar el producto';

      notification.showError(errorMessage);
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ProductImageManager
        existingImages={existingImages}
        newImagePreviews={newImagePreviews}
        onAddImages={handleAddImages}
        onRemoveExistingImage={handleRemoveExistingImage}
        onRemoveNewImage={handleRemoveNewImage}
      />

      <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-[#37413d] mb-2">
          Datos del producto
        </h2>
        <p className="text-sm text-[#6f7f6d] mb-8">
          Vendedor: {producto.clerk_user_id}
        </p>

        <div className="space-y-6">
          <ProductFormFields
            formData={formData}
            categorias={categorias}
            onInputChange={handleChange}
            onPriceChange={handlePriceChange}
            errors={errors}
          />

          <FormActions
            isSaving={isSaving}
            onSubmit={handleSave}
            submitLabel="Guardar cambios"
            cancelHref="/admin#productos"
          />
        </div>
      </div>
    </div>
  );
}
