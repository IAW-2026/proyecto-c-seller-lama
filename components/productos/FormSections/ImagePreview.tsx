'use client';

interface ImagePreviewProps {
  imageUrl: string;
}

export function ImagePreview({ imageUrl }: ImagePreviewProps) {
  return (
    <div className="bg-[#ede6d8] rounded-xl border border-[#d8cfbd] overflow-hidden p-4 shadow-sm">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Vista previa del producto"
          className="w-full h-auto rounded-lg object-cover max-h-96"
        />
      ) : (
        <div className="aspect-square flex items-center justify-center text-[#6f7f6d] bg-[#f6f1e7] rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-sm font-medium">Sin imagen</p>
          </div>
        </div>
      )}
    </div>
  );
}
