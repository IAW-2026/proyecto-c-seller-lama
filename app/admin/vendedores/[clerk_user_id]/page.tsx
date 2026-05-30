import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { requireSuperAdmin } from '@/lib/auth/roles';
import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { VendedorEditForm } from '@/components/admin/VendedorEditForm';
import type { Vendedor } from '@/types';

interface Props {
  params: Promise<{ clerk_user_id: string }>;
}

export default async function VendedorEditPage({ params }: Props) {
  await requireSuperAdmin();

  const { clerk_user_id } = await params;

  const { data: vendedor, error } = await supabase
    .from('vendedor')
    .select('*')
    .eq('clerk_user_id', clerk_user_id)
    .single();

  if (error || !vendedor) {
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
              {error ? `Error: ${error.message}` : 'Vendedor no encontrado'}
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
            title="Editar vendedor"
            description="Actualiza la información del vendedor"
          />

          <VendedorEditForm vendedor={vendedor as Vendedor} />
        </div>
      </PageContainer>
    </main>
  );
}
