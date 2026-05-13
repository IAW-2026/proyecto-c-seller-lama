'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProductoForm } from '@/hooks/useProductoForm';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useNotification } from '@/hooks/useNotification';
import {
  uploadProductImages,
  createProduct,
} from '@/lib/supabase-products';
import { validateProductForm } from '@/lib/product-utils';
import type { ProductFormData } from '@/types/producto';
import { ImagePreview } from './FormSections/ImagePreview';
import { ImageUpload } from './FormSections/ImageUpload';
import { ProductFormFields } from './FormSections/ProductFormFields';
import { FormActions } from './FormSections/FormActions';

interface Categoria {
  categoria_producto_id: string;
  nombre: string;
}

interface ProductoCreateFormProps {
  clerkUserId: string;
  categorias: Categoria[];
}

export function ProductoCreateForm({
  clerkUserId,
  categorias,
}: ProductoCreateFormProps) {
  const router = useRouter();
  const notification = useNotification();
  const { formData, errors, handleChange, handlePriceChange, setFormData } =
    useProductoForm();
  const {
    selectedImages,
    imagePreviews,
    handleImagesChange,
    removeImage,
    removeAllImages,
    imagenPrincipal,
  } = useImageUpload();
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async () => {
    // Validar formulario
    const validation = validateProductForm({
      titulo: formData.titulo,
      precio: formData.precio,
      categoria_id: formData.categoria_id,
    });

    if (!validation.isValid) {
      notification.showError(
        'Por favor completa los campos obligatorios: Título, Precio y Categoría.'
      );
      return;
    }

    setIsSaving(true);

    try {
      // Subir imágenes
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadProductImages(clerkUserId, selectedImages);
      }

      // Crear producto
      await createProduct(clerkUserId, formData as ProductFormData, imageUrls);

      notification.showSuccess('Producto creado exitosamente.', 3000);
      router.push('/productos');
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al crear el producto';
      notification.showError(errorMessage);
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f1e7] p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/productos"
          className="text-[#6f7f6d] hover:text-[#37413d] text-sm font-medium mb-8 inline-block transition"
        >
          ← Volver a productos
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen preview */}
          <div>
            <ImagePreview imageUrl={imagenPrincipal} />

            {/* Galería de imágenes seleccionadas */}
            {imagePreviews.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-[#37413d] mb-3">
                  Imágenes seleccionadas ({imagePreviews.length})
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-24 rounded-lg object-cover border border-[#d8cfbd]"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-[#d17d6f] text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-sm font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Formulario */}
          <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-[#37413d] mb-8">
              Nuevo producto
            </h1>

            <div className="space-y-6">
              {/* Selector imagen */}
              <ImageUpload
                onImagesChange={handleImagesChange}
                selectedImagesCount={selectedImages.length}
                firstImageName={selectedImages[0]?.name}
                onRemoveAll={removeAllImages}
              />

              {/* Campos del formulario */}
              <ProductFormFields
                formData={formData}
                categorias={categorias}
                onInputChange={handleChange}
                onPriceChange={handlePriceChange}
                errors={errors}
              />

              {/* Botones de acción */}
              <FormActions isSaving={isSaving} onSubmit={handleCreate} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}