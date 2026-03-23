import React from "react";

interface FileItem {
  fileUrl: string;
}

interface Props {
  files: FileItem[];
  buildImageUrl: (url: string) => string;
  onImageClick: (index: number) => void;
}

const PostImageGrid: React.FC<Props> = ({
  files,
  buildImageUrl,
  onImageClick,
}) => {
  const count = files.length;

  const renderImage = (
    file: FileItem,
    index: number,
    className: string = ""
  ) => (
    <img
      key={file.fileUrl}
      src={buildImageUrl(file.fileUrl)}
      className={`object-cover w-full h-full cursor-pointer ${className}`}
      onClick={() => onImageClick(index)}
      onError={(e) => {
        e.currentTarget.src = "/no-image.png";
      }}
    />
  );

  // 1 image
  if (count === 1) {
    return (
      <div className="w-full h-96 overflow-hidden rounded-lg">
        {renderImage(files[0], 0)}
      </div>
    );
  }

  // 2 images
  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 h-96 rounded-lg overflow-hidden">
        {files.map((f, i) => renderImage(f, i))}
      </div>
    );
  }

  // 3 images
  if (count === 3) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-1 h-96 rounded-lg overflow-hidden">
        <div className="row-span-2">{renderImage(files[0], 0)}</div>
        {renderImage(files[1], 1)}
        {renderImage(files[2], 2)}
      </div>
    );
  }

  // 4 images
  if (count === 4) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-1 h-96 rounded-lg overflow-hidden">
        {files.map((f, i) => renderImage(f, i))}
      </div>
    );
  }

  // 5+ images
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-1 h-96 relative rounded-lg overflow-hidden">
      {files.slice(0, 4).map((f, i) => (
        <div key={i} className="relative">
          {renderImage(f, i)}

          {i === 3 && count > 4 && (
            <div
              onClick={() => onImageClick(i)}
              className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-bold cursor-pointer"
            >
              +{count - 4}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostImageGrid;