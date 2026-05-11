'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Producto } from '@/types';

interface ProductoEditFormProps {
  producto: Producto;
}


export function ProductoEditForm({ producto }: ProductoEditFormProps) {
  const [formData, setFormData] = useState(producto);

  const imagenPrincipal = formData.imagenes?.[0] || '';

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: Producto) => ({
      ...prev,
      [name]:
        name === 'precio' ? value === '' ? 0 : parseFloat(value) : value,
    }));
  };
 
  const handleSave = () => {
    console.log('Datos del formulario:', formData);
    alert('Cambios guardados (mock - sin guardar en base de datos)');
  };

  return (
    <main className="min-h-screen bg-[#f6f1e7] p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/productos"
          className="text-[#6f7f6d] hover:text-[#37413d] text-sm font-medium mb-8 inline-block"
        >
          ← Volver a productos
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen */}
          <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] overflow-hidden p-4 shadow-sm">            
            {imagenPrincipal ? (
              <img
                src={imagenPrincipal}
                alt={`Imagen de ${formData.titulo}`}
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="aspect-square flex items-center justify-center text-[#6f7f6d] bg-[#f6f1e7] rounded-lg">
                Sin imagen
              </div>
            )}
          </div>

          {/* Formulario */}
          <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-[#37413d] mb-8">
              {formData.titulo}
            </h1>

            <div className="space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white text-[#37413d] placeholder:text-[#6f7f6d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-white text-[#37413d] placeholder:text-[#6f7f6d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition resize-none"
                />
              </div>

              {/* Precio */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Precio
                  </label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white text-[#37413d] placeholder:text-[#6f7f6d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
                  />
                </div>
              </div>

              {/* Marca */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Marca
                </label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white text-[#37413d] placeholder:text-[#6f7f6d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"/>
              </div>

              {/* Talle */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Talle
                  </label>
                  <input
                    type="text"
                    name="talle"
                    value={formData.talle || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white text-[#37413d] placeholder:text-[#6f7f6d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
                  />
                </div>

                {/* Estado de Prenda */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado de Prenda
                  </label>
                  <select
                    name="estado_prenda"
                    value={formData.estado_prenda}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
                  >
                    <option value="nuevo">Nuevo</option>
                    <option value="usado">Usado</option>
                    <option value="vintage">Vintage</option>
                  </select>
                </div>
              </div>

              {/* Estado de Publicación */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado de Publicación
                </label>
                <select
                  name="estado_publicacion"
                  value={formData.estado_publicacion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition">
                  <option value="activa">Activa</option>
                  <option value="inactiva">Inactiva</option>
                  <option value="vendida">Vendida</option>
                </select>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-[#8fa18d] hover:bg-[#7a8c78] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-sm">
                  Guardar cambios
                </button>
                <Link
                  href="/productos"
                  className="flex-1 bg-[#f6f1e7] hover:bg-[#e8dfcf] text-[#37413d] font-semibold py-3 px-4 rounded-lg border border-[#d8cfbd] transition duration-200 text-center">
                  Volver
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
