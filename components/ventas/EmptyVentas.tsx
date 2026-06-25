export function EmptyVentas() {
  return (
    <div className="rounded-2xl border border-[#d8cfbd] bg-[#ede6d8]/60 py-16 px-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#8fa18d]/10 flex items-center justify-center mx-auto mb-6">
        <svg className="w-7 h-7 text-[#8fa18d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </div>

      <p className="text-base font-semibold text-[#37413d] mb-2">
        No tenés ventas aún
      </p>

      <p className="text-sm text-[#6f7f6d] max-w-sm mx-auto">
        Cuando vendas productos, tus órdenes aparecerán aquí con todos los detalles.
      </p>
    </div>
  );
}