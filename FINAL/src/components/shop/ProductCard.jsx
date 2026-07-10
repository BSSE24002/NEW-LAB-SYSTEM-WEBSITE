import React, { useState, useRef } from "react";
import { useCart } from "../../context/CartContext";
import { ScrollReveal } from "./ScrollReveal";
import { MagneticButton } from "./MagneticButton";
import { useInView } from "motion/react";
import { Link } from "react-router-dom";

/**
 * ProductCard — works with BOTH live DB products and any legacy mock shape.
 *
 * DB product fields:   thumbnail_url, gallery_urls (array), stock_quantity, attributes (JSONB)
 * Legacy mock fields:  imageDef, imageLife, attributes.sizes (array)
 */
export function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "200px" });

  // ── Image resolution ─────────────────────────────────────────────────────
  // Primary (default) image: thumbnail_url → first gallery item → imageDef → placeholder
  const galleryArray = Array.isArray(product.gallery_urls)
    ? product.gallery_urls
    : (() => {
        try { return JSON.parse(product.gallery_urls || "[]"); }
        catch { return []; }
      })();

  const primaryImage =
    product.thumbnail_url ||
    galleryArray[0] ||
    product.imageDef ||
    null;

  // Hover image: second gallery item → imageLife → primaryImage
  const hoverImage =
    galleryArray[1] ||
    product.imageLife ||
    primaryImage;

  // ── Stock / out-of-stock logic ────────────────────────────────────────────
  const stockQuantity =
    product.stock_quantity !== undefined ? parseInt(product.stock_quantity, 10) : null;
  const isOutOfStock = stockQuantity !== null && stockQuantity <= 0;

  // ── Attributes / color ───────────────────────────────────────────────────
  const attrs = product.attributes || {};
  const color = attrs.color || "";

  // ── Sizes (for quick-add buttons) ────────────────────────────────────────
  // DB products store sizes as a comma-separated string or simple array in attrs.size(s)
  // Legacy mocks use attrs.sizes as an array. We unify here.
  let sizesList = [];
  if (attrs.sizes && typeof attrs.sizes === "object" && !Array.isArray(attrs.sizes)) {
    // Object mapping { S: stock, M: stock } (legacy ProductDetail shape)
    sizesList = Object.entries(attrs.sizes).map(([size, stock]) => ({ size, disabled: stock === 0 }));
  } else if (Array.isArray(attrs.sizes)) {
    sizesList = attrs.sizes.map((s) => ({ size: s, disabled: isOutOfStock }));
  } else if (attrs.size && typeof attrs.size === "string") {
    // Single size or comma-separated string from DB
    sizesList = attrs.size
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => ({ size: s, disabled: isOutOfStock }));
  }

  const handleAdd = (size, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      original_price: product.original_price,
      color,
      size,
      thumbnail_url: primaryImage || null,
      quantity: 1,
    });
  };

  return (
    <ScrollReveal>
      <Link
        to={`/product/${product.id}`}
        className="group relative cursor-pointer overflow-hidden pb-4 flex flex-col block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div ref={cardRef} className="relative aspect-[3/4] bg-brand-alabaster mb-6 overflow-hidden rounded-2xl">
          {isInView && (
            <>
              {primaryImage ? (
                <img
                  loading="lazy"
                  src={primaryImage}
                  alt={product.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
                  }`}
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest font-bold">
                  No Image
                </div>
              )}
              {hoverImage && hoverImage !== primaryImage && (
                <img
                  loading="lazy"
                  src={hoverImage}
                  alt={`${product.name} Lifestyle`}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
                  }`}
                />
              )}
              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5] opacity-10 mix-blend-overlay">
                <img src="/logo.png" alt="" className="w-1/2 max-w-[150px] object-contain drop-shadow-md" />
              </div>
            </>
          )}

          {/* Discount badge */}
          {product.discount_percentage && !isOutOfStock && (
            <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full z-10">
              -{product.discount_percentage}%
            </div>
          )}

          {/* Out of Stock badge */}
          {isOutOfStock && (
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full z-10">
              Out of Stock
            </div>
          )}

          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Quick-add size buttons — hidden when out of stock */}
          {!isOutOfStock && sizesList.length > 0 && (
            <div className="absolute bottom-6 left-0 right-0 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex gap-2 justify-center px-4">
              {sizesList.map(({ size, disabled }) =>
                disabled ? (
                  <button
                    key={size}
                    disabled
                    className="w-12 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/40 text-brand-obsidian/40 line-through flex items-center justify-center text-xs font-mono transition-colors cursor-not-allowed"
                  >
                    {size}
                  </button>
                ) : (
                  <React.Fragment key={size}>
                    <MagneticButton
                      onClick={(e) => handleAdd(size, e)}
                      className="w-12 h-10 rounded-full bg-white backdrop-blur-md shadow-lg border border-transparent hover:border-brand-obsidian flex items-center justify-center text-xs font-mono font-bold transition-all text-brand-obsidian hover:bg-brand-obsidian hover:text-white"
                    >
                      {size}
                    </MagneticButton>
                  </React.Fragment>
                )
              )}
            </div>
          )}

          {/* Out of Stock overlay on hover */}
          {isOutOfStock && (
            <div className="absolute bottom-6 left-0 right-0 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex justify-center px-4">
              <span className="px-6 py-2 rounded-full bg-white/80 backdrop-blur-md text-brand-obsidian/60 text-xs font-bold uppercase tracking-[0.15em]">
                Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col items-center text-center px-2 relative">
          {isOutOfStock && (
            <span className="absolute -top-2 right-2 text-[9px] font-bold uppercase tracking-wider text-red-500">
              Sold Out
            </span>
          )}
          <h3 className={`text-lg font-black tracking-tight uppercase ${isOutOfStock ? "opacity-50" : ""}`}>
            {product.name}
          </h3>
          {color && (
            <p className="text-xs text-brand-obsidian/50 font-bold mt-1 tracking-[0.2em] uppercase mb-2">
              {color}
            </p>
          )}
          <div className={`flex items-center gap-2 ${isOutOfStock ? "opacity-50" : ""}`}>
            {product.original_price && product.original_price > product.price ? (
              <>
                <span className="text-md font-mono font-medium tracking-tight line-through text-gray-400">
                  PKR {parseFloat(product.original_price).toLocaleString()}
                </span>
                <span className="text-md font-mono font-bold tracking-tight text-red-600">
                  PKR {parseFloat(product.price).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-md font-mono font-medium tracking-tight">
                PKR {parseFloat(product.price).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}
