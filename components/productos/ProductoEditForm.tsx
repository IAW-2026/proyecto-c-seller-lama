'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ProductoFormFields } from '@/components/productos/ProductoFormFields';
import type { Producto } from '@/types';

interface ProductoEditFormProps {
  producto: Producto;
}

export function ProductoEditForm({ producto }: ProductoEditFormProps) {
  const [formData, setFormData] = useState(producto);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'precio' || name === 'stock' ? parseFloat(value) : value,
    }));
  };

  const handleSave = () => {
    console.log('Datos del formulario:', formData);
    alert('Cambios guardados (mock - sin guardar en base de datos)');
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/productos"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-8 inline-block"
        >
          ← Volver a productos
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-4 shadow-sm">
            <img
              src={formData.imagenes[0]}
              alt={formData.titulo}
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">
              {formData.titulo}
            </h1>

            <ProductoFormFields
              formData={formData}
              onChange={handleChange}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
