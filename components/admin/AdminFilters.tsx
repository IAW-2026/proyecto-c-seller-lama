'use client';

interface BaseAdminFiltersProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onClear: () => void;
}

interface AdminFiltersWithDatesProps {
  showDateFilters: true;
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

interface AdminFiltersWithoutDatesProps {
  showDateFilters?: false;
}

type AdminFiltersProps = BaseAdminFiltersProps &
  (AdminFiltersWithDatesProps | AdminFiltersWithoutDatesProps);

export function AdminFilters(props: AdminFiltersProps) {
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-end gap-3">
      <div className="w-full md:max-w-sm">
        <label className="block text-sm font-medium text-[#37413d] mb-1">
          Buscar
        </label>

        <input
          type="text"
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          placeholder={props.placeholder}
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-[#37413d] outline-none focus:border-[#8fa18d]"
        />
      </div>

      {props.showDateFilters && (
        <>
          <div>
            <label className="block text-sm font-medium text-[#37413d] mb-1">
              Desde
            </label>

            <input
              type="date"
              value={props.from}
              onChange={(event) => props.onFromChange(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-[#37413d] outline-none focus:border-[#8fa18d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#37413d] mb-1">
              Hasta
            </label>

            <input
              type="date"
              value={props.to}
              onChange={(event) => props.onToChange(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-[#37413d] outline-none focus:border-[#8fa18d]"
            />
          </div>
        </>
      )}

      <button
        type="button"
        onClick={props.onClear}
        className="rounded-lg border border-[#d8cfbd] bg-[#f6f1e7] px-4 py-2 text-sm font-semibold text-[#37413d] hover:bg-[#e8dfcf] transition"
      >
        Limpiar
      </button>
    </div>
  );
}