/**
 * WEBHOOK DE CLERK - NO IMPLEMENTADO AÚN
 * 
 * Este archivo contiene el código para sincronizar usuarios de Clerk a Supabase.
 * 
 * ❌ POR AHORA ESTÁ DESACTIVADO (nombre: route.example.ts)
 * ✅ Para activar: renombra a route.ts y agrega CLERK_WEBHOOK_SECRET a .env.local
 * 
 * IMPLEMENTACIÓN FUTURA:
 * - Cuando se active, sincronizará users de Clerk a tabla "vendedor"
 * - Eventos: user.created, user.updated (opcional), user.deleted (opcional)
 */

import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

/**
 * Tipos para los eventos de Clerk
 */
interface UserCreatedEvent {
  type: 'user.created';
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
    }>;
    first_name: string | null;
    last_name: string | null;
    created_at: number;
  };
}

/**
 * Crea un cliente Supabase con la Service Role Key (solo lado servidor)
 * 
 * NOTA: La Service Role Key es sensible y se usa SOLO en el servidor.
 * Nunca la expongas al cliente.
 */
function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Variables de entorno de Supabase no están configuradas en el servidor'
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * POST /api/webhooks/clerk
 * 
 * IMPORTANTE: Este endpoint solo está activo si renombras este archivo a route.ts
 * 
 * Sincroniza usuarios de Clerk a la tabla "vendedor" en Supabase
 * 
 * Flujo:
 * 1. Usuario se registra en Clerk
 * 2. Clerk dispara evento user.created
 * 3. Este endpoint recibe el webhook
 * 4. Se verifica la firma con CLERK_WEBHOOK_SECRET
 * 5. Se crea/actualiza la fila en tabla vendedor
 */
export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('❌ CLERK_WEBHOOK_SECRET no está configurada');
      return new Response('Webhook secret no configurado', { status: 500 });
    }

    // Obtener headers del webhook
    const headersList = await headers();
    const svixId = headersList.get('svix-id');
    const svixTimestamp = headersList.get('svix-timestamp');
    const svixSignature = headersList.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('❌ Headers de Svix no encontrados');
      return new Response('Headers de Svix faltantes', { status: 400 });
    }

    // Obtener el body como texto para verificar la firma
    const body = await req.text();

    // Crear instancia de Webhook y verificar la firma (Svix)
    const wh = new Webhook(webhookSecret);

    let evt: UserCreatedEvent;
    try {
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as UserCreatedEvent;
    } catch (err) {
      console.error('❌ Error al verificar firma del webhook:', err);
      return new Response('Firma del webhook inválida', { status: 401 });
    }

    console.log(`✅ Webhook verificado. Tipo de evento: ${evt.type}`);

    // Procesar solo eventos user.created
    if (evt.type === 'user.created') {
      const clerkUserId = evt.data.id;
      const email = evt.data.email_addresses[0]?.email_address;
      const firstName = evt.data.first_name || '';
      const lastName = evt.data.last_name || '';
      const nombreVendedor = `${firstName} ${lastName}`.trim() || email;
      const fechaCreacion = new Date(evt.data.created_at).toISOString();

      console.log(`📝 Procesando user.created:
        - Clerk User ID: ${clerkUserId}
        - Email: ${email}
        - Nombre: ${nombreVendedor}
        - Fecha: ${fechaCreacion}`);

      if (!email) {
        console.error('❌ El usuario no tiene email');
        return new Response('Usuario sin email', { status: 400 });
      }

      try {
        // Crear cliente de Supabase con Service Role Key
        const supabase = getSupabaseServerClient();

        // Usar UPSERT para manejar duplicados
        // Si el usuario ya existe (mismo clerk_user_id), se actualiza
        const { data, error } = await supabase
          .from('vendedor')
          .upsert(
            {
              clerk_user_id: clerkUserId,
              email,
              nombre_vendedor: nombreVendedor,
              fecha_creacion: fechaCreacion,
            },
            {
              onConflict: 'clerk_user_id', // Campo único para detectar duplicados
            }
          )
          .select();

        if (error) {
          console.error('❌ Error al insertar/actualizar usuario en Supabase:', error);
          return new Response(
            `Error en la base de datos: ${error.message}`,
            { status: 500 }
          );
        }

        console.log('✅ Usuario sincronizado exitosamente en la base de datos', data);
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Usuario sincronizado',
            data,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } catch (dbError) {
        console.error('❌ Error inesperado al procesar usuario:', dbError);
        return new Response(
          'Error interno del servidor',
          { status: 500 }
        );
      }
    }

    // Si el evento no es user.created, simplemente lo ignoramos
    console.log(`⏭️ Evento ${evt.type} ignorado (no es user.created)`);
    return new Response(
      JSON.stringify({
        success: true,
        message: `Evento ${evt.type} recibido pero no procesado`,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('❌ Error no manejado en webhook:', err);
    return new Response('Error interno del servidor', { status: 500 });
  }
}
