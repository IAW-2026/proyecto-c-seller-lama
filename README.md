# Seller App - LAMA Marketplace

## 1. Deploy de producción

https://proyecto-c-seller-lama.vercel.app/

## 2. Usuarios disponibles para pruebas

### Administrador

* Email: super_admin+clerk_test@iaw.com
* Contraseña: iawuser#
* Permisos: acceso completo al panel de administración, gestión de vendedores, productos y órdenes.

### Vendedor
* Email: seller+clerk_test@iaw.com
* Contraseña: iawuser#

* Puede crear una cuenta desde:
  * `/sign-up`
* Luego iniciar sesión desde:
  * `/sign-in`
* Una vez autenticado podrá administrar sus productos y órdenes.


## 3. Instrucciones para evaluación

1. Crear una cuenta de vendedor.
2. Iniciar sesión.
3. Acceder a la sección **Productos** para:

   * Crear productos.
   * Editar productos.
   * Cambiar estado de publicación.
   * Gestionar imágenes.
4. Acceder a la sección **Ventas** para:

   * Visualizar órdenes recibidas.
   * Consultar estados de pago y envío.
   * Despachar pedidos.
5. Acceder a la sección **Administración** (solo administradores) para:

   * Gestionar vendedores.
   * Gestionar productos.
   * Gestionar órdenes.


## 4. Descripción del proyecto

Seller App es la aplicación correspondiente al rol de vendedor dentro del proyecto integrador de Ingeniería de Aplicaciones Web 2026.
La aplicación permite a los vendedores publicar productos, administrar su catálogo, visualizar ventas realizadas y gestionar el ciclo de vida de las órdenes recibidas.

El sistema se integra con otras aplicaciones del ecosistema Marketplace mediante APIs REST, permitiendo la comunicación con Buyer App, Payments App y Shipping App.
La aplicación fue desarrollada utilizando Next.js, TypeScript, Clerk para autenticación, Supabase como base de datos PostgreSQL y desplegada en Vercel.

## 5. Seguridad de APIs

La seguridad de usuarios humanos usa sesiones de Clerk y roles en `publicMetadata.roles`. La comunicacion servidor-a-servidor usa API keys internas por servicio. El header recomendado es `x-api-key`; tambien se aceptan `X-Internal-Api-Key` y `Authorization: Bearer <key>`.

Ver la matriz de endpoints, variables y pasos de configuracion en `docs/api-security.md`.


