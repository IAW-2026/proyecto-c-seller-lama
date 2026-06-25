import 'server-only';

import { supabase } from '@/lib/supabase';
import { parseAdminFilters } from '@/lib/admin/admin-query';
import type { Orden, Vendedor } from '@/types';
import type {
  AdminSearchParams,
  ProductoConVendedor,
} from '@/types/admin-filters';

const MAX_EXPORT_ROWS = 5000;
const TIME_ZONE = 'America/Argentina/Buenos_Aires';
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const PAGE_MARGIN = 42;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;

type ReportFormat = 'csv' | 'pdf';

type OrdenItemReport = {
  orden_item_id: string;
  orden_id: string;
  producto_id: string;
  precio_unitario: number;
  fecha_creacion: string;
  producto: {
    producto_id: string;
    titulo: string | null;
    clerk_user_id: string | null;
  } | null;
};

type MetricCard = {
  label: string;
  value: string;
  hint: string;
};

type TemporalRow = {
  key: string;
  label: string;
  ingresos: number;
  ordenes: number;
  envios: number;
  entregados: number;
};

type FunnelRow = {
  label: string;
  count: number;
  percent: number | null;
  shareOfBase: number;
};

type RankedRow = {
  label: string;
  units: number;
  revenue: number;
};

export type AdminReportData = {
  generatedAt: Date;
  scopeLabel: string;
  dateRangeLabel: string;
  vendedores: Vendedor[];
  productos: ProductoConVendedor[];
  ordenes: Orden[];
  ordenItems: OrdenItemReport[];
  metrics: {
    ingresosAprobados: number;
    transaccionesAprobadas: number;
    ticketPromedio: number;
    conversion: number;
    compradoresActivos: number;
    vendedoresTotal: number;
    vendedoresActivos: number;
    vendedoresInactivos: number;
    productosTotal: number;
    productosActivos: number;
    productosVendidos: number;
    ordenesTotal: number;
    ordenesCompletadas: number;
    ordenesPendientes: number;
    ordenesEntregadas: number;
    entregaPromedioDias: number;
    pagoPromedioHoras: number;
  };
  temporal: TemporalRow[];
  funnel: FunnelRow[];
  topProductos: RankedRow[];
  topVendedores: RankedRow[];
};

type PdfColor = [number, number, number];

const COLORS = {
  sage: rgb('#8fa18d'),
  sageDark: rgb('#6f7f6d'),
  sageDeep: rgb('#72816f'),
  ink: rgb('#24343a'),
  muted: rgb('#5e6b68'),
  cream: rgb('#f6f1e7'),
  panel: rgb('#ede6d8'),
  line: rgb('#d8cfbd'),
  white: rgb('#ffffff'),
};

