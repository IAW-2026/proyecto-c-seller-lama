import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

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

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'CLERK_WEBHOOK_SECRET no configurado' },
      { status: 500 }
    );
  }

  const headerList = headers();
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
  } catch (error) {
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
  const fechaCreacion = new Date(event.data.created_at).toISOString();

  if (!email) {
    return NextResponse.json(
      { error: 'Usuario sin email' },
      { status: 400 }
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
        fecha_creacion: fechaCreacion,
      },
      { onConflict: 'clerk_user_id' }
    );

  if (error) {
    return NextResponse.json(
      { error: 'Error al sincronizar vendedor' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
