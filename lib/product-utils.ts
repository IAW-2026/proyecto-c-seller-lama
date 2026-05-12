/**
 * Utilidades para productos
 * Funciones puras para formateo, parsing y validaciones
 */

/**
 * Formatea un valor numérico a formato moneda argentino (ej: 10.000)
 */
export const formatPrice = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');

  if (!numericValue) {
    return '';
  }

  return Number(numericValue).toLocaleString('es-AR');
};

/**
 * Convierte un precio formateado de vuelta a número
 */
export const parsePrice = (formattedPrice: string): number => {
  const cleanPrice = formattedPrice.replace(/\./g, '');
  return Number(cleanPrice) || 0;
};

/**
 * Validaciones de formulario
 */
export const validateProductForm = (data: {
  titulo: string;
  precio: string;
  categoria_id: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.titulo.trim()) {
    errors.titulo = 'El título es requerido';
  }

  const numericPrice = parsePrice(data.precio);
  if (numericPrice <= 0) {
    errors.precio = 'El precio debe ser mayor a 0';
  }

  if (!data.categoria_id) {
    errors.categoria_id = 'La categoría es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Genera nombre de archivo único para imagen
 */
export const generateImageFileName = (
  userId: string,
  originalFileName: string
): string => {
  const fileExt = originalFileName.split('.').pop();
  return `${userId}-${Date.now()}.${fileExt}`;
};
