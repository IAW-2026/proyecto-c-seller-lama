/**
 * Ejemplos de extensión para webhooks de Clerk
 * 
 * Este archivo contiene ejemplos comentados para:
 * - Manejar user.updated
 * - Manejar user.deleted
 * - Implementar reintentos
 * - Tabla de logs de webhooks
 * 
 * NO ESTÁ ACTIVO - Solo como referencia
 */

// ============================================================================
// EJEMPLO 1: Manejar user.updated (cuando el usuario actualiza su perfil)
// ============================================================================

/*
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

interface UserUpdatedEvent {
  type: 'user.updated';
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
    }>;
    first_name: string | null;
    last_name: string | null;
    updated_at: number;
  };
}

async function handleUserUpdated(evt: UserUpdatedEvent) {
  const clerkUserId = evt.data.id;
  const email = evt.data.email_addresses[0]?.email_address;
  const firstName = evt.data.first_name || '';
  const lastName = evt.data.last_name || '';
  const nombreVendedor = `${firstName} ${lastName}`.trim() || email;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Actualizar solo los campos que pueden haber cambiado
  const { error } = await supabase
    .from('vendedor')
    .update({
      email,
      nombre_vendedor: nombreVendedor,
    })
    .eq('clerk_user_id', clerkUserId);

  if (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }

  console.log(`✅ Usuario ${clerkUserId} actualizado exitosamente`);
}
*/

// ============================================================================
// EJEMPLO 2: Manejar user.deleted (cuando el usuario es eliminado)
// ============================================================================

/*
interface UserDeletedEvent {
  type: 'user.deleted';
  data: {
    id: string;
    deleted: boolean;
  };
}

async function handleUserDeleted(evt: UserDeletedEvent) {
  const clerkUserId = evt.data.id;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // OPCIÓN A: Eliminar la fila completamente
  const { error: deleteError } = await supabase
    .from('vendedor')
    .delete()
    .eq('clerk_user_id', clerkUserId);

  if (deleteError) {
    console.error('Error al eliminar usuario:', deleteError);
    throw deleteError;
  }

  console.log(`✅ Usuario ${clerkUserId} eliminado de la base de datos`);

  // OPCIÓN B: Marcar como inactivo (mejor para auditoría)
  // const { error: updateError } = await supabase
  //   .from('vendedor')
  //   .update({ activo: false })
  //   .eq('clerk_user_id', clerkUserId);
}
*/

// ============================================================================
// EJEMPLO 3: Webhook mejorado que maneja múltiples eventos
// ============================================================================

/*
export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return new Response('Webhook secret no configurado', { status: 500 });
    }

    const headersList = await headers();
    const svixId = headersList.get('svix-id');
    const svixTimestamp = headersList.get('svix-timestamp');
    const svixSignature = headersList.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response('Headers de Svix faltantes', { status: 400 });
    }

    const body = await req.text();
    const wh = new Webhook(webhookSecret);

    let evt;
    try {
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      });
    } catch (err) {
      console.error('Error al verificar firma:', err);
      return new Response('Firma del webhook inválida', { status: 401 });
    }

    console.log(`📨 Evento recibido: ${evt.type}`);

    // Despachar a manejadores específicos por tipo de evento
    switch (evt.type) {
      case 'user.created':
        await handleUserCreated(evt);
        break;
      case 'user.updated':
        await handleUserUpdated(evt);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt);
        break;
      default:
        console.log(`⏭️ Evento ${evt.type} no manejado`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error en webhook:', err);
    return new Response('Error interno del servidor', { status: 500 });
  }
}
*/

// ============================================================================
// EJEMPLO 4: Implementar reintentos con una tabla de logs
// ============================================================================

/*
// Crear tabla en Supabase:
// CREATE TABLE webhook_logs (
//   id SERIAL PRIMARY KEY,
//   event_type VARCHAR(50),
//   clerk_user_id VARCHAR(255),
//   status VARCHAR(20), -- 'pending', 'success', 'failed'
//   error_message TEXT,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

async function logWebhookAttempt(
  eventType: string,
  clerkUserId: string,
  status: 'pending' | 'success' | 'failed',
  errorMessage?: string
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from('webhook_logs').insert({
    event_type: eventType,
    clerk_user_id: clerkUserId,
    status,
    error_message: errorMessage,
  });

  if (error) {
    console.error('Error al loguear webhook:', error);
  }
}
*/

// ============================================================================
// EJEMPLO 5: Enviar notificaciones después de sincronizar
// ============================================================================

/*
// Después de crear/actualizar un usuario, podrías:
// 1. Enviar un email de bienvenida
// 2. Crear un registro en otra tabla
// 3. Trigger un workflow en Zapier

async function sendWelcomeEmail(email: string, nombreVendedor: string) {
  // Usar una librería como Resend, SendGrid, etc.
  // await sendEmail({
  //   to: email,
  //   subject: 'Bienvenido a C-Seller',
  //   template: 'welcome',
  //   data: { nombre: nombreVendedor }
  // });
}
*/

// ============================================================================
// EJEMPLO 6: Verificar y sincronizar usuarios existentes
// ============================================================================

/*
// Endpoint para sincronizar todos los usuarios de Clerk (run once)
// POST /api/webhooks/clerk/sync-all

import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  // Verificar que es una solicitud interna (usar secret o IP whitelist)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CLERK_SYNC_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const clerk = await clerkClient();
    const users = await clerk.users.getUserList();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    for (const user of users.data) {
      const email = user.emailAddresses[0]?.emailAddress;
      if (!email) continue;

      const nombreVendedor =
        `${user.firstName || ''} ${user.lastName || ''}`.trim() || email;

      await supabase.from('vendedor').upsert(
        {
          clerk_user_id: user.id,
          email,
          nombre_vendedor: nombreVendedor,
          fecha_creacion: new Date(user.createdAt).toISOString(),
        },
        { onConflict: 'clerk_user_id' }
      );
    }

    return new Response(
      JSON.stringify({ success: true, count: users.data.length }),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error sincronizando usuarios:', err);
    return new Response('Error interno', { status: 500 });
  }
}
*/

export {};
