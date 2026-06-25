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
      <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-[#d8cfbd]/70 overflow-hidden shadow-[0_2px_12px_rgba(55,65,61,0.06)] hover:shadow-[0_12px_32px_rgba(55,65,61,0.14)] hover:-translate-y-1 hover:border-[#8fa18d]/40 transition-all duration-400 ease-out cursor-pointer h-full">
        {/* Image */}
        <div className="relative bg-gradient-to-br from-[#f6f1e7] to-[#ede6d8] aspect-[4/5] overflow-hidden">
          {imagenPrincipal ? (
            <img
              src={imagenPrincipal}
              alt={producto.titulo}
              onError={handleImageError}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#b4b0a6] bg-gradient-to-br from-[#f6f1e7] to-[#ede6d8]">
              <svg className="w-12 h-12 mb-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-xs font-medium tracking-wide text-[#a09a8e]">Sin imagen</span>
            </div>
          )}

          {/* Category label on image */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/80 backdrop-blur-md text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6f7f6d] border border-white/40 shadow-sm">
              {producto.categoria_nombre}
            </span>
          </div>

          {/* Status badge on image */}
          <div className="absolute top-3 right-3">
            <StatusBadge status={producto.estado_publicacion} />
          </div>

          {/* Sold overlay — premium frosted glass effect */}
          {isVendido && (
            <div className="absolute inset-0 bg-[#37413d]/40 backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-5 py-2.5 shadow-lg">
                <span className="text-white font-bold text-sm uppercase tracking-[0.25em]">Vendido</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-5">
          {/* Title */}
          <h3 className="text-sm md:text-[15px] font-bold text-[#37413d] line-clamp-2 mb-3 leading-snug group-hover:text-[#5a6d58] transition-colors duration-300">
            {producto.titulo}
          </h3>

          {/* Details — compact pill layout */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {producto.marca && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f6f1e7]/80 text-[11px] font-medium text-[#6f7f6d]">
                <svg className="w-3 h-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                {producto.marca}
              </span>
            )}
            {producto.talle && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f6f1e7]/80 text-[11px] font-medium text-[#6f7f6d]">
                Talle {producto.talle}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f6f1e7]/80 text-[11px] font-medium text-[#6f7f6d] capitalize">
              {producto.estado_prenda}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f6f1e7]/80 text-[11px] font-medium text-[#6f7f6d] capitalize">
              {producto.genero}
            </span>
          </div>

          {/* Price + action */}
          <div className="flex items-center justify-between pt-3 border-t border-[#d8cfbd]/50">
            <p className="text-lg md:text-xl font-bold text-[#37413d]">
              ${Number(producto.precio).toLocaleString('es-AR')}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8fa18d] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Ver detalle
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
