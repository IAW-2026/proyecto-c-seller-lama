# Seguridad de APIs

Este documento resume como se protegen las APIs de Seller App.

La regla principal es separar autenticacion humana de autenticacion app-to-app. Ocultar links o botones en la UI mejora la experiencia, pero no protege datos ni mutaciones. La proteccion real vive en route handlers, server actions, server components y `proxy.ts`.

## Modelo de autenticacion

Usuarios humanos:

- Usan sesion de Clerk.
- Los roles se leen desde `publicMetadata.roles`.
- Roles actuales: `vendedor` y `super_admin`.
- Los helpers principales son `requireAuthUser()`, `requireRole()`, `requireVendedor()` y `requireSuperAdmin()`.

Comunicacion app-to-app:

- Usa Clerk Machine-to-Machine con JWT.
- Cada llamada interna debe enviar `Authorization: Bearer <m2m_jwt>`.
- Seller valida el JWT con `verifyToken` del SDK oficial de Clerk, exportado por `@clerk/nextjs/server`.
- El token debe tener un `sub` de maquina de Clerk, con prefijo `mch_`.
- Seller mapea ese `sub` contra las variables `CLERK_M2M_*_MACHINE_ID`.
- `x-api-key` propio fue eliminado de los route handlers internos.

Lectura publica:

- El catalogo publico queda abierto para Buyer, SEO y navegacion anonima.
- Estos endpoints solo devuelven datos publicables, por ejemplo productos con `estado_publicacion = 'activa'`.
- Si mas adelante se decide cerrar catalogo entre apps, se puede cambiar a `requireHumanOrM2M()` sin tocar la logica de filtros/paginacion.

## Helpers

Los helpers estan en `src/lib/api-auth.ts` y se reexportan desde `lib/api-auth.ts`.

- `jsonError(message, status)`: respuesta JSON consistente.
- `requireM2M(request)`: exige `Authorization: Bearer`, valida el JWT de Clerk y exige sujeto de maquina `mch_`.
- `requireM2MFrom(request, allowedMachines)`: valida M2M y ademas exige que la maquina este permitida.
- `requireHumanOrM2M(request, options)`: acepta sesion humana o M2M, util para endpoints mixtos futuros.

`requireM2MFrom()` acepta nombres logicos (`buyer`, `shipping`, `payments`, `control_plane`, `analytics`) o IDs directos `mch_...`. Para nombres logicos, el ID real viene del entorno.

Si `CLERK_JWT_KEY` esta configurado, la validacion de firma puede ser local. Si no esta configurado, `verifyToken` usa `CLERK_SECRET_KEY` y puede consultar JWKS de Clerk segun el comportamiento del SDK. En produccion se recomienda configurar `CLERK_JWT_KEY` y usar M2M JWT de corta vida.

Esta implementacion esta enfocada en M2M JWT. No acepta tokens M2M opacos (`mt_...`) en `Authorization`; si se eligen tokens opacos, hay que cambiar a la verificacion online de Clerk para machine tokens.

## Matriz de endpoints

| Endpoint | Uso | Proteccion |
| --- | --- | --- |
| `GET /api/productos` | Catalogo publico con filtros y paginacion | Publico |
| `GET /api/productos/[producto_id]` | Detalle publico de producto activo | Publico |
| `GET /api/productos/bulk` | Lectura publica por IDs de productos activos | Publico |
| `GET /api/categorias-productos` | Categorias publicas | Publico |
| `GET /api/vendedores` | Vendedores activos para filtros/listados publicos | Publico |
| `POST /api/webhooks/clerk` | Webhook de Clerk | Firma Svix con `CLERK_WEBHOOK_SECRET` |
| `POST /api/ordenes/[orden_id]/despachar` | Accion del vendedor autenticado | Clerk session + rol `vendedor` |
| `GET /api/ordenes/[orden_id]/envio` | Consulta de envio desde pantalla de vendedor | Clerk session + rol `vendedor` |
| `GET /api/ordenes-ventas` | Buyer lista ordenes; Control Plane lee globalmente | M2M: `buyer`, `control_plane` |
| `POST /api/ordenes-ventas` | Buyer crea orden | M2M: `buyer` |
| `GET /api/ordenes-ventas/[orden_id]` | Buyer/Control Plane consultan detalle | M2M: `buyer`, `control_plane` |
| `GET /api/ordenes-ventas/[orden_id]/estado` | Estado para Buyer, Shipping, Payments o Control Plane | M2M: `buyer`, `shipping`, `payments`, `control_plane` |
| `PATCH /api/ordenes-ventas/[orden_id]/estado-pago` | Payments actualiza pago | M2M: `payments` |
| `PATCH /api/ordenes-ventas/[orden_id]/estado-envio` | Shipping actualiza envio | M2M: `shipping` |
| `PATCH /api/ordenes/[orden_id]/liquidacion-vendedor` | Control Plane registra liquidacion | M2M: `control_plane` |

