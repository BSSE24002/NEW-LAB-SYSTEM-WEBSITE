// File: src/components/shop/ShopLayout.jsx
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartProvider, useCart } from "../../context/CartContext";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus } from "lucide-react";
import { useLenis } from "../../hooks/useLenis";


function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    items,
    total,
    addItem,
    removeItem,
    setItems,
  } = useCart();
  const [checkoutStep, setCheckoutStep] = useState(0);


  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-obsidian z-[60]"
            onClick={() => {
              setIsCartOpen(false);
              setCheckoutStep(0);
            }}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-brand-pure-white z-[70] flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-brand-soft-grey/30 flex justify-between items-center">
              <h2 className="text-sm font-semibold tracking-[0.2em] uppercase font-sans">
                {checkoutStep === 0 ? "Your Cart" : "Checkout"}
              </h2>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setTimeout(() => {
                    if (checkoutStep === 1) setItems([]);
                    setCheckoutStep(0);
                  }, 500);
                }}
                className="p-2 hover:bg-brand-alabaster rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-brand-obsidian" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {checkoutStep === 0 ? (
                <motion.div
                  key="cart"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 no-scrollbar"
                >
                  {items.length === 0 ? (
                    <p className="text-brand-soft-grey text-center my-auto font-serif italic text-lg">
                      Your cart is empty.
                    </p>
                  ) : (
                    items.map((item, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={`${item.id}-${item.size}-${item.color}`}
                        className="flex gap-6"
                      >
                        <div className="w-24 h-32 bg-brand-alabaster flex-shrink-0 overflow-hidden">
                          {item.thumbnail_url ? (
                            <img
                              src={item.thumbnail_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-brand-alabaster" />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-sm tracking-wide pr-4">
                                {item.name}
                              </h3>
                              <span className="text-sm font-mono">
                                {item.original_price && item.original_price > item.price && (
                                  <span className="line-through text-gray-400 mr-2 text-xs">
                                    PKR {item.original_price}
                                  </span>
                                )}
                                <span className={item.original_price && item.original_price > item.price ? "text-red-600 font-bold" : ""}>
                                  PKR {item.price}
                                </span>
                              </span>
                            </div>
                            <p className="text-xs text-brand-soft-grey mt-2 tracking-wider uppercase">
                              {item.color} / {item.size}
                            </p>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center border border-brand-soft-grey/50">
                              <button
                                className="p-2 hover:bg-brand-alabaster transition-colors"
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    addItem({ ...item, quantity: -1 });
                                  } else {
                                    removeItem(item.id);
                                  }
                                }}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs px-4 font-mono">
                                {item.quantity}
                              </span>
                              <button
                                className="p-2 hover:bg-brand-alabaster transition-colors"
                                onClick={() => addItem({ ...item, quantity: 1 })}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-brand-soft-grey hover:text-red-500 transition-colors uppercase text-[10px] tracking-widest font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="checkout"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="flex-1 p-8 flex flex-col items-center justify-center"
                >
                  <svg
                    className="w-24 h-24 text-green-500 mb-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d="M20 6L9 17l-5-5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </svg>
                  <h3 className="text-2xl font-serif text-brand-obsidian mb-2">
                    Order Confirmed
                  </h3>
                  <p className="text-brand-soft-grey text-center">
                    Thank you for your purchase. Your receipt has been sent.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {items.length > 0 && checkoutStep === 0 && (
              <div className="p-8 border-t border-brand-soft-grey/30 bg-brand-pure-white">
                <div className="flex justify-between mb-8 font-semibold uppercase tracking-[0.2em] text-sm font-sans">
                  <span>Subtotal</span>
                  <span className="font-mono tracking-normal">
                    PKR {total.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-brand-obsidian text-brand-pure-white py-6 rounded-full uppercase tracking-[0.2em] text-sm font-bold shadow-2xl hover:scale-[1.02] transition-transform"
                >
                  Continue to Pay
                </button>
              </div>
            )}

            {checkoutStep === 1 && (
              <div className="p-8 border-t border-brand-soft-grey/30 bg-brand-pure-white">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setTimeout(() => {
                      setItems([]);
                      setCheckoutStep(0);
                    }, 500);
                  }}
                  className="w-full bg-brand-alabaster text-brand-obsidian py-5 uppercase tracking-[0.2em] text-xs font-semibold hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function ShopLayout() {
  useLenis(); // Initialize smooth scroll

  return (
    <CartProvider>
      <Header />
      <main className="min-h-screen bg-brand-pure-white">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
