import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { useCart } from "../../context/CartContext";
import { MagneticButton } from "../../components/shop/MagneticButton";
import { ScrambleText } from "../../components/shop/ScrambleText";
import { api } from "../../services/api";
import { Loader2, PackageX, AlertCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [hoveredSize, setHoveredSize] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    setSelectedSize(null);
    setActiveImage(0);

    api
      .getProduct(id)
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
        ScrollTrigger.refresh();
      });

    api.getProducts().then((allProducts) => {
      // Just take 4 random products as suggestions for now
      const shuffled = allProducts.sort(() => 0.5 - Math.random());
      setSuggestedProducts(shuffled.slice(0, 4));
    }).catch(() => {});

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [id]);

  // ── Derived data once product is loaded ─────────────────────────────────

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | NEW LAB SYSTEM`;
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = "description";
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = `Buy ${product.name} online at NEW LAB SYSTEM. ${product.category_name ? `Explore our ${product.category_name} collection.` : ''}`;
    }
  }, [product]);

  // Build image array: thumbnail first, then gallery items
  const imageArray = (() => {
    if (!product) return [];
    const gallery = Array.isArray(product.gallery_urls)
      ? product.gallery_urls
      : (() => {
          try { return JSON.parse(product.gallery_urls || "[]"); }
          catch { return []; }
        })();
    const all = [];
    if (product.thumbnail_url) all.push(product.thumbnail_url);
    gallery.forEach((url) => { if (url && url !== product.thumbnail_url) all.push(url); });
    return all;
  })();

  // Sizes from attributes
  const sizesList = (() => {
    if (!product) return [];
    const attrs = product.attributes || {};
    if (attrs.sizes && typeof attrs.sizes === "object" && !Array.isArray(attrs.sizes)) {
      return Object.entries(attrs.sizes).map(([size, stock]) => ({ size, stock, disabled: stock === 0 }));
    }
    if (Array.isArray(attrs.sizes)) {
      return attrs.sizes.map((s) => ({ size: s, stock: null, disabled: false }));
    }
    if (attrs.size && typeof attrs.size === "string") {
      return attrs.size
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => ({ size: s, stock: null, disabled: false }));
    }
    return [];
  })();

  const stockQuantity = product ? parseInt(product.stock_quantity ?? 0, 10) : 0;
  const isOutOfStock = stockQuantity <= 0;

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    // If sizes exist, require a selection
    if (sizesList.length > 0 && !selectedSize) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      original_price: product.original_price,
      color: product.attributes?.color || "",
      size: selectedSize || "One Size",
      thumbnail_url: product.thumbnail_url || null,
      quantity: 1,
    });
    setIsCartOpen(true);
  };

  // ── Render states ────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-pure-white">
        <div className="flex flex-col items-center gap-4 text-brand-obsidian/40">
          <Loader2 className="w-10 h-10 animate-spin" />
          <span className="text-sm uppercase tracking-[0.2em] font-bold">Loading Product...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-pure-white">
        <div className="flex flex-col items-center gap-4 text-red-500 text-center px-6">
          <PackageX className="w-12 h-12" />
          <h2 className="text-xl font-black uppercase tracking-widest">Product Not Found</h2>
          <p className="text-xs font-mono text-red-400">{error}</p>
          <button
            onClick={() => navigate("/catalog")}
            className="mt-4 px-8 py-3 bg-brand-obsidian text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-black transition-colors"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const needsSizeSelection = sizesList.length > 0 && !selectedSize;
  const addToCartDisabled = isOutOfStock || needsSizeSelection;

  return (
    <div
      className="bg-brand-pure-white text-brand-obsidian min-h-screen pt-24"
      ref={containerRef}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-12 lg:gap-24">
        {/* Left Side: Image Gallery */}
        <div className="w-full md:w-[55%]">
          {/* Main image (active) */}
          <div className="aspect-[4/5] bg-brand-alabaster relative overflow-hidden mb-4 rounded-xl">
            {imageArray.length > 0 ? (
              <motion.img
                key={activeImage}
                src={imageArray[activeImage]}
                alt={`${product.name} — view ${activeImage + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest font-bold">
                No Image
              </div>
            )}

            {/* Discount badge */}
            {product.discount_percentage && !isOutOfStock && (
              <div className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full z-10">
                -{product.discount_percentage}%
              </div>
            )}

            {/* Out of Stock overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                <span className="bg-white text-brand-obsidian text-xs font-black uppercase tracking-[0.2em] px-6 py-3 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5] opacity-10 mix-blend-overlay">
              <img src="/logo.png" alt="" className="w-1/2 max-w-[200px] object-contain drop-shadow-md" />
            </div>
          </div>

          {/* Thumbnail strip — shown only if multiple images */}
          {imageArray.length > 1 && (
            <div className="flex gap-3 pb-20 flex-wrap">
              {imageArray.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-24 overflow-hidden flex-shrink-0 rounded-lg border-2 transition-all duration-300 ${
                    activeImage === i ? "border-brand-obsidian opacity-100" : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Scrolling gallery of remaining images below the strip */}
          {imageArray.length > 0 && (
            <div className="flex flex-col gap-4 pb-20">
              {imageArray.slice(1).map((img, i) => (
                <div key={i} className="aspect-[4/5] bg-brand-alabaster relative overflow-hidden">
                  <img
                    src={img}
                    alt={`${product.name} — View ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5] opacity-10 mix-blend-overlay">
                    <img src="/logo.png" alt="" className="w-1/2 max-w-[200px] object-contain drop-shadow-md" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Info */}
        <div className="w-full md:w-[45%] relative pb-40">
          <div className="md:sticky md:top-32 flex flex-col pt-12 md:pt-0">
            {product.attributes?.color && (
              <h3 className="text-xs tracking-[0.2em] uppercase text-brand-soft-grey mb-4 font-mono">
                {product.attributes.color}
              </h3>
            )}

            <ScrambleText
              text={product.name}
              className="text-6xl md:text-[5rem] font-serif font-black tracking-tight uppercase leading-[0.85] mb-6 text-brand-obsidian"
            />

            <div className="flex items-center gap-4 mb-4">
              {product.original_price && product.original_price > product.price ? (
                <>
                  <p className="text-3xl font-mono text-gray-400 font-medium tracking-tight line-through">
                    PKR {parseFloat(product.original_price).toLocaleString()}
                  </p>
                  <p className="text-3xl font-mono text-red-600 font-bold tracking-tight">
                    PKR {parseFloat(product.price).toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="text-3xl font-mono text-brand-obsidian/60 font-medium tracking-tight">
                  PKR {parseFloat(product.price).toLocaleString()}
                </p>
              )}
            </div>

            {/* Stock indicator */}
            {isOutOfStock ? (
              <div className="flex items-center gap-2 mb-12 text-red-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Out of Stock</span>
              </div>
            ) : (
              <p className="text-xs text-green-600 font-bold uppercase tracking-widest mb-12">
                {stockQuantity} in stock
              </p>
            )}

            {/* Size selection — only if sizes exist */}
            {sizesList.length > 0 && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold tracking-widest uppercase">Select Size</span>
                  <button className="text-xs text-brand-soft-grey uppercase tracking-widest border-b border-brand-soft-grey hover:text-brand-obsidian hover:border-brand-obsidian transition-colors">
                    Size Guide
                  </button>
                </div>

                <div className="flex gap-3 relative flex-wrap">
                  {sizesList.map(({ size, disabled }) => (
                    <button
                      key={size}
                      disabled={disabled || isOutOfStock}
                      onMouseEnter={() => !disabled && !isOutOfStock && setHoveredSize(size)}
                      onMouseLeave={() => setHoveredSize(null)}
                      onClick={() => !disabled && !isOutOfStock && setSelectedSize(size)}
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center text-sm font-mono font-bold transition-all z-10
                        ${disabled || isOutOfStock
                          ? "text-brand-soft-grey line-through cursor-not-allowed opacity-50 bg-brand-alabaster"
                          : "text-brand-obsidian border border-gray-200"
                        }
                        ${selectedSize === size ? "text-white border-transparent" : "hover:border-brand-obsidian"}
                      `}
                    >
                      {size}
                      {selectedSize === size && (
                        <motion.div
                          layoutId="selectedPill"
                          className="absolute inset-0 bg-brand-obsidian rounded-full z-[-1]"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      {hoveredSize === size && selectedSize !== size && !disabled && !isOutOfStock && (
                        <motion.div
                          layoutId="hoverPill"
                          className="absolute inset-0 bg-brand-alabaster rounded-full z-[-2]"
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <MagneticButton
              onClick={handleAddToCart}
              disabled={addToCartDisabled}
              className={`w-full mb-12 py-6 rounded-full uppercase tracking-[0.2em] text-sm font-bold transition-all duration-300
                ${addToCartDisabled
                  ? "bg-brand-alabaster text-brand-soft-grey cursor-not-allowed"
                  : "bg-brand-obsidian text-white hover:bg-black shadow-2xl hover:scale-[1.02]"
                }
              `}
            >
              {isOutOfStock
                ? "Out of Stock"
                : needsSizeSelection
                ? "Select a Size"
                : "Add to Cart"}
            </MagneticButton>

            {/* Description & Details */}
            <div className="space-y-8 border-t border-brand-soft-grey/20 pt-8">
              {product.description && (
                <div className="mt-8">
                  <h4 className="text-xs font-semibold tracking-widest uppercase mb-6 text-brand-obsidian border-b border-gray-100 pb-2">Description & Specifications</h4>
                  <div 
                    className="text-sm leading-relaxed text-brand-obsidian/90 font-sans ai-generated-content"
                    dangerouslySetInnerHTML={{ __html: product.description }} 
                  />
                </div>
              )}

              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold tracking-widest uppercase mb-4">Details</h4>
                  <ul className="text-sm space-y-2 text-brand-obsidian/80 font-sans">
                    {Object.entries(product.attributes)
                      .filter(([k]) => !["sizes"].includes(k))
                      .map(([key, value]) => (
                        <li key={key} className="flex gap-2 capitalize">
                          <span className="text-brand-soft-grey">—</span>
                          <span className="font-semibold">{key}:</span> {String(value)}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {product.category_name && (
                <div className="text-xs text-brand-soft-grey uppercase tracking-widest font-bold">
                  Category: {product.category_name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Products Section */}
      {suggestedProducts.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-24 mb-24">
          <h2 className="text-2xl font-serif font-bold text-brand-obsidian mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {suggestedProducts.map(suggestion => (
              <div key={suggestion.id} className="group cursor-pointer" onClick={() => navigate(`/product/${suggestion.id}`)}>
                <div className="aspect-square bg-brand-alabaster rounded-xl overflow-hidden mb-4 p-4 flex items-center justify-center">
                  <img src={suggestion.thumbnail_url} alt={suggestion.name} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="text-[10px] text-gray-400 font-mono mb-1">{suggestion.sku}</div>
                <h3 className="text-sm font-semibold text-brand-obsidian line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">{suggestion.name}</h3>
                <p className="text-sm font-bold text-brand-obsidian">PKR {Number(suggestion.price).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