Analytics no tiene hoy un endpoint interno dedicado en Seller App. Puede leer los endpoints publicos de catalogo como cualquier cliente. Si necesita metricas de ordenes, conviene crear un endpoint especifico que devuelva datos agregados o listados minimos y protegerlo con `requireM2MFrom(request, ['analytics'])`.

## Variables de entorno

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
CLERK_JWT_KEY=
CLERK_AUTHORIZED_PARTIES=

CLERK_M2M_BUYER_MACHINE_ID=
CLERK_M2M_SHIPPING_MACHINE_ID=
CLERK_M2M_PAYMENTS_MACHINE_ID=
CLERK_M2M_CONTROL_PLANE_MACHINE_ID=
CLERK_M2M_ANALYTICS_MACHINE_ID=
```

`CLERK_JWT_KEY` es el PEM public key de Clerk para verificacion local. Si se guarda en un `.env`, puede usar saltos de linea escapados como `\n`.

`CLERK_AUTHORIZED_PARTIES` es opcional. Usarlo solo si los tokens incluyen `azp` y se quiere validar una lista de origenes/parties esperadas, separados por coma.

## Configuracion en Clerk

1. Crear una machine por app consumidora: Buyer, Shipping, Payments, Control Plane y Analytics.
2. Crear o identificar la machine de Seller App como recurso receptor.
3. Configurar en Clerk que cada machine llamadora tenga scope/acceso hacia Seller App segun corresponda.
4. Emitir tokens M2M en formato `jwt` para las apps llamadoras, con TTL corto.
5. Copiar los IDs `mch_...` de cada machine llamadora en las variables `CLERK_M2M_*_MACHINE_ID` de Seller.
6. Configurar `CLERK_JWT_KEY` en Seller para validar M2M JWT localmente cuando sea posible.
7. Rotar/revocar tokens desde Clerk; no crear secretos compartidos propios en Seller.

## Ejemplos

Crear orden desde Buyer:

```bash
curl -X POST "https://seller.example.com/api/ordenes-ventas" \
  -H "Authorization: Bearer $BUYER_M2M_JWT" \
  -H "Content-Type: application/json" \
  -d '{"orden_id":"ord_123","comprador_id":"user_123","items":[{"producto_id":"prod_1","precio_unitario":100}],"precio_total":100,"direccion_envio":"Calle 123"}'
```

Actualizar estado de pago desde Payments:

```bash
curl -X PATCH "https://seller.example.com/api/ordenes-ventas/ord_123/estado-pago" \
  -H "Authorization: Bearer $PAYMENTS_M2M_JWT" \
  -H "Content-Type: application/json" \
  -d '{"estado_pago":"aprobado","pago_id":"pay_123"}'
```

Actualizar estado de envio desde Shipping:

```bash
curl -X PATCH "https://seller.example.com/api/ordenes-ventas/ord_123/estado-envio" \
  -H "Authorization: Bearer $SHIPPING_M2M_JWT" \
  -H "Content-Type: application/json" \
  -d '{"estado_envio":"despachado","codigo_seguimiento":"TRACK123"}'
```

## Errores

- `401`: falta `Authorization: Bearer`, el header esta mal formado o el token no valida.
- `403`: el token es valido, pero no es una machine permitida para ese endpoint, o el usuario humano no tiene rol suficiente.
- `400`: parametros o body invalidos.
- `404`: recurso inexistente.
- `500`: configuracion faltante o error interno.

Los detalles de Clerk, Supabase o fallas internas se registran en servidor con `console.error`, pero no se devuelven al cliente.

## Por que se elimina x-api-key

Una API key propia compartida no identifica que app llama, no permite permisos por caller, se rota con mas friccion y suele terminar copiada en varios servicios. Clerk M2M da identidad por machine, tokens con expiracion, revocacion centralizada y validacion estandar con JWT.

Mantener `x-api-key` solo como fallback temporal seria menos granular. En esta version los endpoints internos ya no lo aceptan.
