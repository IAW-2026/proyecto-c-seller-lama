import type { Producto } from '@/types';

interface ProductoMock extends Producto {
  categoria_nombre: string;
  rating: number;
  reviews: number;
}

export const productosFixture: ProductoMock[] = [
  {
    producto_id: 'PROD-001',
    vendedor_id: 'VED-001',
    categoria_id: 'CAT-001',
    titulo: 'Campera Vintage Levi\'s',
    descripcion: 'Campera denim original años 90, en buen estado',
    precio: 2500,
    imagenes: [
      'https://picsum.photos/500/500?random=1',
    ],
    estado_prenda: 'vintage',
    talle: 'L',
    marca: 'Levi\'s',
    stock: 3,
    estado_publicacion: 'activa',
    fecha_creacion: '2026-04-15',
    categoria_nombre: 'Camperas',
    rating: 4.8,
    reviews: 87,
  },
  {
    producto_id: 'PROD-002',
    vendedor_id: 'VED-001',
    categoria_id: 'CAT-001',
    titulo: 'Remera Nike Usada',
    descripcion: 'Remera deportiva, poco uso',
    precio: 800,
    imagenes: [
      'https://picsum.photos/500/500?random=2',
    ],
    estado_prenda: 'usado',
    talle: 'M',
    marca: 'Nike',
    stock: 5,
    estado_publicacion: 'activa',
    fecha_creacion: '2026-04-20',
    categoria_nombre: 'Remeras',
    rating: 4.5,
    reviews: 42,
  },
  {
    producto_id: 'PROD-003',
    vendedor_id: 'VED-001',
    categoria_id: 'CAT-002',
    titulo: 'Pantalón Zara Nuevo',
    descripcion: 'Pantalón chino, nunca usado',
    precio: 1800,
    imagenes: [
      'https://picsum.photos/500/500?random=3',
    ],
    estado_prenda: 'nuevo',
    talle: 'S',
    marca: 'Zara',
    stock: 2,
    estado_publicacion: 'activa',
    fecha_creacion: '2026-05-01',
    categoria_nombre: 'Pantalones',
    rating: 4.9,
    reviews: 156,
  },
  {
    producto_id: 'PROD-004',
    vendedor_id: 'VED-001',
    categoria_id: 'CAT-001',
    titulo: 'Campera de Cuero',
    descripcion: 'Campera de cuero auténtico',
    precio: 3200,
    imagenes: [
      'https://picsum.photos/500/500?random=4',
    ],
    estado_prenda: 'vintage',
    talle: 'XL',
    marca: 'The Leather Co',
    stock: 0,
    estado_publicacion: 'vendida',
    fecha_creacion: '2026-03-10',
    categoria_nombre: 'Camperas',
    rating: 5,
    reviews: 203,
  },
];
