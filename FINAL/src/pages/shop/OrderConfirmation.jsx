import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle, Clock } from "lucide-react";

export function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, status } = location.state || {};

  if (!orderId) {
    return (
      <div className="pt-32 min-h-screen text-center">
        No order found. <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white p-12 border border-gray-100 text-center shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          {status === "confirmed" ? (
            <CheckCircle className="w-16 h-16 text-green-500" />
          ) : (
            <Clock className="w-16 h-16 text-brand-obsidian" />
          )}
        </div>

        <h1 className="text-3xl font-serif mb-4 text-brand-obsidian tracking-wide">
          {status === "confirmed" ? "Order Confirmed" : "Order Placed"}
        </h1>

        <div className="bg-gray-50 border border-gray-200 p-6 mb-8 text-left mt-8">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Order No.</p>
          <p className="font-mono text-xl text-brand-obsidian tracking-tight">{orderId}</p>
        </div>

        <p className="text-gray-600 leading-relaxed mb-10">
          {status === "confirmed"
            ? "Your payment was successful. We will send you an email with your tracking details once your order ships."
            : "Your bank transfer order is pending verification. Our staff will review your payment and update the status shortly."}
        </p>

        <div className="flex gap-4" style={{ flexDirection: "column" }}>
          <button onClick={() => navigate("/track-order")} className="w-full bg-brand-obsidian text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors">
            Track Order
          </button>
          <button onClick={() => navigate("/")} className="w-full bg-transparent text-brand-obsidian py-4 text-xs font-bold uppercase tracking-widest border border-brand-obsidian hover:bg-brand-alabaster transition-colors">
            Return to Store
          </button>
        </div>
      </motion.div>
    </div>
  );
}
