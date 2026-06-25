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
  createCategoriaProductoAction,
  deleteProductoAction,
  updateProductoAction,
} from '@/actions/productoActions';
import { validateProductForm } from '@/lib/product-utils';
import type { Producto, ProductFormData } from '@/types/producto';
import { ProductImageManager } from './FormSections/ProductImageManager';
import { ProductFormFields } from './FormSections/ProductFormFields';
import { FormActions } from './FormSections/FormActions';
import { VendedorInactivoBanner } from '@/components/ui/VendedorInactivoBanner';
import { ProductAiAssistant } from '@/components/ai/ProductAiAssistant';

interface Categoria {
  categoria_producto_id: string;
  nombre: string;
}

interface ProductoEditFormProps {
  producto: Producto;
  categorias?: Categoria[];
  returnPath?: string;
  vendedorActivo: boolean;
  hasOrdenAsociada?: boolean;
}

export function ProductoEditForm({
  producto,
  categorias = [],
  returnPath = '/productos',
  vendedorActivo,
  hasOrdenAsociada = false,
}: ProductoEditFormProps) {
  const router = useRouter();
  const notification = useNotification();
  const [isSaving, setIsSaving] = useState(false);
  const [localCategorias, setLocalCategorias] = useState<Categoria[]>(categorias);
  const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
  const [categoriaNombre, setCategoriaNombre] = useState('');
  const [isCreatingCategoria, setIsCreatingCategoria] = useState(false);

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
    setFormData,
  } = useProductoForm({
    initialData: initialFormData,
  });
  const selectedCategoriaNombre =
    localCategorias.find(
      (categoria) => categoria.categoria_producto_id === formData.categoria_id
    )?.nombre || '';

  const openCategoriaModal = () => {
    if (!vendedorActivo) {
      notification.showWarning('Tu cuenta de vendedor se encuentra inactiva.');
      return;
    }
    setCategoriaNombre('');
    setIsCategoriaModalOpen(true);
  };

  const closeCategoriaModal = () => {
    setIsCategoriaModalOpen(false);
  };

  const handleCreateCategoria = async () => {
    if (!vendedorActivo) {
      notification.showWarning('Tu cuenta de vendedor se encuentra inactiva.');
      return;
    }
    const nombre = categoriaNombre.trim();

    if (!nombre) {
      notification.showError('El nombre de la categoria es obligatorio.');
      return;
    }

    setIsCreatingCategoria(true);

    try {
      const result = await createCategoriaProductoAction(nombre);

      if (!result.success || !result.data) {
        notification.showError(result.message);
        return;
      }

      const nuevaCategoria = result.data;

      setLocalCategorias((prev) => [...prev, nuevaCategoria]);
      setFormData((prev) => ({
        ...prev,
        categoria_id: nuevaCategoria.categoria_producto_id,
      }));
      notification.showSuccess(result.message, 3000);
      closeCategoriaModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al crear la categoria';
      notification.showError(errorMessage);
    } finally {
      setIsCreatingCategoria(false);
    }
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setNewImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));

    setNewImagePreviews((prev) => [...prev, ...previews]);

    e.target.value = '';
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
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

    if (hasOrdenAsociada) {
      notification.showWarning(
        'No podes eliminar este producto porque tiene una orden asociada.'
      );
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

      const finalImageUrls = Array.from(
        new Set([...existingImages, ...uploadedImageUrls])
      );

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
                categorias={localCategorias}
                onInputChange={handleChange}
                onPriceChange={handlePriceChange}
                errors={errors}
                onCreateCategory={openCategoriaModal}
                disabled={!vendedorActivo}
              />

              <ProductAiAssistant
                formData={formData}
                categoriaNombre={selectedCategoriaNombre}
                disabled={!vendedorActivo}
                onApplyTitle={(titulo) =>
                  setFormData((prev) => ({ ...prev, titulo }))
                }
                onApplyDescription={(descripcion) =>
                  setFormData((prev) => ({ ...prev, descripcion }))
                }
                onApplyField={(field, value) =>
                  setFormData(
                    (prev) => ({ ...prev, [field]: value }) as ProductFormData
                  )
                }
              />

              <FormActions
                isSaving={isSaving}
                onSubmit={handleSave}
                onDelete={handleDelete}
                showDelete
                deleteDisabled={hasOrdenAsociada}
                deleteDisabledMessage="No se puede eliminar un producto con orden asociada."
                submitLabel="Guardar cambios"
                isBlocked={!vendedorActivo}
              />
            </div>
          </div>
        </div>
      </div>
      {isCategoriaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl border border-[#d8cfbd] bg-[#f6f1e7] p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[#37413d] mb-4">
              Nueva categoria
            </h2>

            <label className="block text-sm font-medium text-[#37413d] mb-2">
              Nombre de la categoria
            </label>
            <input
              type="text"
              value={categoriaNombre}
              onChange={(event) => setCategoriaNombre(event.target.value)}
              placeholder="Ej: Accesorios"
              disabled={!vendedorActivo}
              className="w-full rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm text-[#37413d] outline-none focus:border-[#8fa18d]"
            />

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeCategoriaModal}
                className="rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm font-semibold text-[#37413d] transition hover:bg-[#ede6d8]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateCategoria}
                disabled={isCreatingCategoria || !vendedorActivo}
                className="rounded-lg border border-[#8fa18d] bg-[#8fa18d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7e937c] disabled:opacity-60"
              >
                {isCreatingCategoria ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
