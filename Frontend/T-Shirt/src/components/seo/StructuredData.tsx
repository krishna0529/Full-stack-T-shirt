import React from "react";
import type { Product } from "../../types/product";

interface StructuredDataProps {
  product: Product;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ product }) => {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images && product.images.length > 0 ? product.images[0].imageUrl : "",
    description: product.description,
    sku: product.slug,
    offers: {
      "@type": "Offer",
      url: `https://tshirtstore.com/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 4.5,
      reviewCount: product.reviewCount || 10,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default StructuredData;
