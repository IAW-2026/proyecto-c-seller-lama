import { NextResponse, type NextRequest } from 'next/server';
import { jsonError, requireAuthUser } from '@/lib/api-auth';
import {
  type EstadoPrenda,
  type GeneroProducto,
} from '@/types/producto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GEMINI_MODEL = 'gemini-3.1-flash-lite';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const ESTADOS_PRENDA = ['nuevo', 'usado', 'vintage'] as const;
const GENEROS = ['hombre', 'mujer', 'ni\u00f1os'] as const;

type ProductAiRequest = {
  titulo?: unknown;
  descripcion?: unknown;
  precio?: unknown;
  estado_prenda?: unknown;
  talle?: unknown;
  marca?: unknown;
  genero?: unknown;
  categoria_nombre?: unknown;
};

type NormalizedProductAiRequest = {
  titulo: string;
  descripcion: string;
  precio: string;
  estado_prenda: EstadoPrenda;
  talle: string;
  marca: string;
  genero: GeneroProducto;
  categoria_nombre: string;
};

type ProductAiSuggestion = {
  descripcion_mejorada: string;
  titulo_sugerido: string;
  sugerencias: string[];
  advertencias: string[];
  campos_sugeridos: ProductAiFieldSuggestion[];
};

type ProductAiFieldSuggestion = {
  campo: string;
  valor_actual: string;
  valor_sugerido: string;
  motivo: string;
  accion: string;
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
};

const normalizeText = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

const isEstadoPrenda = (value: string): value is EstadoPrenda =>
  ESTADOS_PRENDA.includes(value as EstadoPrenda);

const isGenero = (value: string): value is GeneroProducto =>
  GENEROS.includes(value as GeneroProducto);

const normalizePayload = (
  payload: ProductAiRequest
): { data: NormalizedProductAiRequest | null; error: string | null } => {
  const titulo = normalizeText(payload.titulo);
  const descripcion = normalizeText(payload.descripcion);
  const precio = normalizeText(payload.precio);
  const estadoPrenda = normalizeText(payload.estado_prenda);
  const talle = normalizeText(payload.talle);
  const marca = normalizeText(payload.marca);
  const genero = normalizeText(payload.genero);
  const categoriaNombre = normalizeText(payload.categoria_nombre);

  if (!titulo && !descripcion) {
    return {
      data: null,
      error: 'Carga al menos un titulo o una descripcion para pedir sugerencias.',
    };
  }

  if (!isEstadoPrenda(estadoPrenda)) {
    return { data: null, error: 'El estado de la prenda no es valido.' };
  }

  if (!isGenero(genero)) {
    return { data: null, error: 'El genero no es valido.' };
  }

  return {
    data: {
      titulo,
      descripcion,
      precio,
      estado_prenda: estadoPrenda,
      talle,
      marca,
      genero,
      categoria_nombre: categoriaNombre,
    },
    error: null,
  };
};

const buildPrompt = (data: NormalizedProductAiRequest) => `
Sos un asistente interno de LAMA Seller App para mejorar publicaciones de moda circular.

Objetivo: ayudar a que la publicacion sea clara, honesta y atractiva para compradores.

Datos cargados por el vendedor:
- titulo: ${data.titulo || '(sin cargar)'}
- descripcion: ${data.descripcion || '(sin cargar)'}
- precio: ${data.precio || '(sin cargar)'}
- estado_prenda: ${data.estado_prenda}
- talle: ${data.talle || '(sin cargar)'}
- marca: ${data.marca || '(sin cargar)'}
- genero: ${data.genero}
- categoria_nombre: ${data.categoria_nombre || '(sin cargar)'}

Reglas obligatorias:
- Responde solo JSON valido, sin markdown ni texto adicional.
- No inventes datos que el vendedor no cargo.
- Si falta informacion importante, agregala como sugerencia o advertencia.
- No cambies marca, talle, genero ni estado_prenda si ya fueron dados.
- Revisa individualmente titulo, descripcion, precio, estado_prenda, talle, marca, genero y categoria_nombre.
- Si un campo parece incompleto, ambiguo, demasiado corto o contradictorio, agregalo en campos_sugeridos.
- Para campos_sugeridos usa accion "aplicar" solo cuando el valor_sugerido se puede inferir claramente desde otro campo cargado. Ejemplo: marca "n" y titulo "Campera Nike" permite sugerir marca "Nike".
- Si no hay evidencia suficiente para completar un campo, usa accion "revisar", deja valor_sugerido vacio y explica que informacion falta.
- No propongas cambiar genero ni estado_prenda salvo contradiccion clara entre campos; en ese caso usa accion "revisar".
- No menciones autenticidad, material, textura, medidas, calce, origen, logo, uso previo, defectos, manchas, roturas, envio ni calidad si no aparecen literalmente en los datos cargados.
- No uses frases como "original", "excelente estado", "sin manchas", "sin roturas", "como nuevo" o "alta calidad" salvo que esa informacion este literalmente cargada.
- Si la descripcion actual esta vacia o es pobre, crea una descripcion breve usando solo titulo, marca, talle, genero, categoria, precio y estado_prenda cargados.
- La descripcion mejorada debe sonar profesional y natural, en espanol rioplatense neutro.
- El titulo sugerido debe ser breve, claro y usable como titulo de marketplace.

Formato exacto:
{
  "descripcion_mejorada": "string",
  "titulo_sugerido": "string",
  "sugerencias": ["string"],
  "advertencias": ["string"],
  "campos_sugeridos": [
    {
      "campo": "titulo|descripcion|precio|estado_prenda|talle|marca|genero|categoria_nombre",
      "valor_actual": "string",
      "valor_sugerido": "string",
      "motivo": "string",
      "accion": "aplicar|revisar"
    }
  ]
}
`;

