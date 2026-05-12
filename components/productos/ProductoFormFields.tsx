'use client';

import Link from 'next/link';
import type { ChangeEvent } from 'react';
import type { Producto } from '@/types';

interface ProductoFormFieldsProps {
  formData: Producto;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSave: () => void;
}

export function ProductoFormFields({
  formData,
  onChange,
  onSave,
}: ProductoFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Título
        </label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={onChange}
          className="w-full px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={onChange}
          rows={3}
          className="w-full px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Precio
          </label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={onChange}
            className="w-full px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={onChange}
            className="w-full px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Marca
        </label>
        <input
          type="text"
          name="marca"
          value={formData.marca}
          onChange={onChange}
          className="w-full px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Talle
          </label>
          <input
            type="text"
            name="talle"
            value={formData.talle}
            onChange={onChange}
            className="w-full px-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Estado de Prenda
          </label>
          <select
            name="estado_prenda"
            value={formData.estado_prenda}
            onChange={onChange}
            className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
          >
            <option value="nuevo">Nuevo</option>
            <option value="usado">Usado</option>
            <option value="vintage">Vintage</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Estado de Publicación
        </label>
        <select
          name="estado_publicacion"
          value={formData.estado_publicacion}
          onChange={onChange}
          className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
        >
          <option value="activa">Activa</option>
          <option value="inactiva">Inactiva</option>
          <option value="vendida">Vendida</option>
        </select>
      </div>

      <div className="flex gap-3 pt-6">
        <button
          onClick={onSave}
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
  );
}
