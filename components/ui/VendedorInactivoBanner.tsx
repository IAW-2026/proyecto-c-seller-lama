interface VendedorInactivoBannerProps {
  className?: string;
}

export function VendedorInactivoBanner({ className }: VendedorInactivoBannerProps) {
  return (
    <div
      className={`rounded-xl border border-[#d8cfbd] bg-[#ede6d8] p-5 text-[#37413d] ${className || ''}`}
    >
      <p className="text-sm font-semibold text-[#8fa18d]">
        Tu cuenta de vendedor se encuentra inactiva
      </p>
      <p className="text-sm text-[#6f7f6d] mt-1">
        No podés crear, editar ni gestionar productos o ventas hasta que un administrador reactive tu cuenta.
      </p>
    </div>
  );
}