interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={`
        mb-8 rounded-2xl border border-[#d8cfbd]
        bg-[#ede6d8]/70 p-5 shadow-sm
        ${className || ''}
      `.trim()}
    >
      {children}
    </div>
  );
}