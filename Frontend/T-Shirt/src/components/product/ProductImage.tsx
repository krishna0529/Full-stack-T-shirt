interface ProductImageProps {
  image: string;
  hoverImage?: string;
  alt: string;
}

export default function ProductImage({ image, hoverImage, alt }: ProductImageProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900">
      <img
        src={image}
        alt={alt}
        className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
          hoverImage ? "group-hover:opacity-0" : ""
        }`}
      />

      {hoverImage && (
        <img
          src={hoverImage}
          alt={`${alt} alternate view`}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
        />
      )}
    </div>
  );
}
