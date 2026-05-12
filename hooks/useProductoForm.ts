'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/product-utils';
import type { ProductFormData } from '@/types/producto';

interface UseProductoFormProps {
  initialData?: ProductFormData;
}

interface UseProductoFormReturn {
  formData: ProductFormData;
  errors: Record<string, string>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
  setFormData: (data: ProductFormData) => void;
}

const DEFAULT_FORM_DATA: ProductFormData = {
  titulo: '',
  descripcion: null,
  precio: '',
  categoria_id: '',
  estado_prenda: 'usado',
  talle: null,
  marca: null,
  estado_publicacion: 'activa',
};

export const useProductoForm = (
  props?: UseProductoFormProps
): UseProductoFormReturn => {
  const [formData, setFormData] = useState<ProductFormData>(
    props?.initialData || DEFAULT_FORM_DATA
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : value,
    }));

    // Limpiar error del campo cuando el usuario empieza a editar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPrice = formatPrice(e.target.value);

    setFormData((prev) => ({
      ...prev,
      precio: formattedPrice,
    }));

    // Limpiar error de precio
    if (errors.precio) {
      setErrors((prev) => ({
        ...prev,
        precio: '',
      }));
    }
  };

  const reset = () => {
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
  };

  return {
    formData,
    errors,
    handleChange,
    handlePriceChange,
    reset,
    setFormData,
  };
};
