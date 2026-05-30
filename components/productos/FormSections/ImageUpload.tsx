'use client';

interface ImageUploadProps {
  onImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedImagesCount: number;
  firstImageName?: string;
  onRemoveAll?: () => void;
  disabled?: boolean;
}

export function ImageUpload({
  onImagesChange,
  selectedImagesCount,
  firstImageName,
  onRemoveAll,
  disabled = false,
}: ImageUploadProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#37413d] mb-2">
        Imágenes del producto
      </label>

      <label
        className={`block rounded-xl border-2 border-dashed border-[#8fa18d] bg-[#f6f1e7] p-6 text-center transition duration-200 ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-[#e8dfcf]'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#8fa18d]/10 flex items-center justify-center text-2xl">
            📷
          </div>

          <span className="text-[#37413d] font-medium">
            {selectedImagesCount > 0
              ? 'Agregar más imágenes'
              : 'Seleccionar imágenes'}
          </span>

          <span className="text-sm text-[#6f7f6d]">
            {selectedImagesCount > 0
              ? `${selectedImagesCount} imagen${selectedImagesCount > 1 ? 's' : ''} seleccionada${selectedImagesCount > 1 ? 's' : ''}`
              : firstImageName
                ? firstImageName
                : 'JPG, PNG o WEBP'}
          </span>
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onImagesChange}
          disabled={disabled}
          className="hidden"
        />
      </label>

      {selectedImagesCount > 0 && onRemoveAll && (
        <button
          type="button"
          onClick={onRemoveAll}
          disabled={disabled}
          className="mt-2 text-sm text-[#d17d6f] hover:text-[#b85a47] font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Limpiar todas las imágenes
        </button>
      )}
    </div>
  );
}
