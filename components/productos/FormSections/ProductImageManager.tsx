interface ProductImageManagerProps {
  existingImages: string[];
  newImagePreviews: string[];
  onAddImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveExistingImage: (imageUrl: string) => void;
  onRemoveNewImage: (index: number) => void;
}

export function ProductImageManager({
  existingImages,
  newImagePreviews,
  onAddImages,
  onRemoveExistingImage,
  onRemoveNewImage,
}: ProductImageManagerProps) {
  const hasImages = existingImages.length > 0 || newImagePreviews.length > 0;

  return (
    <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#37413d] mb-4">
        Imágenes del producto
      </h2>

      {hasImages ? (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {existingImages.map((imageUrl) => (
            <div
              key={imageUrl}
              className="relative rounded-lg overflow-hidden border border-[#d8cfbd] bg-white"
            >
              <img
                src={imageUrl}
                alt="Imagen actual del producto"
                className="w-full h-40 object-cover"
              />

              <button
                type="button"
                onClick={() => onRemoveExistingImage(imageUrl)}
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          ))}

          {newImagePreviews.map((previewUrl, index) => (
            <div
              key={previewUrl}
              className="relative rounded-lg overflow-hidden border border-[#d8cfbd] bg-white"
            >
              <img
                src={previewUrl}
                alt="Nueva imagen del producto"
                className="w-full h-40 object-cover"
              />

              <button
                type="button"
                onClick={() => onRemoveNewImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md hover:bg-red-700 transition"
              >
                Eliminar
              </button>

              <span className="absolute bottom-2 left-2 bg-[#8fa18d] text-white text-xs px-2 py-1 rounded-md">
                Nueva
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-dashed border-[#8fa18d] p-8 text-center text-[#6f7f6d]">
          Este producto no tiene imágenes.
        </div>
      )}

      <label className="block">
        <span className="inline-block bg-[#8fa18d] text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-[#6f7f6d] transition">
          Agregar imágenes
        </span>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onAddImages}
          className="hidden"
        />
      </label>
    </div>
  );
}