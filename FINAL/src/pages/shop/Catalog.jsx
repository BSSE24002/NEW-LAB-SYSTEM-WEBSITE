// Catalog.jsx — live data only, no mock arrays
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, PackageX, WifiOff } from "lucide-react";
import { ProductCard } from "../../components/shop/ProductCard";
import { ScrollReveal } from "../../components/shop/ScrollReveal";
import api from "../../services/api";
import { useLocation } from "react-router-dom";

/**
 * Fetches products via the central api.js service (uses correct backend URL in prod).
 * No mock data. No localStorage. No fallback arrays.
 */
async function fetchProducts() {
  return api.getProducts();
}

export function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [location.search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProducts()
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // Dynamic category tabs from real data
  const categories = useMemo(() => {
    const cats = new Set(
      products.map((p) => p.category_name).filter(Boolean)
    );
    return ["All", ...Array.from(cats).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category_name === activeCategory);
    }
    if (searchQuery) {
      result = result.filter((p) => 
        p.name?.toLowerCase().includes(searchQuery) || 
        p.description?.toLowerCase().includes(searchQuery) ||
        p.sku?.toLowerCase().includes(searchQuery)
      );
    }
    return result;
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="bg-brand-pure-white text-brand-obsidian min-h-screen pt-32 pb-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col mb-16 gap-12">
          <ScrollReveal>
            <h1 className="text-[4rem] md:text-[8rem] leading-none font-sans font-black tracking-tighter uppercase text-brand-obsidian mb-4">
              Collection.
            </h1>
            <p className="text-xl font-medium text-brand-obsidian/60 max-w-2xl">
              Every garment is designed to outlast trends. Filter below to
              explore our modular wardrobe essentials.
            </p>
          </ScrollReveal>

          {/* Category filter tabs — only visible once data is loaded */}
          {!loading && !error && categories.length > 1 && (
            <ScrollReveal>
              <div className="flex flex-wrap gap-2 md:gap-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-8 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 border ${
                      activeCategory === category
                        ? "bg-brand-obsidian text-white border-brand-obsidian"
                        : "bg-transparent text-brand-obsidian/60 border-brand-obsidian/20 hover:border-brand-obsidian hover:text-brand-obsidian"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-brand-obsidian/40">
            <Loader2 className="w-10 h-10 animate-spin" />
            <span className="text-sm uppercase tracking-[0.2em] font-bold">
              Loading Collection...
            </span>
          </div>
        )}

        {/* ── Error (backend offline / network issue) ── */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-red-500 text-center">
            <WifiOff className="w-12 h-12" />
            <h2 className="text-xl font-black uppercase tracking-widest">
              Could not load products
            </h2>
            <p className="text-xs font-mono text-red-400 max-w-sm">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchProducts()
                  .then((data) => setProducts(Array.isArray(data) ? data : []))
                  .catch((e) => setError(e.message))
                  .finally(() => setLoading(false));
              }}
              className="mt-4 px-8 py-3 bg-brand-obsidian text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-black transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Product Grid ── */}
        {!loading && !error && (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16"
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 gap-3 text-brand-obsidian/40">
                <PackageX className="w-10 h-10" />
                <span className="text-sm uppercase tracking-[0.2em] font-bold">
                  {products.length === 0
                    ? "No products in the store yet."
                    : "No products in this category."}
                </span>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
