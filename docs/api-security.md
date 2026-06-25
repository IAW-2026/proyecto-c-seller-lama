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
- `requireServiceApiKey(request, allowedServices)`: valida llamadas internas entre apps usando API keys internas.
- `requireInternalApiKey(request)`: valida llamadas internas exclusivas de Control Plane usando la misma estrategia de API key interna.
- `jsonError(message, status)`: devuelve errores JSON con formato consistente.

Tambien existe `lib/api-auth.ts`, que reexporta esos helpers para mantener el estilo de imports del proyecto.

## APIs internas entre apps

Las aplicaciones externas del marketplace deben autenticarse como servicio.

Estas keys son secretos de servidor. No deben enviarse desde componentes client-side ni quedar expuestas en el navegador.

Headers recomendados:

```http
x-service-name: buyer | shipping | payments | control-plane | analytics
x-api-key: <key correspondiente al servicio>
```

Por compatibilidad, tambien se acepta enviar solo la key en cualquiera de estos headers:

```http
x-api-key: <key>
X-Internal-Api-Key: <key>
Authorization: Bearer <key>
```

Si no se envia `x-service-name`, la API infiere el servicio comparando la key recibida contra las variables de entorno permitidas para ese endpoint. Por ejemplo, `ANALYTICS_API_KEY` puede consultar `GET /api/productos` y `GET /api/ordenes-ventas`, pero no puede crear ordenes con `POST /api/ordenes-ventas`.

Variables de entorno:

```env
BUYER_API_KEY=
SHIPPING_API_KEY=
PAYMENTS_API_KEY=
CONTROL_PLANE_API_KEY=
ANALYTICS_API_KEY=
SELLER_API_KEY=
INTERNAL_API_KEY=
BUYER_API_URL=
SHIPPING_API_URL=
PAYMENTS_API_URL=
```

`SHIPPING_APP_URL` se mantiene como alias legacy para despliegues existentes,
pero la variable preferida para nuevas configuraciones es `SHIPPING_API_URL`.

Reglas aplicadas por `requireServiceApiKey(request, allowedServices)`:

- devuelve `401` si falta una API key interna;
- devuelve `401` si `x-service-name` no corresponde a un servicio conocido;
- devuelve `403` si el servicio existe, pero no esta permitido para ese endpoint;
- devuelve `500` si falta configurar la variable de entorno del servicio indicado, o si no hay ninguna key configurada para los servicios permitidos cuando se intenta inferir el servicio;
- compara la key recibida contra la key esperada usando hash SHA-256 y `timingSafeEqual`.

## Llamadas salientes desde Seller

Las llamadas server-to-server salientes se centralizan en
`lib/internal-api-client.ts`.

Helpers disponibles:

- `callShippingApi(path, init)`: usa `SHIPPING_API_URL` y una key saliente.
- `callPaymentsApi(path, init)`: usa `PAYMENTS_API_URL` y una key saliente.
- `callBuyerApi(path, init)`: usa `BUYER_API_URL` y una key saliente.

Para llamadas salientes, Seller se identifica preferentemente con
`SELLER_API_KEY`. Si el ecosistema usa una clave compartida, se puede usar
`INTERNAL_API_KEY`. Como compatibilidad con el esquema anterior, cada helper
puede caer a la key del destino (`SHIPPING_API_KEY`, `PAYMENTS_API_KEY` o
`BUYER_API_KEY`) si no existe una key saliente de Seller configurada.

El helper agrega `x-api-key` automaticamente, aplica timeout por defecto de 10
segundos y registra errores con servicio, endpoint, status HTTP y mensaje. Nunca
registra el valor de la API key.

## Permisos por endpoint

### Catalogo entre apps

Estos endpoints exponen datos de catalogo filtrados para consumo entre aplicaciones. Los productos se filtran por `estado_publicacion = 'activa'`.

| Endpoint | Metodo | Servicios permitidos |
| --- | --- | --- |
| `/api/productos` | `GET` | `buyer`, `control-plane`, `analytics` |
| `/api/productos/[producto_id]` | `GET` | `buyer`, `control-plane`, `analytics` |
| `/api/productos/bulk` | `GET` | `buyer`, `control-plane`, `analytics` |
| `/api/categorias-productos` | `GET` | `buyer`, `control-plane`, `analytics` |
| `/api/vendedores` | `GET` | `buyer`, `control-plane`, `analytics` |
| `/api/vendedores/[clerk_user_id]` | `PATCH` | `control-plane` |
| `/api/vendedores/[clerk_user_id]/estado` | `PATCH` | `control-plane` |

### Ordenes entre apps

| Endpoint | Metodo | Servicios permitidos |
| --- | --- | --- |
| `/api/ordenes-ventas` | `GET` | `buyer`, `control-plane`, `analytics` |
| `/api/ordenes-ventas` | `POST` | `buyer` |
| `/api/ordenes-ventas/[orden_id]` | `GET` | `buyer`, `shipping`, `payments`, `control-plane`, `analytics` |
| `/api/ordenes-ventas/[orden_id]/estado` | `GET` | `buyer`, `shipping`, `payments`, `control-plane`, `analytics` |
| `/api/ordenes-ventas/[orden_id]/estado-pago` | `PATCH` | `payments` |
| `/api/ordenes-ventas/[orden_id]/estado-envio` | `PATCH` | `shipping` |
| `/api/ordenes/[orden_id]/liquidacion-vendedor` | `PATCH` | `payments` |

