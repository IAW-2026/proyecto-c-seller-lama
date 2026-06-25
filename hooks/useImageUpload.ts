'use client';

import { useState, useEffect } from 'react';

interface UseImageUploadReturn {
  selectedImages: File[];
  imagePreviews: string[];
  handleImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  removeAllImages: () => void;
  imagenPrincipal: string;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Limpiar URLs de objeto cuando se desmonta el componente
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setSelectedImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Resetear el input para permitir seleccionar el mismo archivo de nuevo
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));

    // Revocar la URL del objeto
    URL.revokeObjectURL(imagePreviews[index]);

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAllImages = () => {
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setSelectedImages([]);
    setImagePreviews([]);
  };

  const imagenPrincipal = imagePreviews[0] || '';

  return {
    selectedImages,
    imagePreviews,
    handleImagesChange,
    removeImage,
    removeAllImages,
    imagenPrincipal,
  };
};
