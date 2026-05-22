'use client';

import type { ProductFormData } from '@/types/producto';

interface Categoria {
  categoria_producto_id: string;
  nombre: string;
}

interface ProductFormFieldsProps {
  formData: ProductFormData;
  categorias?: Categoria[];
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string>;
  onCreateCategory?: () => void;
  disabled?: boolean;
}

const CREATE_CATEGORY_VALUE = '__crear_categoria__';

function FormField({
  label,
  error,
  required = false,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#37413d] mb-2">
        {label}
        {required && <span className="text-[#d17d6f] ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-[#d17d6f] mt-1">{error}</p>}
    </div>
  );
}

export function ProductFormFields({
  formData,
  categorias,
  onInputChange,
  onPriceChange,
  errors = {},
  onCreateCategory,
  disabled = false,
}: ProductFormFieldsProps) {
  const handleCategoriaChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (event.target.value === CREATE_CATEGORY_VALUE) {
      onCreateCategory?.();
      return;
    }

    onInputChange(event);
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <FormField label="Título" error={errors.titulo} required>
        <input
          name="titulo"
          value={formData.titulo}
          onChange={onInputChange}
          placeholder="Ej: Remera Nike azul talle M"
          disabled={disabled}
          className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
        />
      </FormField>

      {/* Descripción */}
      <FormField label="Descripción">
        <textarea
          name="descripcion"
          value={formData.descripcion || ''}
          onChange={onInputChange}
          rows={3}
          placeholder="Ej: Remera en buen estado, sin manchas..."
          disabled={disabled}
          className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition resize-none"
        />
      </FormField>

      {/* Categoría */}
      <FormField label="Categoría" error={errors.categoria_id} required>
        <select
          name="categoria_id"
          value={formData.categoria_id}
          onChange={handleCategoriaChange}
          disabled={disabled}
          className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
        >
          <option value="">Seleccionar categoría</option>
          {categorias?.length ? (
            categorias.map((categoria) => (
              <option
                key={categoria.categoria_producto_id}
                value={categoria.categoria_producto_id}
              >
                {categoria.nombre}
              </option>
            ))
          ) : (
            <option disabled>Cargando categorías...</option>
          )}
          {onCreateCategory && (
            <option value={CREATE_CATEGORY_VALUE}>
              Crear nueva categoria
            </option>
          )}
        </select>
      </FormField>

      {/* Precio */}
      <FormField label="Precio" error={errors.precio} required>
        <div className="relative">
          <input
            name="precio"
            type="text"
            inputMode="numeric"
            value={formData.precio}
            onChange={onPriceChange}
            placeholder="10.000"
            disabled={disabled}
            className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6f7f6d] text-sm pointer-events-none">
            ARS
          </span>
        </div>
      </FormField>

      {/* Marca y talle */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Marca">
          <input
            name="marca"
            value={formData.marca || ''}
            onChange={onInputChange}
            placeholder="Ej: Nike"
            disabled={disabled}
            className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
          />
        </FormField>

        <FormField label="Talle">
          <input
            name="talle"
            value={formData.talle || ''}
            onChange={onInputChange}
            placeholder="Ej: M, 10, XL"
            disabled={disabled}
            className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
          />
        </FormField>
      </div>

      {/* Estado prenda */}
      <FormField label="Estado de la prenda">
        <select
          name="estado_prenda"
          value={formData.estado_prenda}
          onChange={onInputChange}
          disabled={disabled}
          className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
        >
          <option value="nuevo">Nuevo</option>
          <option value="usado">Usado</option>
          <option value="vintage">Vintage</option>
        </select>
      </FormField>

      {/* Estado publicación */}
      <FormField label="Estado de publicación">
        <select
          name="estado_publicacion"
          value={formData.estado_publicacion}
          onChange={onInputChange}
          disabled={disabled}
          className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
        >
          <option value="activa">Activa</option>
          <option value="inactiva">Inactiva</option>
          <option value="vendida">Vendida</option>
        </select>
      </FormField>
    </div>
  );
}
