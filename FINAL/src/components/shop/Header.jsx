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
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
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
    // Fetch data for mega menu
    api.getCategories().then((data) => setCategories(data)).catch(() => {});
    api.getDiscounts().then((data) => setDiscounts(data.filter(d => d.active))).catch(() => {});
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

  return (
    <>
      <header
        className={`${styles.header} ${isScrolled ? styles.solid : styles.transparent} fixed top-0 w-full`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between relative">
          <div className="flex items-center gap-8">
            <button className="p-2 -ml-2 block md:hidden">
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
                          Summer Collection
                        </Link>
                      </li>
                      <li>
                        <Link to="/catalog" className={styles.megaMenuLink}>
                          The Core Uniform
                        </Link>
                      </li>
                      <li>
                        <Link to="/catalog" className={styles.megaMenuLink}>
                          Heavyweight Cotton
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
              DRAPE<span className="text-red-600">.</span>
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 w-full h-[300px] bg-brand-pure-white text-brand-obsidian shadow-2xl z-50 p-6 md:p-12 flex flex-col items-center justify-center border-b border-gray-100"
          >
            <div className="w-full max-w-3xl relative">
              <form onSubmit={handleSearchSubmit}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="SEARCH FOR ITEMS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border-none outline-none py-6 pl-14 pr-24 text-xl md:text-3xl font-black uppercase tracking-widest placeholder:text-gray-300 focus:bg-gray-100 transition-colors"
                />
                <button 
                  type="button" 
                  onClick={() => setIsSearchOpen(false)} 
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-brand-obsidian transition-colors"
                >
                  Close
                </button>
              </form>
            </div>
            <p className="mt-8 text-xs font-medium text-gray-400 tracking-widest uppercase">
              Press Enter to search
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
