// File: src/components/shop/Header.jsx
import React, { useEffect, useState } from "react";
import { ShoppingBag, Search, Menu, User, Shield } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import styles from "./Header.module.css";
import { LoginModal } from "./LoginModal";
import { api } from "../../services/api";

export function Header() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const { items, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const role = localStorage.getItem("userRole");

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialize on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Fetch data for mega menu and search
    api.getCategories().then((data) => setCategories(data)).catch(() => {});
    api.getDiscounts().then((data) => setDiscounts(data.filter(d => d.active))).catch(() => {});
    api.getProducts().then((data) => setProducts(data)).catch(() => {});
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const isScrolled = scrollY > 50 || !isHomePage;

  const handleUserClick = () => {
    if (role === "admin" || role === "staff") {
      navigate("/admin");
    } else if (role === "customer") {
      navigate("/profile");
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const liveSearchResults = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <>
      <header
        className={`${styles.header} ${isScrolled ? styles.solid : styles.transparent} fixed top-0 w-full`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between relative">
          <div className="flex items-center gap-8">
            <button className="p-2 -ml-2 block md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>

            <nav className="hidden md:flex items-center gap-8 h-full">
              <div className={styles.navItem}>
                <Link
                  to="/catalog"
                  className="text-xs tracking-[0.2em] uppercase font-semibold hover:opacity-70 transition-opacity"
                >
                  Shop
                </Link>

                {/* Mega Menu Placeholder */}
                <div className={styles.megaMenu}>
                  <div className={styles.megaMenuColumn}>
                    <h3 className={styles.megaMenuTitle}>Categories</h3>
                    <ul className={styles.megaMenuList}>
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <li key={cat.id}>
                            <Link to={`/catalog?category=${cat.name}`} className={styles.megaMenuLink}>
                              {cat.name}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>
                          <Link to="/catalog" className={styles.megaMenuLink}>View All</Link>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className={styles.megaMenuColumn}>
                    <h3 className={styles.megaMenuTitle}>Offers & Discounts</h3>
                    <ul className={styles.megaMenuList}>
                      {discounts.length > 0 ? (
                        discounts.map((discount) => (
                          <li key={discount.id}>
                            <Link to="/catalog" className={`${styles.megaMenuLink} text-red-500 font-bold`}>
                              {discount.type === 'percentage' ? `${discount.value}% OFF` : `PKR ${discount.value} OFF`} 
                              {discount.target === 'all' ? ' Everything' : discount.target === 'category' ? ` on ${discount.target_value}` : ''}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">No active offers</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className={styles.megaMenuColumn}>
                    <h3 className={styles.megaMenuTitle}>Collections & Tags</h3>
                    <ul className={styles.megaMenuList}>
                      <li>
                        <Link to="/catalog" className={styles.megaMenuLink}>
                          Advanced Spectrometry
                        </Link>
                      </li>
                      <li>
                        <Link to="/catalog" className={styles.megaMenuLink}>
                          Precision Optics
                        </Link>
                      </li>
                      <li>
                        <Link to="/catalog" className={styles.megaMenuLink}>
                          Automation Systems
                        </Link>
                      </li>
                      <li>
                        <Link to="/catalog" className={styles.megaMenuLink}>
                          Best Sellers
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.megaMenuColumn}>
                    <img
                      src="https://images.unsplash.com/photo-1594587895869-d90d9ab289f1?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Latest Campaign"
                      className={styles.megaMenuImage}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.navItem}>
                <Link
                  to="/about"
                  className="text-xs tracking-[0.2em] uppercase font-semibold hover:opacity-70 transition-opacity"
                >
                  About
                </Link>
              </div>

              <div className={styles.navItem}>
                <Link
                  to="/track-order"
                  className="text-xs tracking-[0.2em] uppercase font-semibold hover:opacity-70 transition-opacity"
                >
                  Track Order
                </Link>
              </div>
            </nav>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link
              to="/"
              className="text-3xl font-sans font-black tracking-tighter uppercase relative group"
            >
              <img src="/footer.png" alt="NEW LAB SYSTEM" className="h-10 animate-logo" />
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <button 
              className="p-2 hidden md:block hover:opacity-70 transition-opacity"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={handleUserClick}
              className="text-xs tracking-[0.2em] uppercase hidden md:flex items-center gap-2 hover:opacity-70 transition-opacity font-semibold"
            >
              {role === "admin" || role === "staff" ? (
                <>
                  <Shield className="w-4 h-4" /> PORTAL
                </>
              ) : role === "customer" ? (
                <>
                  <User className="w-4 h-4" /> PROFILE
                </>
              ) : (
                <>
                  <User className="w-4 h-4" /> LOGIN
                </>
              )}
            </button>
            <button
              className="p-2 -mr-2 relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span
                  className={`absolute top-1 right-1 w-4 h-4 text-[10px] flex items-center justify-center rounded-full font-mono transition-colors ${
                    isScrolled
                      ? "bg-brand-obsidian text-white"
                      : "bg-white text-brand-obsidian"
                  }`}
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100] flex flex-col items-center pt-24 md:pt-40 px-4"
          >
            <div className="w-full max-w-3xl relative">
              <form onSubmit={handleSearchSubmit} className="relative z-10">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-white/50" />
                <input
                  type="text"
                  autoFocus
                  placeholder="SEARCH COLLECTION..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-white/20 outline-none py-6 pl-20 pr-24 text-2xl md:text-5xl font-sans font-black uppercase tracking-tighter text-white placeholder:text-white/20 focus:border-white transition-colors"
                />
                <button 
                  type="button" 
                  onClick={() => setIsSearchOpen(false)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors p-2"
                >
                  Close
                </button>
              </form>

              {/* Live Search Results */}
              <AnimatePresence>
                {liveSearchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {liveSearchResults.map(product => {
                      const gallery = Array.isArray(product.gallery_urls) 
                        ? product.gallery_urls 
                        : (typeof product.gallery_urls === 'string' ? JSON.parse(product.gallery_urls || "[]") : []);
                      const imgUrl = product.thumbnail_url || gallery[0];
                      
                      return (
                      <Link 
                        key={product.id} 
                        to={`/product/${product.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <div className="w-20 h-24 bg-white/5 rounded-lg overflow-hidden shrink-0">
                          {imgUrl ? (
                            <img src={imgUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full bg-white/10" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1 line-clamp-1">{product.name}</h4>
                          <p className="text-white/50 text-xs font-mono font-medium">PKR {product.price}</p>
                        </div>
                      </Link>
                    )})}
                  </motion.div>
                )}
              </AnimatePresence>

              {searchQuery.trim().length > 1 && liveSearchResults.length === 0 && (
                <div className="mt-12 text-center text-white/40 uppercase tracking-widest text-xs font-bold">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
            <p className="mt-auto mb-10 text-xs font-medium text-white/30 tracking-[0.3em] uppercase">
              Press Enter to view all results
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-brand-pure-white z-[110] flex flex-col"
          >
            <div className="h-20 px-6 flex items-center justify-between border-b border-gray-100 shrink-0">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black tracking-tighter">
              <img src="/logo.png" alt="NEW LAB SYSTEM" className="h-8 animate-logo" />
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-xs font-bold tracking-widest uppercase text-gray-400">
                Close
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-6">
              <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black tracking-tighter uppercase">Shop All</Link>
              
              {categories.length > 0 && (
                <div className="flex flex-col gap-4 pl-4 border-l-2 border-gray-100">
                  {categories.map(cat => (
                    <Link 
                      key={cat.id}
                      to={`/catalog?category=${cat.name}`} 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="text-sm font-bold tracking-widest uppercase text-gray-500"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
              
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black tracking-tighter uppercase">About</Link>
              <Link to="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black tracking-tighter uppercase">Track Order</Link>
              
              <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-6">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); handleUserClick(); }} 
                  className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase"
                >
                  <User className="w-5 h-5" /> 
                  {role === "admin" || role === "staff" ? "Portal" : role === "customer" ? "Profile" : "Login"}
                </button>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
                  className="flex items-center gap-4 text-sm font-bold tracking-widest uppercase"
                >
                  <Search className="w-5 h-5" /> Search
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
