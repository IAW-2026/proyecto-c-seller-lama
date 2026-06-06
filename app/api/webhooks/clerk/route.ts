import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

type ClerkUserCreatedEvent = {
  type: 'user.created';
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name: string | null;
    last_name: string | null;
    created_at: number;
  };
};

export const runtime = 'nodejs';

/*Endpoint para manejar webhooks de Clerk, específicamente para la creación de usuarios y asignarles el rol de vendedor */
export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'CLERK_WEBHOOK_SECRET no configurado' },
      { status: 500 }
    );
  }

  const headerList = await headers();
  const svixId = headerList.get('svix-id');
  const svixTimestamp = headerList.get('svix-timestamp');
  const svixSignature = headerList.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: 'Headers de Svix faltantes' },
      { status: 400 }
    );
  }

  const body = await req.text();
  const webhook = new Webhook(webhookSecret);

  let event: ClerkUserCreatedEvent;
  try {
    event = webhook.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkUserCreatedEvent;
  } catch {
    return NextResponse.json(
      { error: 'Firma del webhook invalida' },
      { status: 401 }
    );
  }

  if (event.type !== 'user.created') {
    return NextResponse.json(
      { received: true, ignored: event.type },
      { status: 200 }
    );
  }

  const clerkUserId = event.data.id;
  const email = event.data.email_addresses[0]?.email_address;
  const firstName = event.data.first_name ?? '';
  const lastName = event.data.last_name ?? '';
  const nombreVendedor = `${firstName} ${lastName}`.trim() || email || 'Sin nombre';

  if (!email) {
    return NextResponse.json(
      { error: 'Usuario sin email' },
      { status: 400 }
    );
  }
  //asignar rol de vendedor al nuevo usuario en Clerk
  const client = await clerkClient();

  try {
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        roles: ['vendedor'],
      },
    });
  } catch (error) {
    console.error('Error al asignar rol vendedor en Clerk', error);
    return NextResponse.json(
      { error: 'No se pudo asignar el rol vendedor' },
      { status: 500 }
    );
  }

  const { error } = await supabaseAdmin
    .from('vendedor')
    .upsert(
      {
        clerk_user_id: clerkUserId,
        email,
        nombre_vendedor: nombreVendedor,
        telefono: null,
        activo: true,
      },
      { onConflict: 'clerk_user_id' }
    );

  if (error) {
    console.error('Error al crear vendedor desde webhook Clerk', error);
    return NextResponse.json(
      { error: 'No se pudo crear el vendedor' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
