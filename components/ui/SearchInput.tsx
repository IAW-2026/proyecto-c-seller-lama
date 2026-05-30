interface SearchInputProps {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
}

export function SearchInput({
  name,
  label,
  placeholder,
  defaultValue,
}: SearchInputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-[#37413d]">
      <span>{label}</span>

      <input
        key={(defaultValue as string) || 'empty'}
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="
          h-12 w-full rounded-xl border border-[#d8cfbd]
          bg-white px-4 text-sm text-[#37413d]
          shadow-sm outline-none transition
          placeholder:text-[#7b857d]
          focus:border-[#8fa18d] focus:ring-2 focus:ring-[#8fa18d]/25
        "
      />
    </label>
  );
}