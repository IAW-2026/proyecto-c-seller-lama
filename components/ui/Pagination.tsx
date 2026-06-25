import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

const getPageWindow = (currentPage: number, totalPages: number) => {
  const maxLinks = 5;
  const half = Math.floor(maxLinks / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxLinks - 1);

  if (end - start + 1 < maxLinks) {
    start = Math.max(1, end - maxLinks + 1);
  }

  const pages = [] as number[];
  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
};

export function Pagination({ currentPage, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageWindow(currentPage, totalPages);

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        className={`rounded-lg border px-3 py-2 transition ${
          currentPage === 1
            ? 'pointer-events-none border-[#d8cfbd] text-[#b4b0a6]'
            : 'border-[#d8cfbd] text-[#37413d] hover:bg-[#ede6d8]'
        }`}
        aria-disabled={currentPage === 1}
      >
        Anterior
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`rounded-lg border px-3 py-2 transition ${
            page === currentPage
              ? 'border-[#8fa18d] bg-[#8fa18d] text-white'
              : 'border-[#d8cfbd] text-[#37413d] hover:bg-[#ede6d8]'
          }`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        className={`rounded-lg border px-3 py-2 transition ${
          currentPage === totalPages
            ? 'pointer-events-none border-[#d8cfbd] text-[#b4b0a6]'
            : 'border-[#d8cfbd] text-[#37413d] hover:bg-[#ede6d8]'
        }`}
        aria-disabled={currentPage === totalPages}
      >
        Siguiente
      </Link>
    </nav>
  );
}
