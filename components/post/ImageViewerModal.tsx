import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";

interface FileItem {
  fileUrl: string;
}

interface Props {
  files: FileItem[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
  buildImageUrl: (url: string) => string;
}

export default function ImageViewerModal({
  files,
  index,
  onClose,
  onChange,
  buildImageUrl,
}: Props) {
  const next = () => onChange((index + 1) % files.length);
  const prev = () => onChange((index - 1 + files.length) % files.length);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white"
      >
        <X size={32} />
      </button>

      {/* Prev */}
      {files.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-4 text-white"
        >
          <ChevronLeft size={40} />
        </button>
      )}

      {/* Image */}
      <img
        src={buildImageUrl(files[index].fileUrl)}
        className="max-h-[90vh] max-w-[90vw] object-contain"
      />

      {/* Next */}
      {files.length > 1 && (
        <button
          onClick={next}
          className="absolute right-4 text-white"
        >
          <ChevronRight size={40} />
        </button>
      )}

      {/* Counter */}
      <div className="absolute bottom-6 text-white text-sm">
        {index + 1} / {files.length}
      </div>
    </div>
  );
}