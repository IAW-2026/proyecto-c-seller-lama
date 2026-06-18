'use client';

import { useState } from 'react';
import type { ProductFormData } from '@/types/producto';

type ProductAiSuggestion = {
  descripcion_mejorada: string;
  titulo_sugerido: string;
  sugerencias: string[];
  advertencias: string[];
  campos_sugeridos?: ProductAiFieldSuggestion[];
};

type ProductAiField =
  | 'titulo'
  | 'descripcion'
  | 'precio'
  | 'estado_prenda'
  | 'talle'
  | 'marca'
  | 'genero'
  | 'categoria_nombre';

type ProductAiApplicableField = 'precio' | 'talle' | 'marca';

type ProductAiFieldSuggestion = {
  campo: ProductAiField;
  valor_actual: string;
  valor_sugerido: string;
  motivo: string;
  accion: 'aplicar' | 'revisar';
};

interface ProductAiAssistantProps {
  formData: ProductFormData;
  categoriaNombre?: string;
  disabled?: boolean;
  onApplyTitle: (title: string) => void;
  onApplyDescription: (description: string) => void;
  onApplyField?: (field: ProductAiApplicableField, value: string) => void;
}

const fieldLabels: Record<ProductAiField, string> = {
  titulo: 'Titulo',
  descripcion: 'Descripcion',
  precio: 'Precio',
  estado_prenda: 'Estado de la prenda',
  talle: 'Talle',
  marca: 'Marca',
  genero: 'Genero',
  categoria_nombre: 'Categoria',
};

const getErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error || 'No se pudieron generar sugerencias.';
  } catch {
    return 'No se pudieron generar sugerencias.';
  }
};

export function ProductAiAssistant({
  formData,
  categoriaNombre,
  disabled = false,
  onApplyTitle,
  onApplyDescription,
  onApplyField,
}: ProductAiAssistantProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<ProductAiSuggestion | null>(null);

  const requestSuggestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/producto-sugerencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          precio: formData.precio,
          estado_prenda: formData.estado_prenda,
          talle: formData.talle,
          marca: formData.marca,
          genero: formData.genero,
          categoria_nombre: categoriaNombre,
        }),
      });

      if (!response.ok) {
        setError(await getErrorMessage(response));
        return;
      }

      const data = (await response.json()) as ProductAiSuggestion;
      setSuggestion(data);
    } catch {
      setError('Error de red al consultar la IA.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFieldSuggestion = (fieldSuggestion: ProductAiFieldSuggestion) => {
    const value = fieldSuggestion.valor_sugerido.trim();

    if (!value) return;

    if (fieldSuggestion.campo === 'titulo') {
      onApplyTitle(value);
      return;
    }

    if (fieldSuggestion.campo === 'descripcion') {
      onApplyDescription(value);
      return;
    }

    if (
      fieldSuggestion.campo === 'marca' ||
      fieldSuggestion.campo === 'talle' ||
      fieldSuggestion.campo === 'precio'
    ) {
      onApplyField?.(fieldSuggestion.campo, value);
    }
  };

  const canApplyField = (fieldSuggestion: ProductAiFieldSuggestion) => {
    if (fieldSuggestion.accion !== 'aplicar') return false;
    if (!fieldSuggestion.valor_sugerido.trim()) return false;

    return (
      fieldSuggestion.campo === 'titulo' ||
      fieldSuggestion.campo === 'descripcion' ||
      fieldSuggestion.campo === 'marca' ||
      fieldSuggestion.campo === 'talle' ||
      fieldSuggestion.campo === 'precio'
    );
  };

  return (
    <section
      className="rounded-xl border border-[#d8cfbd] bg-[#f6f1e7]/80 p-5 shadow-sm"
      aria-live="polite"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#8fa18d]">
            Asistente IA
          </p>
          <h2 className="mt-1 text-base font-bold text-[#37413d]">
            Publicacion de producto
          </h2>
        </div>

        <button
          type="button"
          onClick={requestSuggestions}
          disabled={disabled || isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#8fa18d] bg-[#8fa18d] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7e937c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9L12 3z" />
            <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
          </svg>
          {isLoading ? 'Mejorando...' : 'Mejorar con IA'}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-[#d17d6f]/30 bg-[#d17d6f]/10 px-4 py-3 text-sm font-medium text-[#8f463d]">
          {error}
        </div>
      )}

      {suggestion && (
        <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-[#d8cfbd] bg-white/70 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8fa18d]">
                  Titulo sugerido
                </p>
                <p className="mt-2 text-sm font-semibold text-[#37413d]">
                  {suggestion.titulo_sugerido}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onApplyTitle(suggestion.titulo_sugerido)}
                className="shrink-0 rounded-lg border border-[#d8cfbd] bg-[#f6f1e7] px-3 py-2 text-xs font-bold text-[#37413d] transition hover:border-[#8fa18d] hover:bg-[#ede6d8]"
              >
                Aplicar titulo
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-[#d8cfbd] bg-white/70 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8fa18d]">
                  Descripcion mejorada
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#37413d]">
                  {suggestion.descripcion_mejorada}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onApplyDescription(suggestion.descripcion_mejorada)
                }
                className="shrink-0 rounded-lg border border-[#d8cfbd] bg-[#f6f1e7] px-3 py-2 text-xs font-bold text-[#37413d] transition hover:border-[#8fa18d] hover:bg-[#ede6d8]"
              >
                Aplicar descripcion
              </button>
            </div>
          </div>

          {suggestion.campos_sugeridos &&
            suggestion.campos_sugeridos.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8fa18d]">
                  Campos a revisar
                </p>
                <div className="mt-2 space-y-3">
                  {suggestion.campos_sugeridos.map((fieldSuggestion, index) => (
                    <div
                      key={`${fieldSuggestion.campo}-${index}`}
                      className="rounded-lg border border-[#d8cfbd] bg-white/60 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8fa18d]">
                            {fieldLabels[fieldSuggestion.campo]}
                          </p>
                          {fieldSuggestion.valor_actual && (
                            <p className="mt-2 text-xs text-[#6f7f6d]">
                              Actual: {fieldSuggestion.valor_actual}
                            </p>
                          )}
                          {fieldSuggestion.valor_sugerido && (
                            <p className="mt-1 text-sm font-semibold text-[#37413d]">
                              Sugerido: {fieldSuggestion.valor_sugerido}
                            </p>
                          )}
                          <p className="mt-2 text-sm leading-5 text-[#5f6f60]">
                            {fieldSuggestion.motivo}
                          </p>
                        </div>

                        {canApplyField(fieldSuggestion) && (
                          <button
                            type="button"
                            onClick={() => applyFieldSuggestion(fieldSuggestion)}
                            className="shrink-0 rounded-lg border border-[#d8cfbd] bg-[#f6f1e7] px-3 py-2 text-xs font-bold text-[#37413d] transition hover:border-[#8fa18d] hover:bg-[#ede6d8]"
                          >
                            Aplicar campo
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {suggestion.sugerencias.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8fa18d]">
                Sugerencias
              </p>
              <ul className="mt-2 space-y-2">
                {suggestion.sugerencias.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="rounded-lg border border-[#d8cfbd]/70 bg-white/50 px-3 py-2 text-sm text-[#5f6f60]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestion.advertencias.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#c49a3c]">
                Advertencias
              </p>
              <ul className="mt-2 space-y-2">
                {suggestion.advertencias.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="rounded-lg border border-[#c49a3c]/30 bg-[#c49a3c]/10 px-3 py-2 text-sm text-[#6f5a29]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
