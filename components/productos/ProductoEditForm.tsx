'use client';

import Link from 'next/link';
import { useState } from 'react';

interface ProductoEditFormProps {
  producto: any;
}

export function ProductoEditForm({ producto }: ProductoEditFormProps) {
  const [formData, setFormData] = useState(producto);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
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
                  className="w-full px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition resize-none"
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
                    className="w-full px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
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
                  value={formData.marca}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                />
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
                    value={formData.talle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
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
                    className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
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
                  className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                >
                  <option value="activa">Activa</option>
                  <option value="inactiva">Inactiva</option>
                  <option value="vendida">Vendida</option>
                </select>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-sm"
                >
                  Guardar cambios
                </button>
                <Link
                  href="/productos"
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-900 font-semibold py-3 px-4 rounded-lg border border-slate-300 transition duration-200 text-center"
                >
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