function rgb(hex: string): PdfColor {
  const value = hex.replace('#', '');
  const red = Number.parseInt(value.slice(0, 2), 16) / 255;
  const green = Number.parseInt(value.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(value.slice(4, 6), 16) / 255;
  return [red, green, blue];
}

const toAdminSearchParams = (
  searchParams: URLSearchParams
): AdminSearchParams => ({
  vendedores_search: searchParams.get('vendedores_search') || undefined,
  vendedores_activo: searchParams.get('vendedores_activo') || undefined,
  vendedores_page: searchParams.get('vendedores_page') || undefined,
  productos_search: searchParams.get('productos_search') || undefined,
  productos_vendedor: searchParams.get('productos_vendedor') || undefined,
  productos_estado_publicacion:
    searchParams.get('productos_estado_publicacion') || undefined,
  productos_page: searchParams.get('productos_page') || undefined,
  ordenes_search: searchParams.get('ordenes_search') || undefined,
  ordenes_estado_pago: searchParams.get('ordenes_estado_pago') || undefined,
  ordenes_estado_envio: searchParams.get('ordenes_estado_envio') || undefined,
  ordenes_estado_general:
    searchParams.get('ordenes_estado_general') || undefined,
  ordenes_page: searchParams.get('ordenes_page') || undefined,
});

export const parseReportFormat = (value: string | null): ReportFormat =>
  value === 'csv' ? 'csv' : 'pdf';

export const getAdminReportSearchParams = (searchParams: URLSearchParams) =>
  toAdminSearchParams(searchParams);

const applyRange = <T>(query: T): T & { range: (from: number, to: number) => T } =>
  query as T & { range: (from: number, to: number) => T };

const getFilteredVendedores = async (searchParams?: AdminSearchParams) => {
  const filters = parseAdminFilters(searchParams);
  let query = supabase
    .from('vendedor')
    .select('*')
    .order('fecha_creacion', { ascending: false });

  if (filters.vendedores.search) {
    const searchTerm = `%${filters.vendedores.search}%`;
    query = query.or(
      `nombre_vendedor.ilike.${searchTerm},email.ilike.${searchTerm}`
    );
  }

  if (filters.vendedores.activo) {
    query = query.eq(
      'activo',
      filters.vendedores.activo === 'activa'
    );
  }

  const { data, error } = await applyRange(query).range(
    0,
    MAX_EXPORT_ROWS - 1
  );

  if (error) throw error;
  return (data || []) as Vendedor[];
};

const getFilteredProductos = async (searchParams?: AdminSearchParams) => {
  const filters = parseAdminFilters(searchParams);
  let query = supabase
    .from('producto')
    .select(
      `
      *,
      vendedor (
        nombre_vendedor
      )
    `
    )
    .order('fecha_creacion', { ascending: false });

  if (filters.productos.search) {
    const searchTerm = `%${filters.productos.search}%`;
    query = query.ilike('titulo', searchTerm);
  }

  if (filters.productos.estado_publicacion) {
    query = query.eq(
      'estado_publicacion',
      filters.productos.estado_publicacion
    );
  }

  if (filters.productos.vendedor) {
    query = query.eq('clerk_user_id', filters.productos.vendedor);
  }

  const { data, error } = await applyRange(query).range(
    0,
    MAX_EXPORT_ROWS - 1
  );

  if (error) throw error;
  return (data || []) as ProductoConVendedor[];
};

const getFilteredOrdenes = async (searchParams?: AdminSearchParams) => {
  const filters = parseAdminFilters(searchParams);
  let query = supabase
    .from('orden')
    .select('*')
    .order('fecha_creacion', { ascending: false });

  if (filters.ordenes.search) {
    const searchTerm = `%${filters.ordenes.search}%`;
    query = query.ilike('nro_orden', searchTerm);
  }

  if (filters.ordenes.estado_pago) {
    query = query.eq('estado_pago', filters.ordenes.estado_pago);
  }

  if (filters.ordenes.estado_envio) {
    query = query.eq('estado_envio', filters.ordenes.estado_envio);
  }

  if (filters.ordenes.estado_general) {
    query = query.eq('estado_general', filters.ordenes.estado_general);
  }

  const { data, error } = await applyRange(query).range(
    0,
    MAX_EXPORT_ROWS - 1
  );

  if (error) throw error;
  return (data || []) as Orden[];
};

const getOrdenItems = async (ordenIds: string[]) => {
  if (ordenIds.length === 0) return [];

  const { data, error } = await supabase
    .from('orden_item')
    .select(
      `
      orden_item_id,
      orden_id,
      producto_id,
      precio_unitario,
      fecha_creacion,
      producto:fk_orden_item_producto (
        producto_id,
        titulo,
        clerk_user_id
      )
    `
    )
    .in('orden_id', ordenIds)
    .range(0, MAX_EXPORT_ROWS - 1);

  if (error) throw error;

  return (data || []).map((item) => ({
    ...item,
    producto: Array.isArray(item.producto) ? item.producto[0] : item.producto,
  })) as OrdenItemReport[];
};

const getVendedoresByIds = async (vendedorIds: string[]) => {
  if (vendedorIds.length === 0) return new Map<string, Vendedor>();

  const { data, error } = await supabase
    .from('vendedor')
    .select('*')
    .in('clerk_user_id', vendedorIds);

  if (error) throw error;

  return new Map(
    ((data || []) as Vendedor[]).map((vendedor) => [
      vendedor.clerk_user_id,
      vendedor,
    ])
  );
};

const isCanceledOrder = (orden: Orden) =>
  orden.estado_general === 'cancelada' || orden.estado_envio === 'cancelado';

const isApprovedOrder = (orden: Orden) =>
  orden.estado_pago === 'aprobado' && !isCanceledOrder(orden);

const isCompletedOrder = (orden: Orden) =>
  orden.estado_general === 'completada' ||
  orden.estado_general === 'liquidada';

const isShippedOrder = (orden: Orden) =>
  orden.estado_envio === 'despachado' || orden.estado_envio === 'entregado';

const daysBetween = (from: string, to: string) => {
  const fromDate = new Date(from).getTime();
  const toDate = new Date(to).getTime();
  if (!Number.isFinite(fromDate) || !Number.isFinite(toDate)) return null;
  if (toDate <= fromDate) return null;
  return (toDate - fromDate) / (1000 * 60 * 60 * 24);
};

const hoursBetween = (from: string, to: string) => {
  const fromDate = new Date(from).getTime();
  const toDate = new Date(to).getTime();
  if (!Number.isFinite(fromDate) || !Number.isFinite(toDate)) return null;
  if (toDate <= fromDate) return null;
  return (toDate - fromDate) / (1000 * 60 * 60);
};

const average = (values: number[]) =>
  values.length > 0
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;

const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat('es-AR', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(value instanceof Date ? value : new Date(value));

const formatDateTime = (value: Date) =>
  new Intl.DateTimeFormat('es-AR', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);

const formatMonth = (date: Date) =>
  new Intl.DateTimeFormat('es-AR', {
    timeZone: TIME_ZONE,
    month: 'short',
  })
    .format(date)
    .replace('.', '');

const formatMoney = (value: number) =>
  `$${Math.round(value).toLocaleString('es-AR')}`;

const formatNumber = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat('es-AR', {
    maximumFractionDigits,
  }).format(value);

const formatPercent = (value: number) => `${formatNumber(value, 0)}%`;

const formatDays = (value: number) =>
  value > 0 ? `${formatNumber(value, 1)} dias` : '0 dias';

const formatHours = (value: number) =>
  value > 0 ? `${formatNumber(value, 1)} h` : '0 h';

const getDateRangeLabel = (ordenes: Orden[]) => {
  const timestamps = ordenes
    .map((orden) => new Date(orden.fecha_creacion).getTime())
    .filter(Number.isFinite)
    .sort((a, b) => a - b);

  if (timestamps.length === 0) return 'Sin ordenes en el periodo';

  const first = new Date(timestamps[0]);
  const last = new Date(timestamps[timestamps.length - 1]);
  return `${formatDate(first)} a ${formatDate(last)}`;
};

const getScopeLabel = (searchParams?: AdminSearchParams) => {
  const hasFilters = Object.entries(searchParams || {}).some(
    ([key, value]) => Boolean(value) && !key.endsWith('_page')
  );

  return hasFilters ? 'Filtrado' : 'Todo';
};

const getTemporalRows = (ordenes: Orden[]) => {
  const rowsByMonth = new Map<string, TemporalRow>();

  const addMonth = (date: Date) => {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`;

    if (!rowsByMonth.has(key)) {
      rowsByMonth.set(key, {
        key,
        label: formatMonth(date),
        ingresos: 0,
        ordenes: 0,
        envios: 0,
        entregados: 0,
      });
    }

    return rowsByMonth.get(key)!;
  };

  if (ordenes.length === 1) {
    const createdAt = new Date(ordenes[0].fecha_creacion);
    const previous = new Date(createdAt);
    previous.setMonth(previous.getMonth() - 1);
    addMonth(previous);
  }

  if (ordenes.length === 0) {
    addMonth(new Date());
  }

  for (const orden of ordenes) {
    const date = new Date(orden.fecha_creacion);
    if (Number.isNaN(date.getTime())) continue;

    const row = addMonth(date);
    row.ordenes += 1;

    if (isApprovedOrder(orden)) {
      row.ingresos += orden.total || 0;
    }

    if (isShippedOrder(orden)) {
      row.envios += 1;
    }

    if (orden.estado_envio === 'entregado') {
      row.entregados += 1;
    }
  }

  return Array.from(rowsByMonth.values())
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-6);
};

const getTopRows = async (
  ordenes: Orden[],
  ordenItems: OrdenItemReport[]
) => {
  const approvedOrdenIds = new Set(
    ordenes.filter(isApprovedOrder).map((orden) => orden.orden_id)
  );
  const productosMap = new Map<string, RankedRow>();
  const vendedoresMap = new Map<string, RankedRow>();
  const vendedorIds = Array.from(
    new Set(
      ordenItems
        .map((item) => item.producto?.clerk_user_id)
        .filter((value): value is string => Boolean(value))
    )
  );
  const vendedoresById = await getVendedoresByIds(vendedorIds);

  for (const item of ordenItems) {
    if (!approvedOrdenIds.has(item.orden_id)) continue;

    const productKey = item.producto_id;
    const productName = item.producto?.titulo || `Producto ${item.producto_id}`;
    const productRow = productosMap.get(productKey) || {
      label: productName,
      units: 0,
      revenue: 0,
    };
    productRow.units += 1;
    productRow.revenue += item.precio_unitario || 0;
    productosMap.set(productKey, productRow);

    const sellerId = item.producto?.clerk_user_id;
    if (!sellerId) continue;

    const sellerRow = vendedoresMap.get(sellerId) || {
      label:
        vendedoresById.get(sellerId)?.nombre_vendedor ||
        `Vendedor ${sellerId.slice(0, 8)}`,
      units: 0,
      revenue: 0,
    };
    sellerRow.units += 1;
    sellerRow.revenue += item.precio_unitario || 0;
    vendedoresMap.set(sellerId, sellerRow);
  }

  const rank = (rows: RankedRow[]) =>
    rows
      .sort((a, b) => b.revenue - a.revenue || b.units - a.units)
      .slice(0, 5);

  return {
    topProductos: rank(Array.from(productosMap.values())),
    topVendedores: rank(Array.from(vendedoresMap.values())),
  };
};

const buildFunnel = (ordenes: Orden[]): FunnelRow[] => {
  const creadas = ordenes.length;
  const pagadas = ordenes.filter(isApprovedOrder).length;
  const despachadas = ordenes.filter(isShippedOrder).length;
  const entregadas = ordenes.filter(
    (orden) => orden.estado_envio === 'entregado'
  ).length;
  const completadas = ordenes.filter(isCompletedOrder).length;
  const steps = [
    { label: 'Creadas', count: creadas },
    { label: 'Pagadas', count: pagadas },
    { label: 'Despachadas', count: despachadas },
    { label: 'Entregadas', count: entregadas },
    { label: 'Completadas', count: completadas },
  ];

  return steps.map((step, index) => {
    const previous = index === 0 ? null : steps[index - 1].count;

    return {
      label: step.label,
      count: step.count,
      percent:
        index === 0
          ? null
          : previous && previous > 0
            ? (step.count / previous) * 100
            : 0,
      shareOfBase: creadas > 0 ? step.count / creadas : 0,
    };
  });
};

export const getAdminReportData = async (
  searchParams?: AdminSearchParams
): Promise<AdminReportData> => {
  const [vendedores, productos, ordenes] = await Promise.all([
    getFilteredVendedores(searchParams),
    getFilteredProductos(searchParams),
    getFilteredOrdenes(searchParams),
  ]);
  const ordenItems = await getOrdenItems(
    ordenes.map((orden) => orden.orden_id)
  );
  const approvedOrders = ordenes.filter(isApprovedOrder);
  const completedOrders = ordenes.filter(isCompletedOrder);
  const deliveredOrders = ordenes.filter(
    (orden) => orden.estado_envio === 'entregado'
  );
  const pendingOrders = ordenes.filter(
    (orden) =>
      orden.estado_general === 'pendiente_pago' ||
      orden.estado_general === 'en_preparacion'
  );
  const ingresosAprobados = approvedOrders.reduce(
    (sum, orden) => sum + (orden.total || 0),
    0
  );
  const entregaPromedioDias = average(
    deliveredOrders
      .map((orden) => daysBetween(orden.fecha_creacion, orden.fecha_actualizacion))
      .filter((value): value is number => value !== null)
  );
  const pagoPromedioHoras = average(
    approvedOrders
      .map((orden) => hoursBetween(orden.fecha_creacion, orden.fecha_actualizacion))
      .filter((value): value is number => value !== null)
  );
  const topRows = await getTopRows(ordenes, ordenItems);

  return {
    generatedAt: new Date(),
    scopeLabel: getScopeLabel(searchParams),
    dateRangeLabel: getDateRangeLabel(ordenes),
    vendedores,
    productos,
    ordenes,
    ordenItems,
    metrics: {
      ingresosAprobados,
      transaccionesAprobadas: approvedOrders.length,
      ticketPromedio:
        approvedOrders.length > 0 ? ingresosAprobados / approvedOrders.length : 0,
      conversion:
        ordenes.length > 0 ? (completedOrders.length / ordenes.length) * 100 : 0,
      compradoresActivos: new Set(ordenes.map((orden) => orden.clerk_user_id))
        .size,
      vendedoresTotal: vendedores.length,
      vendedoresActivos: vendedores.filter((vendedor) => vendedor.activo).length,
      vendedoresInactivos: vendedores.filter((vendedor) => !vendedor.activo)
        .length,
      productosTotal: productos.length,
      productosActivos: productos.filter(
        (producto) => producto.estado_publicacion === 'activa'
      ).length,
      productosVendidos: productos.filter(
        (producto) => producto.estado_publicacion === 'vendida'
      ).length,
      ordenesTotal: ordenes.length,
      ordenesCompletadas: completedOrders.length,
      ordenesPendientes: pendingOrders.length,
      ordenesEntregadas: deliveredOrders.length,
      entregaPromedioDias,
      pagoPromedioHoras,
    },
    temporal: getTemporalRows(ordenes),
    funnel: buildFunnel(ordenes),
    topProductos: topRows.topProductos,
    topVendedores: topRows.topVendedores,
  };
};

const csvCell = (value: unknown) =>
  `"${String(value ?? '').replace(/"/g, '""')}"`;

const csvRow = (values: unknown[]) => values.map(csvCell).join(',');

export const buildAdminCsvReport = (report: AdminReportData) => {
  const rows: string[] = [];
  const add = (values: unknown[]) => rows.push(csvRow(values));
  const addEmpty = () => rows.push('');

  add(['LAMA Analytics Reporte Ejecutivo']);
  add(['Generado', formatDateTime(report.generatedAt)]);
  add(['Alcance', report.scopeLabel]);
  add(['Periodo', report.dateRangeLabel]);
  addEmpty();

  add(['Resumen ejecutivo']);
  add(['Metrica', 'Valor']);
  add(['Ingresos aprobados', report.metrics.ingresosAprobados]);
  add(['Transacciones aprobadas', report.metrics.transaccionesAprobadas]);
  add(['Ticket promedio', report.metrics.ticketPromedio]);
  add(['Conversion', report.metrics.conversion]);
  add(['Compradores activos', report.metrics.compradoresActivos]);
  add(['Vendedores', report.metrics.vendedoresTotal]);
  add(['Productos', report.metrics.productosTotal]);
  add(['Ordenes', report.metrics.ordenesTotal]);
  addEmpty();

  add(['Evolucion temporal']);
  add(['Periodo', 'Ingresos', 'Ordenes', 'Envios', 'Entregados']);
  for (const row of report.temporal) {
    add([row.label, row.ingresos, row.ordenes, row.envios, row.entregados]);
  }
  addEmpty();

  add(['Embudo operativo']);
  add(['Etapa', 'Ordenes', 'Conversion etapa', 'Participacion base']);
  for (const row of report.funnel) {
    add([
      row.label,
      row.count,
      row.percent === null ? 'Base' : `${formatNumber(row.percent, 1)}%`,
      `${formatNumber(row.shareOfBase * 100, 1)}%`,
    ]);
  }
  addEmpty();

  add(['Top productos']);
  add(['Producto', 'Unidades', 'Ingresos']);
  for (const row of report.topProductos) {
    add([row.label, row.units, row.revenue]);
  }
  addEmpty();

  add(['Top vendedores']);
  add(['Vendedor', 'Unidades', 'Ingresos']);
  for (const row of report.topVendedores) {
    add([row.label, row.units, row.revenue]);
  }
  addEmpty();

  add(['Vendedores']);
  add(['Nombre', 'Email', 'Telefono', 'Estado', 'Fecha creacion']);
  for (const vendedor of report.vendedores) {
    add([
      vendedor.nombre_vendedor,
      vendedor.email,
      vendedor.telefono || '',
      vendedor.activo ? 'Activo' : 'Inactivo',
      formatDate(vendedor.fecha_creacion),
    ]);
  }
  addEmpty();

  add(['Productos']);
  add([
    'Producto',
    'Vendedor',
    'Precio',
    'Estado prenda',
    'Publicacion',
    'Talle',
    'Genero',
    'Fecha creacion',
  ]);
  for (const producto of report.productos) {
    add([
      producto.titulo,
      producto.vendedor?.nombre_vendedor || 'Sin vendedor',
      producto.precio,
      producto.estado_prenda,
      producto.estado_publicacion,
      producto.talle || '',
      producto.genero,
      formatDate(producto.fecha_creacion),
    ]);
  }
  addEmpty();

  add(['Ordenes']);
  add([
    'Nro orden',
    'Total',
    'Estado general',
    'Estado pago',
    'Estado envio',
    'Fecha creacion',
  ]);
  for (const orden of report.ordenes) {
    add([
      orden.nro_orden,
      orden.total,
      orden.estado_general,
      orden.estado_pago,
      orden.estado_envio,
      formatDate(orden.fecha_creacion),
    ]);
  }

  return `\uFEFF${rows.join('\r\n')}`;
};

const sanitizePdfText = (value: unknown) =>
  String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '?')
    .replace(/\s+/g, ' ')
    .trim();

const escapePdfString = (value: unknown) =>
  sanitizePdfText(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const byteLength = (value: string) => value.length;

const toLatinBytes = (value: string) => {
  const bytes = new Uint8Array(value.length);
  for (let index = 0; index < value.length; index += 1) {
    bytes[index] = value.charCodeAt(index) & 0xff;
  }
  return bytes;
};

const colorOperator = (color: PdfColor, operator: 'rg' | 'RG') =>
  `${color.map((value) => value.toFixed(3)).join(' ')} ${operator}`;

const estimateTextWidth = (text: string, size: number, bold = false) => {
  const safe = sanitizePdfText(text);
  const averageWidth = bold ? 0.56 : 0.52;
  return safe.length * size * averageWidth;
};

const fitPdfText = (value: unknown, maxWidth: number, size: number, bold = false) => {
  const safe = sanitizePdfText(value);
  if (estimateTextWidth(safe, size, bold) <= maxWidth) return safe;

  let fitted = safe;
  while (fitted.length > 1 && estimateTextWidth(`${fitted}...`, size, bold) > maxWidth) {
    fitted = fitted.slice(0, -1);
  }

  return `${fitted.trimEnd()}...`;
};

class PdfDocument {
  private pages: string[][] = [[]];
  private activePageIndex = 0;

  addPage() {
    this.pages.push([]);
    this.activePageIndex = this.pages.length - 1;
  }

  usePage(index: number) {
    this.activePageIndex = index;
  }

  get pageCount() {
    return this.pages.length;
  }

  private get activePage() {
    return this.pages[this.activePageIndex];
  }

  rect(
    x: number,
    y: number,
    width: number,
    height: number,
    options: {
      fill?: PdfColor;
      stroke?: PdfColor;
      lineWidth?: number;
    } = {}
  ) {
    const commands = ['q'];
    if (options.fill) {
      commands.push(colorOperator(options.fill, 'rg'));
    }
    if (options.stroke) {
      commands.push(colorOperator(options.stroke, 'RG'));
      commands.push(`${(options.lineWidth || 1).toFixed(2)} w`);
    }
    commands.push(
      `${x.toFixed(2)} ${(PAGE_HEIGHT - y - height).toFixed(2)} ${width.toFixed(
        2
      )} ${height.toFixed(2)} re`
    );
    commands.push(options.fill && options.stroke ? 'B' : options.fill ? 'f' : 'S');
    commands.push('Q');
    this.activePage.push(commands.join(' '));
  }

  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: PdfColor = COLORS.line,
    lineWidth = 1
  ) {
    this.activePage.push(
      `q ${colorOperator(color, 'RG')} ${lineWidth.toFixed(2)} w ${x1.toFixed(
        2
      )} ${(PAGE_HEIGHT - y1).toFixed(2)} m ${x2.toFixed(2)} ${(
        PAGE_HEIGHT - y2
      ).toFixed(2)} l S Q`
    );
  }

  text(
    value: unknown,
    x: number,
    y: number,
    size: number,
    options: {
      bold?: boolean;
      color?: PdfColor;
      align?: 'left' | 'right' | 'center';
    } = {}
  ) {
    const safe = escapePdfString(value);
    const font = options.bold ? 'F2' : 'F1';
    const width = estimateTextWidth(safe, size, options.bold);
    const drawX =
      options.align === 'right'
        ? x - width
        : options.align === 'center'
          ? x - width / 2
          : x;

    this.activePage.push(
      `q ${colorOperator(options.color || COLORS.ink, 'rg')} BT /${font} ${size.toFixed(
        2
      )} Tf 1 0 0 1 ${drawX.toFixed(2)} ${(PAGE_HEIGHT - y - size).toFixed(
        2
      )} Tm (${safe}) Tj ET Q`
    );
  }

  wrapText(
    value: unknown,
    x: number,
    y: number,
    maxWidth: number,
    size: number,
    options: { bold?: boolean; color?: PdfColor; lineHeight?: number } = {}
  ) {
    const words = sanitizePdfText(value).split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = '';

    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (estimateTextWidth(next, size, options.bold) <= maxWidth || !current) {
        current = next;
      } else {
        lines.push(current);
        current = word;
      }
    }

    if (current) lines.push(current);

    const lineHeight = options.lineHeight || size + 5;
    lines.forEach((line, index) => {
      this.text(line, x, y + index * lineHeight, size, options);
    });

    return y + Math.max(lines.length, 1) * lineHeight;
  }

  toUint8Array() {
    const objects: string[] = [];
    const pageIds: number[] = [];
    const addObject = (value: string) => {
      objects.push(value);
      return objects.length;
    };

    addObject('<< /Type /Catalog /Pages 2 0 R >>');
    addObject('__PAGES__');
    addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

    for (const page of this.pages) {
      const stream = page.join('\n');
      const contentId = addObject(
        `<< /Length ${byteLength(stream)} >>\nstream\n${stream}\nendstream`
      );
      const pageId = addObject(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`
      );
      pageIds.push(pageId);
    }

    objects[1] =
      `<< /Type /Pages /Kids [${pageIds
        .map((id) => `${id} 0 R`)
        .join(' ')}] /Count ${pageIds.length} >>`;

    let output = '%PDF-1.4\n';
    const offsets = [0];

    objects.forEach((object, index) => {
      offsets.push(byteLength(output));
      output += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });

    const xrefOffset = byteLength(output);
    output += `xref\n0 ${objects.length + 1}\n`;
    output += '0000000000 65535 f \n';
    for (let index = 1; index < offsets.length; index += 1) {
      output += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
    }
    output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
    output += `startxref\n${xrefOffset}\n%%EOF`;

    return toLatinBytes(output);
  }
}

const drawSectionTitle = (pdf: PdfDocument, title: string, y: number) => {
  pdf.text(title.toUpperCase(), PAGE_MARGIN, y, 11, {
    bold: true,
    color: COLORS.sage,
  });
  pdf.line(PAGE_MARGIN, y + 18, PAGE_MARGIN + 48, y + 18, COLORS.sage, 1.2);
  return y + 35;
};

const drawMetricCard = (
  pdf: PdfDocument,
  card: MetricCard,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  pdf.rect(x, y, width, height, {
    fill: COLORS.panel,
    stroke: COLORS.line,
    lineWidth: 1,
  });
  pdf.text(card.label.toUpperCase(), x + 12, y + 22, 8.5, {
    bold: true,
    color: COLORS.muted,
  });
  pdf.text(card.value, x + 12, y + 43, 22, {
    bold: true,
    color: COLORS.ink,
  });
  pdf.text(card.hint, x + 12, y + 75, 9, {
    color: COLORS.muted,
  });
};

const drawTable = (
  pdf: PdfDocument,
  y: number,
  headers: string[],
  rows: string[][],
  widths: number[]
) => {
  const rowHeight = 27;
  const x = PAGE_MARGIN;
  const tableWidth = widths.reduce((sum, width) => sum + width, 0);

  pdf.rect(x, y, tableWidth, rowHeight, { fill: COLORS.sageDeep });
  let currentX = x;
  headers.forEach((header, index) => {
    pdf.text(header.toUpperCase(), currentX + 8, y + 9, 8.2, {
      bold: true,
      color: COLORS.white,
    });
    currentX += widths[index];
  });

  let currentY = y + rowHeight;
  rows.forEach((row) => {
    currentX = x;
    row.forEach((cell, index) => {
      pdf.text(fitPdfText(cell, widths[index] - 16, 8.6), currentX + 8, currentY + 9, 8.6, {
        color: index === 0 ? COLORS.ink : COLORS.muted,
      });
      currentX += widths[index];
    });
    pdf.line(x, currentY + rowHeight, x + tableWidth, currentY + rowHeight);
    currentY += rowHeight;
  });

  return currentY + 8;
};

const drawFunnel = (pdf: PdfDocument, report: AdminReportData, y: number) => {
  pdf.text('Conversion entre etapas', PAGE_MARGIN, y, 9.5, {
    color: COLORS.muted,
  });

  let currentY = y + 26;
  const labelX = PAGE_MARGIN;
  const countX = PAGE_MARGIN + 136;
  const barX = PAGE_MARGIN + 250;
  const barWidth = 245;
  const percentX = PAGE_MARGIN + 520;

  for (const row of report.funnel) {
    pdf.text(row.label, labelX, currentY, 11, { bold: true, color: COLORS.ink });
    pdf.text(`${row.count} ordenes`, countX, currentY, 9.5, {
      color: COLORS.muted,
    });
    pdf.rect(barX, currentY + 1, barWidth, 10, { fill: COLORS.line });
    pdf.rect(barX, currentY + 1, Math.max(barWidth * row.shareOfBase, 2), 10, {
      fill: COLORS.sageDeep,
    });
    pdf.text(
      row.percent === null ? 'Base' : formatPercent(row.percent),
      percentX,
      currentY,
      9.5,
      {
        bold: true,
        color: COLORS.sageDeep,
        align: 'right',
      }
    );
    currentY += 28;
  }

  return currentY + 10;
};

const drawFooter = (pdf: PdfDocument) => {
  const total = pdf.pageCount;
  for (let index = 0; index < total; index += 1) {
    pdf.usePage(index);
    pdf.line(PAGE_MARGIN, 746, PAGE_WIDTH - PAGE_MARGIN, 746, COLORS.line);
    pdf.text('LAMA Analytics', PAGE_MARGIN, 758, 8, { color: COLORS.muted });
    pdf.text(`Pagina ${index + 1} de ${total}`, PAGE_WIDTH - PAGE_MARGIN, 758, 8, {
      color: COLORS.muted,
      align: 'right',
    });
  }
};

const buildMetricCards = (report: AdminReportData): MetricCard[] => [
  {
    label: 'Ingresos',
    value: formatMoney(report.metrics.ingresosAprobados),
    hint: 'Pagos aprobados',
  },
  {
    label: 'Transacciones',
    value: formatNumber(report.metrics.transaccionesAprobadas),
    hint: 'Aprobadas',
  },
  {
    label: 'Ticket promedio',
    value: formatMoney(report.metrics.ticketPromedio),
    hint: 'Por pago aprobado',
  },
  {
    label: 'Conversion',
    value: formatPercent(report.metrics.conversion),
    hint: 'Completadas / creadas',
  },
  {
    label: 'Vendedores',
    value: formatNumber(report.metrics.vendedoresTotal),
    hint: `${formatNumber(report.metrics.vendedoresActivos)} activos`,
  },
  {
    label: 'Productos',
    value: formatNumber(report.metrics.productosTotal),
    hint: `${formatNumber(report.metrics.productosActivos)} publicados`,
  },
  {
    label: 'Entrega',
    value: formatDays(report.metrics.entregaPromedioDias),
    hint: 'Promedio logistico',
  },
  {
    label: 'Pago',
    value: formatHours(report.metrics.pagoPromedioHoras),
    hint: 'Tiempo aprobacion',
  },
];

export const buildAdminPdfReport = (report: AdminReportData) => {
  const pdf = new PdfDocument();

  pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, { fill: COLORS.cream });
  pdf.rect(0, 0, PAGE_WIDTH, 128, { fill: COLORS.sage });
  pdf.text('LAMA', PAGE_MARGIN, 48, 30, { bold: true, color: COLORS.white });
  pdf.text('Analytics Reporte Ejecutivo', PAGE_MARGIN, 92, 13, {
    color: COLORS.white,
  });
  pdf.text(report.scopeLabel, PAGE_WIDTH - PAGE_MARGIN, 62, 14, {
    bold: true,
    color: COLORS.white,
    align: 'right',
  });
  pdf.text(
    `Generado ${formatDateTime(report.generatedAt)}`,
    PAGE_WIDTH - PAGE_MARGIN,
    96,
    10,
    {
      color: COLORS.white,
      align: 'right',
    }
  );

  let y = drawSectionTitle(pdf, 'Resumen ejecutivo', 166);
  pdf.text(report.dateRangeLabel, PAGE_MARGIN, y - 4, 10, {
    color: COLORS.muted,
  });

  const summary =
    `Ingresos aprobados: ${formatMoney(
      report.metrics.ingresosAprobados
    )}. Transacciones aprobadas: ${formatNumber(
      report.metrics.transaccionesAprobadas
    )}. Tasa de conversion: ${formatPercent(report.metrics.conversion)}. ` +
    `Ticket promedio: ${formatMoney(
      report.metrics.ticketPromedio
    )}. Entrega promedio: ${formatDays(
      report.metrics.entregaPromedioDias
    )}. Procesamiento de pago: ${formatHours(report.metrics.pagoPromedioHoras)}.`;

  y = pdf.wrapText(summary, PAGE_MARGIN, y + 28, CONTENT_WIDTH - 10, 12, {
    color: COLORS.ink,
    lineHeight: 18,
  });

  y += 26;
  const cards = buildMetricCards(report);
  const gap = 12;
  const cardWidth = (CONTENT_WIDTH - gap * 3) / 4;
  const cardHeight = 86;
  cards.forEach((card, index) => {
    const column = index % 4;
    const row = Math.floor(index / 4);
    drawMetricCard(
      pdf,
      card,
      PAGE_MARGIN + column * (cardWidth + gap),
      y + row * (cardHeight + 14),
      cardWidth,
      cardHeight
    );
  });

  pdf.addPage();
  pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, { fill: COLORS.cream });
  y = drawSectionTitle(pdf, 'Evolucion temporal', 46);
  y = drawTable(
    pdf,
    y,
    ['Periodo', 'Ingresos', 'Ordenes', 'Envios', 'Entregados'],
    report.temporal.map((row) => [
      row.label,
      formatMoney(row.ingresos),
      formatNumber(row.ordenes),
      formatNumber(row.envios),
      formatNumber(row.entregados),
    ]),
    [110, 130, 100, 95, 93]
  );

  y = drawSectionTitle(pdf, 'Embudo operativo', y + 4);
  y = drawFunnel(pdf, report, y - 8);

  y = drawSectionTitle(pdf, 'Top productos', y + 6);
  y = drawTable(
    pdf,
    y,
    ['Producto', 'Unidades', 'Ingresos'],
    (report.topProductos.length > 0
      ? report.topProductos
      : [{ label: 'Sin productos vendidos', units: 0, revenue: 0 }]
    ).map((row, index) => [
      `${index + 1}. ${row.label}`,
      formatNumber(row.units),
      formatMoney(row.revenue),
    ]),
    [335, 105, 88]
  );

  const sellersStartY = y + 6;
  if (sellersStartY > 650) {
    pdf.addPage();
    pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, { fill: COLORS.cream });
    y = drawSectionTitle(pdf, 'Top vendedores', 46);
  } else {
    y = drawSectionTitle(pdf, 'Top vendedores', sellersStartY);
  }

  drawTable(
    pdf,
    y,
    ['Vendedor', 'Unidades', 'Ingresos'],
    (report.topVendedores.length > 0
      ? report.topVendedores
      : [{ label: 'Sin vendedores con ventas', units: 0, revenue: 0 }]
    ).map((row, index) => [
      `${index + 1}. ${row.label}`,
      formatNumber(row.units),
      formatMoney(row.revenue),
    ]),
    [335, 105, 88]
  );

  drawFooter(pdf);
  return pdf.toUint8Array();
};

export const getReportFilename = (format: ReportFormat, generatedAt: Date) => {
  const date = generatedAt.toISOString().slice(0, 10);
  return `lama-admin-report-${date}.${format}`;
};
