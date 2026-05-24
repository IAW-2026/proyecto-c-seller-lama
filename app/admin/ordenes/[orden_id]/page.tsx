import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { requireSuperAdmin } from '@/lib/auth/roles';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { OrdenEditForm } from '@/components/admin/OrdenEditForm';
import type { Orden } from '@/types';

interface Props {
  params: Promise<{ orden_id: string }>;
}

export default async function OrdenEditPage({ params }: Props) {
  await requireSuperAdmin();

  const { orden_id } = await params;

  const { data: orden, error } = await supabase
    .from('orden')
    .select('*')
    .eq('orden_id', orden_id)
    .single();

  if (error || !orden) {
    return (
      <main className="min-h-screen bg-[#f6f1e7] pt-[56px]">
        <PageContainer>
          <div className="py-8 md:py-12">
            <Link
              href="/admin"
              className="text-[#6f7f6d] hover:text-[#37413d] text-sm font-medium mb-6 inline-block transition"
            >
              ← Volver al panel
            </Link>

            <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] p-6 text-[#37413d]">
              {error ? `Error: ${error.message}` : 'Orden no encontrada'}
            </div>
          </div>
        </PageContainer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1e7] pt-[56px]">
      <PageContainer>
        <div className="py-8 md:py-12">
          <PageHeader
            title="Editar orden"
            description={`Orden #${orden.nro_orden}`}
          />

          <OrdenEditForm orden={orden as Orden} />
        </div>
      </PageContainer>
    </main>
  );
}
