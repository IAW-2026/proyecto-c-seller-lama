'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Vendedor } from '@/types';
import { useNotification } from '@/hooks/useNotification';
import { updateVendedor } from '@/actions/adminActions';

interface VendedorEditFormProps {
  vendedor: Vendedor;
}

export function VendedorEditForm({ vendedor }: VendedorEditFormProps) {
  const router = useRouter();
  const notification = useNotification();
  const [isSaving, setIsSaving] = useState(false);

  const [nombre, setNombre] = useState(vendedor.nombre_vendedor);
  const [email, setEmail] = useState(vendedor.email);
  const [telefono, setTelefono] = useState(vendedor.telefono ?? '');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefonoRegex = /^[+\d\s()-]{6,20}$/;

  const handleSave = async () => {
    const nombreValue = nombre.trim();
    const emailValue = email.trim();
    const telefonoValue = telefono.trim();

    if (!nombreValue || !emailValue) {
      notification.showError(
        'Nombre y email son obligatorios.'
      );
      return;
    }

    if (!emailRegex.test(emailValue)) {
      notification.showError('El email no tiene un formato valido.');
      return;
    }

    if (telefonoValue && !telefonoRegex.test(telefonoValue)) {
      notification.showError('El telefono tiene un formato invalido.');
      return;
    }

    setIsSaving(true);

    const result = await updateVendedor({
      clerk_user_id: vendedor.clerk_user_id,
      nombre_vendedor: nombreValue,
      email: emailValue,
      telefono: telefonoValue ? telefonoValue : null,
    });

    if (!result.success) {
      notification.showError(result.message);
      setIsSaving(false);
      return;
    }

    notification.showSuccess(result.message, 3000);
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-[#37413d] mb-6">
        Editar vendedor
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#37413d] mb-2">
            Nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            className="w-full rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm text-[#37413d] outline-none focus:border-[#8fa18d]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#37413d] mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm text-[#37413d] outline-none focus:border-[#8fa18d]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#37413d] mb-2">
            Teléfono
          </label>
          <input
            type="text"
            value={telefono}
            onChange={(event) => setTelefono(event.target.value)}
            className="w-full rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm text-[#37413d] outline-none focus:border-[#8fa18d]"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg border border-[#8fa18d] bg-[#8fa18d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7e937c] disabled:opacity-60"
        >
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="rounded-lg border border-[#d8cfbd] bg-white px-4 py-2 text-sm font-semibold text-[#37413d] transition hover:bg-[#f6f1e7]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
