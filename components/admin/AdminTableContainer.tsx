interface AdminTableContainerProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  id?: string;
}

export function AdminTableContainer({
  children,
  footer,
  id,
}: AdminTableContainerProps) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#d8cfbd]/70 shadow-[0_2px_12px_rgba(55,65,61,0.06)] overflow-hidden transition-all duration-300">
        {children}
        {footer && (
          <div className="border-t border-[#d8cfbd]/50 bg-white/40 p-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}