## Endpoints de vendedor

Estos endpoints requieren sesion y rol `vendedor`:

- `POST /api/ordenes/[orden_id]/despachar`
- `GET /api/ordenes/[orden_id]/envio`

Ademas, las server actions de productos tambien validan vendedor:

- crear producto;
- editar producto;
- eliminar producto;
- crear categoria desde el formulario de producto.

Reglas aplicadas:

- se obtiene el `userId` desde Clerk;
- no se confia en un `clerk_user_id` enviado por el cliente;
- las consultas se filtran por el vendedor dueno del recurso;
- si el recurso existe pero pertenece a otro vendedor, se devuelve `403`;
- si el vendedor esta inactivo, no puede operar.

## Acciones de administrador

Las acciones administrativas requieren rol `super_admin`.

Acciones protegidas:

- eliminar producto;
- eliminar orden;
- desactivar vendedor;
- activar vendedor;
- editar vendedor;
- editar producto desde admin;
- editar orden.

El administrador puede operar globalmente, por eso no se filtra por `clerk_user_id` del vendedor. La validacion clave es el rol `super_admin`.

## Validaciones y errores

Las APIs validan:

- sesion, rol o API key de servicio segun el tipo de endpoint;
- parametros de URL;
- body JSON;
- estados permitidos;
- pertenencia del recurso;
- existencia del recurso.

Codigos usados:

- `400`: datos invalidos o incompletos.
- `401`: no autenticado o falta credencial interna.
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

El proxy no bloquea los endpoints entre apps. Las APIs pasan por el proxy, pero la autorizacion real se decide dentro de cada route handler.

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
- validacion de `x-service-name` y `x-api-key` para llamadas internas.

Si alguien llama una API manualmente desde Postman o desde otro cliente, igual debe pasar esas validaciones.

## Ejemplos curl

Listar productos desde Buyer:

```bash
curl -H "x-api-key: $BUYER_API_KEY" \
  "https://proyecto-c-seller-lama.vercel.app/api/productos"
```

Listar productos desde Control Plane incluyendo todos los estados:

```bash
curl -H "x-api-key: $CONTROL_PLANE_API_KEY" \
  "https://proyecto-c-seller-lama.vercel.app/api/productos?include_all_statuses=true"
```

Crear orden desde Buyer:

```bash
curl -X POST "https://proyecto-c-seller-lama.vercel.app/api/ordenes-ventas" \
  -H "content-type: application/json" \
  -H "x-api-key: $BUYER_API_KEY" \
  -d '{"orden_id":"ORD-123","comprador_id":"user_123","items":[{"producto_id":"producto_123","precio_unitario":1000}],"precio_total":1000,"direccion_envio":"Calle 123"}'
```

Actualizar estado de envio desde Shipping:

```bash
curl -X PATCH "https://proyecto-c-seller-lama.vercel.app/api/ordenes-ventas/ORD-123/estado-envio" \
  -H "content-type: application/json" \
  -H "x-api-key: $SHIPPING_API_KEY" \
  -d '{"estado_envio":"despachado","envio_id":"ENV-123","codigo_seguimiento":"TRACK-123"}'
```

Actualizar estado de pago desde Payments:

```bash
curl -X PATCH "https://proyecto-c-seller-lama.vercel.app/api/ordenes-ventas/ORD-123/estado-pago" \
  -H "content-type: application/json" \
  -H "x-api-key: $PAYMENTS_API_KEY" \
  -d '{"estado_pago":"aprobado","pago_id":"PAY-123"}'
```

Listar vendedores desde Analytics:

```bash
curl -H "x-api-key: $ANALYTICS_API_KEY" \
  "https://proyecto-c-seller-lama.vercel.app/api/vendedores?page=1&pageSize=10"
```

La respuesta incluye vendedores activos e inactivos. `vendedor_id` se mantiene como alias de `clerk_user_id` para compatibilidad.

```json
{
  "items": [
    {
      "clerk_user_id": "user_123",
      "vendedor_id": "user_123",
      "nombre_vendedor": "Nombre del vendedor",
      "dni": "12345678",
      "email": "seller@example.com",
      "telefono": "1122334455",
      "activo": true
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10
}
```

Activar o desactivar vendedor desde Control Plane:

```bash
curl -X PATCH "https://proyecto-c-seller-lama.vercel.app/api/vendedores/user_123/estado" \
  -H "content-type: application/json" \
  -H "x-api-key: $CONTROL_PLANE_API_KEY" \
  -d '{"activo":false}'
```

Respuesta:

```json
{
  "clerk_user_id": "user_123",
  "nombre_vendedor": "Nombre del vendedor",
  "activo": false
}
```

Editar datos de vendedor desde Control Plane:

```bash
curl -X PATCH "https://proyecto-c-seller-lama.vercel.app/api/vendedores/user_123" \
  -H "content-type: application/json" \
  -H "x-api-key: $CONTROL_PLANE_API_KEY" \
  -d '{"nombre_vendedor":"Nombre actualizado","email":"seller@example.com","activo":true}'
```
