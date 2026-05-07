'use client';

import Link from 'next/link';
import type { Producto } from '@/types';

interface ProductoCardProps {
  producto: Producto & {
    categoria_nombre: string;
    rating: number;
    reviews: number;
  };
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm font-medium text-slate-900">{rating}</span>
    </div>
  );
}

export function ProductoCard({ producto }: ProductoCardProps) {
  const imagenPrincipal = producto.imagenes[0] || '';
  const isVendido = producto.estado_publicacion === 'vendida';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://picsum.photos/400/400';
  };

  return (
    <Link href={`/productos/${producto.producto_id}`}>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
        {/* Imagen */}
        <div className="relative bg-slate-100 aspect-square overflow-hidden">
          {imagenPrincipal ? (
            <img
              src={imagenPrincipal}
              alt={producto.titulo}
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              Sin imagen
            </div>
          )}
          {isVendido && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">VENDIDO</span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          {/* Categoría */}
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {producto.categoria_nombre}
          </p>

          {/* Título */}
          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mt-1 mb-3">
            {producto.titulo}
          </h3>

          {/* Rating */}
          <div className="mb-3">
            <RatingStars rating={producto.rating} />
            <p className="text-xs text-slate-500 mt-1">{producto.reviews} reseñas</p>
          </div>

          {/* Precio */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-lg font-bold text-slate-900">
              ${producto.precio.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
