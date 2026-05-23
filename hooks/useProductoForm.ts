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
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

const DEFAULT_FORM_DATA: ProductFormData = {
  titulo: '',
  descripcion: '',
  precio: '',
  categoria_id: '',
  estado_prenda: 'usado',
  talle: '',
  marca: '',
  estado_publicacion: 'activa',
  genero: 'hombre',
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
      [name]: value,
    }));

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

    if (errors.precio) {
      setErrors((prev) => ({
        ...prev,
        precio: '',
      }));
    }
  };

  const reset = () => {
    setFormData(props?.initialData || DEFAULT_FORM_DATA);
    setErrors({});
  };

  return {
    formData,
    errors,
    setErrors,
    handleChange,
    handlePriceChange,
    reset,
    setFormData,
  };
};