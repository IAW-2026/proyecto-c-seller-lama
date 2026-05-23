interface AdminTableContainerProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  id?: string;
}

export function AdminTableContainer({
  title,
  children,
  footer,
  id,
}: AdminTableContainerProps) {
  return (
    <section id={id} className="mb-12 scroll-mt-8">
      {title && (
        <h2 className="text-xl font-semibold text-[#37413d] mb-4">
          {title}
        </h2>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {children}
        {footer}
      </div>
    </section>
  );
}