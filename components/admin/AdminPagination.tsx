interface AdminPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function AdminPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: AdminPaginationProps) {
  if (totalItems <= pageSize) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-4 border-t border-[#d8cfbd] bg-[#f6f1e7]">
      <div className="text-sm text-[#37413d]">
        Página {currentPage} de {totalPages}
      </div>

      <div className="text-sm text-[#37413d]">
        Mostrando {startItem}-{endItem} de {totalItems}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className="rounded-lg border border-[#d8cfbd] bg-white px-3 py-1.5 text-sm font-semibold text-[#37413d] transition hover:bg-[#ede6d8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className="rounded-lg border border-[#d8cfbd] bg-white px-3 py-1.5 text-sm font-semibold text-[#37413d] transition hover:bg-[#ede6d8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
