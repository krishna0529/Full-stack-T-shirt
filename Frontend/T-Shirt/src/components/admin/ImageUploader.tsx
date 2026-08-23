import React, { useRef } from "react";
import { Upload, X } from "lucide-react";
import type { ProductImage } from "../../types/product";

interface ImageUploaderProps {
  existingImages?: ProductImage[];
  newFiles: File[];
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onDeleteExistingImage?: (imageId: number) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  existingImages = [],
  newFiles,
  onAddFiles,
  onRemoveFile,
  onDeleteExistingImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      onAddFiles(selectedFiles);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[var(--color-surface)] group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              Click to upload product images
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              PNG, JPG, WEBP up to 10MB (Multiple selection allowed)
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview Grid */}
      {(existingImages.length > 0 || newFiles.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {/* Existing Images from Server */}
          {existingImages.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 aspect-square"
            >
              <img
                src={img.imageUrl}
                alt={img.altText || "Product"}
                className="w-full h-full object-cover"
              />
              {onDeleteExistingImage && (
                <button
                  type="button"
                  onClick={() => onDeleteExistingImage(img.id)}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}

          {/* Newly Selected Files */}
          {newFiles.map((file, idx) => {
            const previewUrl = URL.createObjectURL(file);
            return (
              <div
                key={`new-${idx}`}
                className="relative group rounded-xl overflow-hidden border-2 border-amber-500/60 bg-slate-100 dark:bg-slate-900 aspect-square"
              >
                <img
                  src={previewUrl}
                  alt="New preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemoveFile(idx)}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-amber-500 text-[10px] font-bold text-white rounded">
                  NEW
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
