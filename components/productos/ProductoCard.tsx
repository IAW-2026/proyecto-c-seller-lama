'use client';

import Link from 'next/link';
import type { Producto } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface ProductoCardProps {
  producto: Producto & {
    categoria_nombre: string;
  };
}

export function ProductoCard({ producto }: ProductoCardProps) {
  const imagenPrincipal = (producto.imagenes && producto.imagenes[0]) || '';
  const isVendido = producto.estado_publicacion === 'vendida';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://picsum.photos/400/400';
  };

  return (
    <Link href={`/productos/${producto.producto_id}`}>
      <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-[#8fa18d] transition-all duration-300 cursor-pointer h-full">        
        {/* Imagen */}
        <div className="relative bg-[#f6f1e7] aspect-square overflow-hidden">          
          {imagenPrincipal ? (
            <img
              src={imagenPrincipal}
              alt={producto.titulo}
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#6f7f6d] bg-[#f6f1e7]">
              <span className="text-sm font-medium">Sin imagen</span>
              <span className="text-xs mt-1">Producto no disponible</span>
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
          {/* Estado y Categoría */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-[#6f7f6d] uppercase tracking-wide">              
              {producto.categoria_nombre}
            </p>
            <StatusBadge status={producto.estado_publicacion} />
          </div>

          {/* Título */}
          <h3 className="text-sm font-bold text-[#37413d] line-clamp-2 mt-1 mb-3">            
            {producto.titulo}
          </h3>

          {/* Detalles adicionales */}
          <div className="space-y-1 mb-3">
            <p className="text-sm text-slate-600">
              Marca: <span className="font-medium">{producto.marca}</span>
            </p>

            <p className="text-sm text-slate-600">
              Talle: <span className="font-medium">{producto.talle}</span>
            </p>

            <p className="text-sm text-slate-600 capitalize">
              Estado: <span className="font-medium">{producto.estado_prenda}</span>
            </p>
          </div>

          {/* Precio */}
          <div className="pt-3 border-t border-[#d8cfbd]">
            <p className="text-lg font-bold text-[#37413d]">
              ${Number(producto.precio).toLocaleString('es-AR')}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
