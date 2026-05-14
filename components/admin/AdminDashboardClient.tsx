'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Orden, Producto, Vendedor } from '@/types';
import { AdminFilters } from '@/components/admin/AdminFilters';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { VendedoresTable } from '@/components/admin/VendedoresTable';
import { ProductosTable } from '@/components/admin/ProductosTable';
import { OrdenesTable } from '@/components/admin/OrdenesTable';

type ProductoConVendedor = Producto & {
  vendedor?: {
    nombre_vendedor: string;
  } | null;
};

interface AdminDashboardClientProps {
  vendedores: Vendedor[] | null;
  productos: ProductoConVendedor[] | null;
  ordenes: Orden[] | null;
}

const normalizeText = (value: string) => value.trim().toLowerCase();

const matchesText = (value: string | null | undefined, term: string) => {
  if (!value) return false;
  return value.toLowerCase().includes(term);
};

const parseDateInput = (value: string) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const endOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

const PAGE_SIZE = 50;

export function AdminDashboardClient({
  vendedores,
  productos,
  ordenes,
}: AdminDashboardClientProps) {
  const [vendedorSearch, setVendedorSearch] = useState('');
  const [productoSearch, setProductoSearch] = useState('');
  const [productoDesde, setProductoDesde] = useState('');
  const [productoHasta, setProductoHasta] = useState('');
  const [ordenSearch, setOrdenSearch] = useState('');
  const [ordenDesde, setOrdenDesde] = useState('');
  const [ordenHasta, setOrdenHasta] = useState('');
  const [vendedoresPage, setVendedoresPage] = useState(1);
  const [productosPage, setProductosPage] = useState(1);
  const [ordenesPage, setOrdenesPage] = useState(1);

  useEffect(() => {
    setVendedoresPage(1);
  }, [vendedorSearch]);

  useEffect(() => {
    setProductosPage(1);
  }, [productoSearch, productoDesde, productoHasta]);

  useEffect(() => {
    setOrdenesPage(1);
  }, [ordenSearch, ordenDesde, ordenHasta]);

  const filteredVendedores = useMemo(() => {
    if (!vendedores) return null;
    const term = normalizeText(vendedorSearch);
    if (!term) return vendedores;

    return vendedores.filter((vendedor) =>
      matchesText(vendedor.nombre_vendedor, term) ||
      matchesText(vendedor.email, term) ||
      matchesText(vendedor.dni, term)
    );
  }, [vendedores, vendedorSearch]);

  const vendedoresTotal = filteredVendedores?.length ?? 0;
  const vendedoresTotalPages = Math.max(1, Math.ceil(vendedoresTotal / PAGE_SIZE));

  useEffect(() => {
    if (vendedoresPage > vendedoresTotalPages) {
      setVendedoresPage(vendedoresTotalPages);
    }
  }, [vendedoresPage, vendedoresTotalPages]);

  const pagedVendedores = useMemo(() => {
    if (!filteredVendedores) return null;
    const start = (vendedoresPage - 1) * PAGE_SIZE;
    return filteredVendedores.slice(start, start + PAGE_SIZE);
  }, [filteredVendedores, vendedoresPage]);

  const filteredProductos = useMemo(() => {
    if (!productos) return null;
    const term = normalizeText(productoSearch);
    const fromDate = parseDateInput(productoDesde);
    const toDate = parseDateInput(productoHasta);
    const toEnd = toDate ? endOfDay(toDate) : null;

    return productos.filter((producto) => {
      if (term) {
        const matchesProducto =
          matchesText(producto.titulo, term) ||
          matchesText(producto.vendedor?.nombre_vendedor, term);

        if (!matchesProducto) return false;
      }

      if (fromDate || toEnd) {
        const createdAt = new Date(producto.fecha_creacion);
        if (Number.isNaN(createdAt.getTime())) return false;
        if (fromDate && createdAt < fromDate) return false;
        if (toEnd && createdAt > toEnd) return false;
      }

      return true;
    });
  }, [productos, productoSearch, productoDesde, productoHasta]);

  const productosTotal = filteredProductos?.length ?? 0;
  const productosTotalPages = Math.max(1, Math.ceil(productosTotal / PAGE_SIZE));

  useEffect(() => {
    if (productosPage > productosTotalPages) {
      setProductosPage(productosTotalPages);
    }
  }, [productosPage, productosTotalPages]);

  const pagedProductos = useMemo(() => {
    if (!filteredProductos) return null;
    const start = (productosPage - 1) * PAGE_SIZE;
    return filteredProductos.slice(start, start + PAGE_SIZE);
  }, [filteredProductos, productosPage]);

  const filteredOrdenes = useMemo(() => {
    if (!ordenes) return null;
    const term = normalizeText(ordenSearch);
    const fromDate = parseDateInput(ordenDesde);
    const toDate = parseDateInput(ordenHasta);
    const toEnd = toDate ? endOfDay(toDate) : null;

    return ordenes.filter((orden) => {
      if (term) {
        const matchesOrden =
          matchesText(orden.nro_orden, term) ||
          matchesText(orden.estado_general, term) ||
          matchesText(orden.estado_pago, term) ||
          matchesText(orden.estado_envio, term);

        if (!matchesOrden) return false;
      }

      if (fromDate || toEnd) {
        const createdAt = new Date(orden.fecha_creacion);
        if (Number.isNaN(createdAt.getTime())) return false;
        if (fromDate && createdAt < fromDate) return false;
        if (toEnd && createdAt > toEnd) return false;
      }

      return true;
    });
  }, [ordenes, ordenSearch, ordenDesde, ordenHasta]);

  const ordenesTotal = filteredOrdenes?.length ?? 0;
  const ordenesTotalPages = Math.max(1, Math.ceil(ordenesTotal / PAGE_SIZE));

  useEffect(() => {
    if (ordenesPage > ordenesTotalPages) {
      setOrdenesPage(ordenesTotalPages);
    }
  }, [ordenesPage, ordenesTotalPages]);

  const pagedOrdenes = useMemo(() => {
    if (!filteredOrdenes) return null;
    const start = (ordenesPage - 1) * PAGE_SIZE;
    return filteredOrdenes.slice(start, start + PAGE_SIZE);
  }, [filteredOrdenes, ordenesPage]);

  return (
    <>
      <AdminFilters
        value={vendedorSearch}
        onChange={setVendedorSearch}
        placeholder="Buscar vendedor por nombre, email o DNI"
        onClear={() => setVendedorSearch('')}
      />

      <VendedoresTable
        vendedores={pagedVendedores}
        pagination={(
          <AdminPagination
            currentPage={vendedoresPage}
            totalItems={vendedoresTotal}
            pageSize={PAGE_SIZE}
            onPageChange={setVendedoresPage}
          />
        )}
      />

      <AdminFilters
        value={productoSearch}
        onChange={setProductoSearch}
        placeholder="Buscar producto por título"
        showDateFilters
        from={productoDesde}
        to={productoHasta}
        onFromChange={setProductoDesde}
        onToChange={setProductoHasta}
        onClear={() => {
          setProductoSearch('');
          setProductoDesde('');
          setProductoHasta('');
        }}
      />

      <ProductosTable
        productos={pagedProductos}
        pagination={(
          <AdminPagination
            currentPage={productosPage}
            totalItems={productosTotal}
            pageSize={PAGE_SIZE}
            onPageChange={setProductosPage}
          />
        )}
      />

      <AdminFilters
        value={ordenSearch}
        onChange={setOrdenSearch}
        placeholder="Buscar orden por número o estado"
        showDateFilters
        from={ordenDesde}
        to={ordenHasta}
        onFromChange={setOrdenDesde}
        onToChange={setOrdenHasta}
        onClear={() => {
          setOrdenSearch('');
          setOrdenDesde('');
          setOrdenHasta('');
        }}
      />

      <OrdenesTable
        ordenes={pagedOrdenes}
        pagination={(
          <AdminPagination
            currentPage={ordenesPage}
            totalItems={ordenesTotal}
            pageSize={PAGE_SIZE}
            onPageChange={setOrdenesPage}
          />
        )}
      />
    </>
  );
}
