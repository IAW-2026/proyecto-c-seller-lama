'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProductoForm } from '@/hooks/useProductoForm';
import { updateProduct } from '@/lib/supabase-products';
import { validateProductForm } from '@/lib/product-utils';
import type { Producto, ProductFormData } from '@/types/producto';
import { ImagePreview } from './FormSections/ImagePreview';
import { ProductFormFields } from './FormSections/ProductFormFields';
import { FormActions } from './FormSections/FormActions';

interface Categoria {
  categoria_producto_id: string;
  nombre: string;
}

interface ProductoEditFormProps {
  producto: Producto;
  categorias: Categoria[];
}

export function ProductoEditForm({
  producto,
  categorias,
}: ProductoEditFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Convertir precio numérico a formato string
  const initialFormData: ProductFormData = {
    titulo: producto.titulo,
    descripcion: producto.descripcion,
    precio: producto.precio.toString(),
    categoria_id: producto.categoria_id,
    estado_prenda: producto.estado_prenda,
    talle: producto.talle,
    marca: producto.marca,
    estado_publicacion: producto.estado_publicacion,
  };

  const { formData, errors, handleChange, handlePriceChange } = useProductoForm(
    { initialData: initialFormData }
  );

  const imagenPrincipal = producto.imagenes?.[0] || '';

  const handleSave = async () => {
    // Validar formulario
    const validation = validateProductForm({
      titulo: formData.titulo,
      precio: formData.precio,
      categoria_id: formData.categoria_id,
    });

    if (!validation.isValid) {
      alert('Por favor completa los campos requeridos correctamente');
      return;
    }

    setIsSaving(true);

    try {
      // Actualizar producto (sin cambiar imágenes por ahora)
      const imageUrls = producto.imagenes || [];
      await updateProduct(
        producto.producto_id,
        formData as ProductFormData,
        imageUrls
      );

      router.push('/productos');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error al actualizar el producto';
      alert(errorMessage);
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f1e7] p-8">
      <div className="max-w-4xl mx-auto">
        <a
          href="/productos"
          className="text-[#6f7f6d] hover:text-[#37413d] text-sm font-medium mb-8 inline-block transition"
        >
          ← Volver a productos
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen preview */}
          <ImagePreview imageUrl={imagenPrincipal} />

          {/* Formulario */}
          <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-[#37413d] mb-2">
              Editar producto
            </h1>
            <p className="text-sm text-[#6f7f6d] mb-8">{producto.titulo}</p>

            <div className="space-y-6">
              {/* Campos del formulario */}
              <ProductFormFields
                formData={formData}
                categorias={categorias}
                onInputChange={handleChange}
                onPriceChange={handlePriceChange}
                errors={errors}
              />

              {/* Botones de acción */}
              <FormActions
                isSaving={isSaving}
                onSubmit={handleSave}
                submitLabel="Guardar cambios"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