const suggestionSchema = {
  type: 'object',
  properties: {
    descripcion_mejorada: { type: 'string' },
    titulo_sugerido: { type: 'string' },
    sugerencias: {
      type: 'array',
      items: { type: 'string' },
    },
    advertencias: {
      type: 'array',
      items: { type: 'string' },
    },
    campos_sugeridos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          campo: { type: 'string' },
          valor_actual: { type: 'string' },
          valor_sugerido: { type: 'string' },
          motivo: { type: 'string' },
          accion: { type: 'string' },
        },
        required: [
          'campo',
          'valor_actual',
          'valor_sugerido',
          'motivo',
          'accion',
        ],
      },
    },
  },
  required: [
    'descripcion_mejorada',
    'titulo_sugerido',
    'sugerencias',
    'advertencias',
    'campos_sugeridos',
  ],
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const validFieldNames = new Set([
  'titulo',
  'descripcion',
  'precio',
  'estado_prenda',
  'talle',
  'marca',
  'genero',
  'categoria_nombre',
]);

const isFieldSuggestion = (value: unknown): value is ProductAiFieldSuggestion => {
  if (!value || typeof value !== 'object') return false;

  const suggestion = value as Partial<ProductAiFieldSuggestion>;
  return (
    typeof suggestion.campo === 'string' &&
    validFieldNames.has(suggestion.campo) &&
    typeof suggestion.valor_actual === 'string' &&
    typeof suggestion.valor_sugerido === 'string' &&
    typeof suggestion.motivo === 'string' &&
    (suggestion.accion === 'aplicar' || suggestion.accion === 'revisar')
  );
};

const getFieldSuggestions = (value: unknown): ProductAiFieldSuggestion[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(isFieldSuggestion).slice(0, 8);
};

const isValidSuggestion = (value: unknown): value is ProductAiSuggestion => {
  if (!value || typeof value !== 'object') return false;

  const suggestion = value as Partial<ProductAiSuggestion>;
  return (
    typeof suggestion.descripcion_mejorada === 'string' &&
    typeof suggestion.titulo_sugerido === 'string' &&
    isStringArray(suggestion.sugerencias) &&
    isStringArray(suggestion.advertencias)
  );
};

const normalizeSuggestion = (value: unknown): ProductAiSuggestion | null => {
  if (!isValidSuggestion(value)) return null;

  const suggestion = value as ProductAiSuggestion;
  return {
    descripcion_mejorada: suggestion.descripcion_mejorada,
    titulo_sugerido: suggestion.titulo_sugerido,
    sugerencias: suggestion.sugerencias,
    advertencias: suggestion.advertencias,
    campos_sugeridos: getFieldSuggestions(
      (value as Partial<ProductAiSuggestion>).campos_sugeridos
    ),
  };
};

const getGeminiText = (response: GeminiGenerateContentResponse) =>
  response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim() || '';

export async function POST(request: NextRequest) {
  const authResult = await requireAuthUser();

  if (!authResult.ok) {
    return authResult.response;
  }

  const canUseAi =
    authResult.roles.includes('vendedor') ||
    authResult.roles.includes('super_admin');

  if (!canUseAi) {
    return jsonError('No autorizado', 403);
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return jsonError('GEMINI_API_KEY no esta configurada', 500);
  }

  let body: ProductAiRequest;

  try {
    body = (await request.json()) as ProductAiRequest;
  } catch {
    return jsonError('Body JSON invalido', 400);
  }

  const normalized = normalizePayload(body);

  if (!normalized.data) {
    return jsonError(normalized.error || 'Datos invalidos', 400);
  }

  let geminiResponse: Response;

  try {
    geminiResponse = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: buildPrompt(normalized.data) }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          response_mime_type: 'application/json',
          response_json_schema: suggestionSchema,
        },
      }),
    });
  } catch (error) {
    console.error('Error de red al consultar Gemini', error);
    return jsonError('No se pudo conectar con Gemini', 502);
  }

  if (!geminiResponse.ok) {
    const errorBody = await geminiResponse.text().catch(() => '');
    console.error('Gemini devolvio un error', {
      status: geminiResponse.status,
      body: errorBody,
    });
    return jsonError('Gemini no pudo generar sugerencias', 502);
  }

  const geminiJson =
    (await geminiResponse.json()) as GeminiGenerateContentResponse;

  if (geminiJson.promptFeedback?.blockReason) {
    return jsonError('Gemini bloqueo la solicitud por seguridad', 422);
  }

  const text = getGeminiText(geminiJson);

  if (!text) {
    return jsonError('Respuesta invalida de Gemini', 502);
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch (error) {
    console.error('Gemini no devolvio JSON valido', { text, error });
    return jsonError('Respuesta invalida de Gemini', 502);
  }

  const suggestion = normalizeSuggestion(parsed);

  if (!suggestion) {
    console.error('Gemini devolvio una forma inesperada', parsed);
    return jsonError('Respuesta invalida de Gemini', 502);
  }

  return NextResponse.json(suggestion, { status: 200 });
}
