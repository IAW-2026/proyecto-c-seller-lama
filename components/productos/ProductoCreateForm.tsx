'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Categoria {
  categoria_producto_id: string;
  nombre: string;
}

interface ProductoCreateFormProps {
  clerkUserId: string;
  categorias: Categoria[];
}

export function ProductoCreateForm({
  clerkUserId,
  categorias,
}: ProductoCreateFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
    estado_prenda: 'usado',
    talle: '',
    marca: '',
    estado_publicacion: 'activa',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const imagenPrincipal = imagePreview;

  const formatPrice = (value: string) => {
    const numericValue = value.replace(/\D/g, '');

    if (!numericValue) {
      return '';
    }

    return Number(numericValue).toLocaleString('es-AR');
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      precio: formatPrice(e.target.value),
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

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
  };

  const handleCreate = async () => {
    setIsSaving(true);

    let imageUrl = '';

    if (selectedImage) {
      const fileExt = selectedImage.name.split('.').pop();

      const fileName = `${clerkUserId}-${Date.now()}.${fileExt}`;

      const filePath = `productos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('productos')
        .upload(filePath, selectedImage);

      if (uploadError) {
        setIsSaving(false);

        console.error('Error al subir imagen:', uploadError);

        alert('Error al subir la imagen');

        return;
      }

      const { data } = supabase.storage
        .from('productos')
        .getPublicUrl(filePath);

      imageUrl = data.publicUrl;
    }

    const imagenesArray = imageUrl ? [imageUrl] : [];

    const precioNumerico = Number(
      formData.precio.replace(/\./g, '')
    );

    const { error } = await supabase.from('producto').insert({
      clerk_user_id: clerkUserId,
      titulo: formData.titulo,
      descripcion: formData.descripcion || null,
      precio: precioNumerico,
      imagenes: imagenesArray,
      categoria_id: formData.categoria_id,
      estado_prenda: formData.estado_prenda,
      talle: formData.talle || null,
      marca: formData.marca || null,
      estado_publicacion: formData.estado_publicacion,
    });

    setIsSaving(false);

    if (error) {
      console.error('Error al crear producto:', error);

      alert('Error al crear el producto');

      return;
    }

    router.push('/productos');
    router.refresh();
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
          {/* Imagen preview */}
          <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] overflow-hidden p-4 shadow-sm">
            {imagenPrincipal ? (
              <img
                src={imagenPrincipal}
                alt="Vista previa del producto"
                className="w-full h-auto rounded-lg object-cover"
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
              Nuevo producto
            </h1>

            <div className="space-y-6">
              {/* Selector imagen */}
              <div>
                <label className="block text-sm font-medium text-[#37413d] mb-2">
                  Imagen del producto
                </label>

                <label className="block cursor-pointer rounded-xl border-2 border-dashed border-[#8fa18d] bg-[#f6f1e7] p-6 text-center hover:bg-[#e8dfcf] transition duration-200">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-[#8fa18d]/10 flex items-center justify-center text-2xl">
                      📷
                    </div>

                    <span className="text-[#37413d] font-medium">
                      {selectedImage
                        ? 'Cambiar imagen'
                        : 'Seleccionar imagen'}
                    </span>

                    <span className="text-sm text-[#6f7f6d]">
                      {selectedImage
                        ? selectedImage.name
                        : 'JPG, PNG o WEBP'}
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-[#37413d] mb-2">
                  Título
                </label>

                <input
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-[#37413d] mb-2">
                  Descripción
                </label>

                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition resize-none"
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-[#37413d] mb-2">
                  Categoría
                </label>

                <select
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
                >
                  <option value="">Seleccionar categoría</option>

                  {categorias.map((categoria) => (
                    <option
                      key={categoria.categoria_producto_id}
                      value={categoria.categoria_producto_id}
                    >
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-[#37413d] mb-2">
                  Precio
                </label>

                <input
                  name="precio"
                  type="text"
                  inputMode="numeric"
                  value={formData.precio}
                  onChange={handlePriceChange}
                  placeholder="10.000"
                  className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
                />
              </div>

              {/* Marca y talle */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#37413d] mb-2">
                    Marca
                  </label>

                  <input
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#37413d] mb-2">
                    Talle
                  </label>

                  <input
                    name="talle"
                    value={formData.talle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
                  />
                </div>
              </div>

              {/* Estado prenda */}
              <div>
                <label className="block text-sm font-medium text-[#37413d] mb-2">
                  Estado de la prenda
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

              {/* Estado publicación */}
              <div>
                <label className="block text-sm font-medium text-[#37413d] mb-2">
                  Estado de publicación
                </label>

                <select
                  name="estado_publicacion"
                  value={formData.estado_publicacion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white text-[#37413d] border border-[#d8cfbd] rounded-lg focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/20 outline-none transition"
                >
                  <option value="activa">Activa</option>
                  <option value="inactiva">Inactiva</option>
                  <option value="vendida">Vendida</option>
                </select>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isSaving}
                  className="flex-1 bg-[#8fa18d] hover:bg-[#7a8c78] disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-sm"
                >
                  {isSaving ? 'Creando...' : 'Crear producto'}
                </button>

                <Link
                  href="/productos"
                  className="flex-1 bg-[#f6f1e7] hover:bg-[#e8dfcf] text-[#37413d] font-semibold py-3 px-4 rounded-lg border border-[#d8cfbd] transition duration-200 text-center"
                >
                  Cancelar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}