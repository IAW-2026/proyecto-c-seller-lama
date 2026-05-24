'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProductoForm } from '@/hooks/useProductoForm';
import { useNotification } from '@/hooks/useNotification';
import {
  uploadProductImages,
} from '@/lib/supabase-products';
import {
  deleteProductoAction,
  updateProductoAction,
} from '@/actions/productoActions';
import { validateProductForm } from '@/lib/product-utils';
import type { Producto, ProductFormData } from '@/types/producto';
import { ProductImageManager } from './FormSections/ProductImageManager';
import { ProductFormFields } from './FormSections/ProductFormFields';
import { FormActions } from './FormSections/FormActions';
import { VendedorInactivoBanner } from '@/components/ui/VendedorInactivoBanner';

interface Categoria {
  categoria_producto_id: string;
  nombre: string;
}

interface ProductoEditFormProps {
  producto: Producto;
  categorias?: Categoria[];
  returnPath?: string;
  vendedorActivo: boolean;
}

export function ProductoEditForm({
  producto,
  categorias = [],
  returnPath = '/productos',
  vendedorActivo,
}: ProductoEditFormProps) {
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

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setNewImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));

    setNewImagePreviews((prev) => [...prev, ...previews]);

    e.target.value = '';
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages((prev) => prev.filter((url) => url !== imageUrl));
  };

  const handleRemoveNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);

    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDelete = () => {
    if (!vendedorActivo) {
      notification.showWarning('Tu cuenta de vendedor se encuentra inactiva.');
      return;
    }
    notification.showWithAction(
      '¿Estás seguro de que querés eliminar este producto?',
      'warning',
      {
        label: 'Sí, eliminar',
        onClick: async () => {
          setIsSaving(true);

          try {
            const result = await deleteProductoAction(producto.producto_id);

            if (!result.success) {
              notification.showError(result.message);
              setIsSaving(false);
              return;
            }

            notification.showSuccess(
              result.message,
              3000
            );

            router.push(returnPath);
            router.refresh();
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : 'Error al eliminar el producto';

            notification.showError(errorMessage);
            setIsSaving(false);
          }
        },
      },
      0
    );
  };

  const handleSave = async () => {
    if (!vendedorActivo) {
      notification.showWarning('Tu cuenta de vendedor se encuentra inactiva.');
      return;
    }
    const validation = validateProductForm({
      titulo: formData.titulo,
      precio: formData.precio,
      categoria_id: formData.categoria_id,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);

      notification.showError(
        'Por favor completa los campos obligatorios: Título, Precio y Categoría.'
      );

      return;
    }

    setIsSaving(true);

    try {
      const uploadedImageUrls = await uploadProductImages(
        producto.clerk_user_id,
        newImages
      );

      const finalImageUrls = [
        ...existingImages,
        ...uploadedImageUrls,
      ];

      const result = await updateProductoAction(
        producto.producto_id,
        formData,
        finalImageUrls
      );

      if (!result.success) {
        notification.showError(result.message);
        setIsSaving(false);
        return;
      }

      notification.showSuccess(result.message, 3000);

      router.push(returnPath);
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
    <main className="min-h-screen bg-[#f6f1e7] p-8 pt-[calc(56px+2rem)]">
      <div className="max-w-5xl mx-auto">
        <Link
          href={returnPath}
          className="text-[#6f7f6d] hover:text-[#37413d] text-sm font-medium mb-8 inline-block transition"
        >
          ← Volver
        </Link>

        {!vendedorActivo && (
          <div className="mb-6">
            <VendedorInactivoBanner />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductImageManager
            existingImages={existingImages}
            newImagePreviews={newImagePreviews}
            onAddImages={handleAddImages}
            onRemoveExistingImage={handleRemoveExistingImage}
            onRemoveNewImage={handleRemoveNewImage}
            disabled={!vendedorActivo}
          />

          <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-[#37413d] mb-2">
              Editar producto
            </h1>

            <p className="text-sm text-[#6f7f6d] mb-8">
              {producto.titulo}
            </p>

            <div className="space-y-6">
              <ProductFormFields
                formData={formData}
                categorias={categorias}
                onInputChange={handleChange}
                onPriceChange={handlePriceChange}
                errors={errors}
                disabled={!vendedorActivo}
              />

              <FormActions
                isSaving={isSaving}
                onSubmit={handleSave}
                onDelete={handleDelete}
                showDelete
                submitLabel="Guardar cambios"
                isBlocked={!vendedorActivo}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}