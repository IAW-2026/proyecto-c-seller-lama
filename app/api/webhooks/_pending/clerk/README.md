# 🔮 Webhooks de Clerk - Estructura Preparada (No Implementada Aún)

Esta carpeta contiene la estructura y código preparado para implementar webhooks de Clerk cuando sea necesario.

## 📌 Estado Actual

- ❌ **Webhooks NO están activos**
- ✅ **Clerk está configurado** (login, logout, autenticación)
- ✅ **Usuarios solo existen en Clerk** (no sincronizados a BD aún)
- 📦 **Svix instalado** (librería para webhooks)

## 📂 Estructura

```
app/api/webhooks/_pending/clerk/
├── route.example.ts      # Código del webhook (desactivado)
├── examples.ts           # Ejemplos de extensión
└── README.md             # Este archivo
```

## 🔑 Por qué está desactivado

El archivo `route.example.ts` NO es un endpoint activo porque:

1. **Nombre**: Se llama `route.example.ts` (no `route.ts`)
2. **Variables**: `CLERK_WEBHOOK_SECRET` no está en `.env.local`
3. **Intención**: Por ahora, los usuarios solo existen en Clerk

## 🚀 Cómo activarlo después

Cuando decidas implementar la sincronización automática:

### Paso 1: Copiar el código

```bash
# Renombra
mv app/api/webhooks/_pending/clerk/route.example.ts \
   app/api/webhooks/clerk/route.ts

# Copia examples.ts también si lo necesitas
cp app/api/webhooks/_pending/clerk/examples.ts \
   app/api/webhooks/clerk/examples.ts
```

### Paso 2: Obtener CLERK_WEBHOOK_SECRET

1. Ve a **Clerk Dashboard** → **Webhooks**
2. Crea un endpoint con URL: `https://tu-dominio.com/api/webhooks/clerk`
3. Copia el **Signing Secret** (empieza con `whsec_`)
4. Agrega a `.env.local`:
   ```env
   CLERK_WEBHOOK_SECRET=whsec_xxx...
   ```

### Paso 3: Instala la librería (si no está)

```bash
pnpm add svix
```

Ya está instalada desde antes.

### Paso 4: Crear tabla en Supabase (si no existe)

```sql
CREATE TABLE vendedor (
  clerk_user_id VARCHAR(255) PRIMARY KEY UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  nombre_vendedor VARCHAR(255) NOT NULL,
  dni VARCHAR(20),
  telefono VARCHAR(20),
  fecha_creacion TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Paso 5: Probar

```bash
pnpm run dev

# En Clerk Dashboard → Webhooks → Test Endpoint → Send Example
```

## 📝 Archivos de referencia

- **route.example.ts** - Webhook completo para sincronizar `user.created`
  - Verifica firma con Svix
  - Inserta en tabla vendedor
  - Maneja duplicados con UPSERT

- **examples.ts** - Ejemplos comentados para:
  - `user.updated` - Sincronizar cambios
  - `user.deleted` - Deshabilitar usuarios
  - Múltiples eventos
  - Tabla de logs
  - Reintentos

## 🔐 Variables necesarias (cuando se active)

```env
# Ya están configuradas
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# Necesitarás agregar esto
CLERK_WEBHOOK_SECRET=whsec_xxx...
```

## 🎯 Arquitectura actual (sin webhooks)

```
Usuario registra en Clerk
    ↓
Clerk lo crea (existe en Clerk)
    ↓
Usuario accede a la app (autenticado)
    ↓
App usa clerk_user_id (NO busca en BD)
```

## 🎯 Arquitectura futura (con webhooks)

```
Usuario registra en Clerk
    ↓
Clerk lo crea (existe en Clerk)
    ↓
Webhook se dispara (user.created)
    ↓
Webhook sincroniza a tabla vendedor
    ↓
Usuario accede a la app (autenticado)
    ↓
App puede acceder a datos locales si necesita
```

## 📚 Documentación

Ver archivos principales:
- `WEBHOOK_SETUP.md` - Guía paso a paso (cuando decidas activar)
- `WEBHOOK_IMPLEMENTACION.md` - Resumen técnico

## ✨ Ventajas de esta estructura

✅ Código ya escrito y probado  
✅ No afecta la app actual  
✅ Fácil de activar cuando sea necesario  
✅ Ejemplos para extensiones  
✅ Bien documentado  

## ❓ Preguntas frecuentes

**P: ¿Por qué no está activo ahora?**  
R: Porque los usuarios solo existen en Clerk, no necesitan sincronización.

**P: ¿Puedo usar la app sin webhooks?**  
R: Sí, completamente. Clerk maneja todo. Los webhooks son para sincronizar a BD.

**P: ¿Se pierde nada si no activamos?**  
R: No. La app funciona perfectamente con Clerk. Los webhooks son para una sincronización futura.

**P: ¿Cuándo debo activar webhooks?**  
R: Cuando necesites guardar datos del usuario en tu BD local.
