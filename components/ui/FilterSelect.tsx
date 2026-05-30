interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  name: string;
  label: string;
  options: FilterOption[];
  defaultValue?: string;
}

export function FilterSelect({
  name,
  label,
  options,
  defaultValue,
}: FilterSelectProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-[#37413d]">
      <span>{label}</span>

      <select
        key={(defaultValue as string) || 'empty'}
        name={name}
        defaultValue={defaultValue}
        className="
          h-12 w-full rounded-xl border border-[#d8cfbd]
          bg-white px-4 text-sm text-[#37413d]
          shadow-sm outline-none transition
          focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/25
        "
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}