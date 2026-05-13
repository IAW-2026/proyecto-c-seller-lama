interface AdminTableContainerProps {
  title?: string;
  children: React.ReactNode;
}

export function AdminTableContainer({
  title,
  children,
}: AdminTableContainerProps) {
  return (
    <section className="mb-12">
      {title && (
        <h2 className="text-xl font-semibold text-[#37413d] mb-4">
          {title}
        </h2>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {children}
      </div>
    </section>
  );
}