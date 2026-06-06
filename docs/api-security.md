# Seguridad de APIs

Este documento resume como se protegen las APIs y acciones del servidor en la Seller App.

La idea principal es separar la seguridad real de la UI. El Navbar puede ocultar o mostrar links segun el rol, pero eso no protege una ruta. La proteccion importante esta en el servidor: route handlers, server actions, server components y proxy.

## Roles

Los roles vienen de Clerk, en `publicMetadata.roles`.

Roles usados:

- `vendedor`: puede gestionar sus propios productos y ventas.
- `super_admin`: puede gestionar vendedores, productos y ordenes de forma global.

Los helpers de API estan en `src/lib/api-auth.ts`.

Helpers principales:

- `requireAuthUser()`: exige sesion de Clerk y devuelve `userId`.
- `requireRole(role)`: exige sesion y que el usuario tenga el rol pedido.
- `requireVendedor()`: exige rol `vendedor`.
- `requireSuperAdmin()`: exige rol `super_admin`.
- `requireInternalApiKey(request)`: valida el header `x-api-key` contra `INTERNAL_API_KEY`.
- `jsonError(message, status)`: devuelve errores JSON con formato consistente.

Tambien existe `lib/api-auth.ts`, que reexporta esos helpers para mantener el estilo de imports del proyecto.

## Endpoints publicos

Estos endpoints quedan publicos porque los consume Buyer o el catalogo:

- `GET /api/productos`
- `GET /api/productos/[producto_id]`
- `GET /api/productos/bulk`
- `GET /api/categorias-productos`
- `GET /api/vendedores`

Aunque son publicos, no devuelven cualquier dato. Los productos publicos se filtran por `estado_publicacion = 'activa'`, por lo que no se exponen productos `inactiva` o `vendida`. Tambien se validan parametros de busqueda, filtros y paginacion.

Consecuencia importante: si un producto cambia a `vendida` o `inactiva`, deja de aparecer para Buyer aunque siga existiendo en la base.

## Endpoints de vendedor

Estos endpoints requieren sesion y rol `vendedor`:

- `POST /api/ordenes/[orden_id]/despachar`
- `GET /api/ordenes/[orden_id]/envio`

Ademas, las server actions de productos tambien validan vendedor:

- crear producto
- editar producto
- eliminar producto
- crear categoria desde el formulario de producto

Reglas aplicadas:

- Se obtiene el `userId` desde Clerk.
- No se confia en un `clerk_user_id` enviado por el cliente.
- Las consultas se filtran por el vendedor dueno del recurso.
- Si el recurso existe pero pertenece a otro vendedor, se devuelve `403`.
- Si el vendedor esta inactivo, no puede operar.


## Acciones de administrador

Las acciones administrativas requieren rol `super_admin`.

Acciones protegidas:

- eliminar producto
- eliminar orden
- desactivar vendedor
- activar vendedor
- editar vendedor
- editar producto desde admin
- editar orden

El administrador puede operar globalmente, por eso no se filtra por `clerk_user_id` del vendedor. La validacion clave es el rol `super_admin`.

Consecuencia importante: si un usuario sin rol admin intenta llamar una action admin, la validacion del servidor lo corta antes de modificar datos.

## Endpoints internos entre apps

Estos endpoints no usan Clerk de usuario porque los consumen otras aplicaciones del marketplace de servidor a servidor, como Buyer, Shipping o Payments.

Se protegen con el header:

```http
x-api-key: <valor de INTERNAL_API_KEY>
```

Endpoints internos protegidos:

- `GET /api/ordenes-ventas`
- `POST /api/ordenes-ventas`
- `GET /api/ordenes-ventas/[orden_id]`
- `GET /api/ordenes-ventas/[orden_id]/estado`
- `PATCH /api/ordenes-ventas/[orden_id]/estado-pago`
- `PATCH /api/ordenes-ventas/[orden_id]/estado-envio`
- `PATCH /api/ordenes/[orden_id]/liquidacion-vendedor`

La variable esta documentada en `.env.example`:

```env
INTERNAL_API_KEY=
```

Consecuencia importante: si falta el header, o si el valor no coincide, el endpoint devuelve `401`. Si la variable no esta configurada en el servidor, devuelve `500` porque la app no esta preparada para aceptar llamadas internas.

## Validaciones y errores

Las APIs validan:

- sesion, rol o API key segun el tipo de endpoint;
- parametros de URL;
- body JSON;
- estados permitidos;
- pertenencia del recurso;
- existencia del recurso.

Codigos usados:

- `400`: datos invalidos o incompletos.
- `401`: no autenticado o falta API key interna.
- `403`: autenticado, pero sin permiso o sin pertenencia sobre el recurso.
- `404`: recurso no encontrado.
- `500`: error interno del servidor.

Los errores internos de Supabase o Clerk se registran con `console.error`, pero no se devuelven completos al cliente. El cliente recibe mensajes genericos para no exponer informacion sensible.

## Proxy y paginas privadas

El `proxy.ts` protege paginas privadas:

- `/productos`
- `/productos/(.*)`
- `/ventas`
- `/ventas/(.*)`
- `/admin`
- `/admin/(.*)`

Si no hay sesion, redirige a `/sign-in`.

El proxy no bloquea los endpoints publicos ni las llamadas internas con `x-api-key`. Las APIs pasan por el proxy, pero la autorizacion real se decide dentro de cada route handler.

## Diferencia entre UI y seguridad real

La UI puede:

- ocultar links;
- deshabilitar botones;
- mostrar mensajes;
- mejorar la experiencia del usuario.

Pero la seguridad real esta en:

- server components de paginas privadas;
- server actions;
- route handlers;
- validacion de roles;
- validacion de pertenencia por `clerk_user_id`;
- validacion de `x-api-key` para llamadas internas.

Si alguien llama una API manualmente desde Postman o desde otro cliente, igual debe pasar esas validaciones.

## Flujos importantes

### Crear o editar producto

1. El vendedor inicia sesion con Clerk.
2. El servidor obtiene `userId`.
3. Se exige rol `vendedor`.
4. Se valida que el vendedor este activo.
5. Al crear, se guarda `clerk_user_id = userId`.
6. Al editar, se consulta el producto y se verifica que pertenezca a ese `userId`.

### Despachar orden

1. El vendedor inicia sesion.
2. Se exige rol `vendedor`.
3. Se verifica vendedor activo.
4. Se busca la orden.
5. Se valida que la orden tenga items de productos del vendedor.
6. Si no pertenece al vendedor, se devuelve `403`.
7. Si corresponde, se llama a Shipping y se actualiza el estado de envio.

### Crear orden desde Buyer

1. Buyer llama a Seller desde servidor.
2. Envia `x-api-key`.
3. Seller valida la API key interna.
4. Seller valida body, productos y precios.
5. Seller crea la orden y sus items.
6. Seller marca los productos como `vendida`.

### Actualizar pago o envio

1. Payments o Shipping llama a Seller desde servidor.
2. Envia `x-api-key`.
3. Seller valida la API key interna.
4. Seller valida el estado recibido.
5. Seller actualiza la orden.
6. El `estado_general` puede derivarse por logica de base de datos si existe un trigger.

