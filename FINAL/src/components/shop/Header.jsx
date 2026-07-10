// File: src/components/shop/Header.jsx
import React, { useEffect, useState } from "react";
import { ShoppingBag, Search, Menu, User, Shield } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { LoginModal } from "./LoginModal";

export function Header() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
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
                      <li>
                        <Link to="/catalog" className={styles.megaMenuLink}>
                          New Arrivals
                        </Link>
                      </li>
                      <li>
                        <Link to="/catalog" className={styles.megaMenuLink}>
                          Tops &amp; Tees
                        </Link>
                      </li>
                      <li>
                        <Link to="/catalog" className={styles.megaMenuLink}>
                          Knitwear
                        </Link>
                      </li>
                      <li>
                        <Link to="/catalog" className={styles.megaMenuLink}>
                          Bottoms
                        </Link>
                      </li>
                      <li>
                        <Link to="/catalog" className={styles.megaMenuLink}>
                          Outerwear
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.megaMenuColumn}>
                    <h3 className={styles.megaMenuTitle}>Collections</h3>
                    <ul className={styles.megaMenuList}>
                      <li>
                        <Link to="/catalog" className={styles.megaMenuLink}>
                          Spring/Summer 2026
                        </Link>
                      </li>
                      <li>
                        <Link to="/catalog" className={styles.megaMenuLink}>
                          The Core Uniform
                        </Link>
                      </li>
                      <li>
                        <Link to="/catalog" className={styles.megaMenuLink}>
                          Accessories
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
            <button className="p-2 hidden md:block">
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

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
