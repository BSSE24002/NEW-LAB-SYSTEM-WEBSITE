import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, ArrowLeft } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { api } from "../../services/api";

export function CardPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, setItems } = useCart();
  const { formData, finalTotal, discountAmount, shippingCharges } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  if (!formData) {
    return (
      <div className="pt-32 min-h-screen text-center">
        Invalid access. <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const handlePay = async () => {
    if (!cardNumber || !expiry || !cvv) {
      alert("Please enter full card details");
      return;
    }
    setLoading(true);
    try {
      const newOrder = await api.createOrder({
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        payment_method: "card",
        payment_details: { last4: cardNumber.slice(-4) },
        subtotal: finalTotal - shippingCharges + discountAmount,
        shipping: shippingCharges,
        discount: discountAmount,
        total_amount: finalTotal,
        items: items.map((i) => ({
          name: i.name,
          qty: i.quantity,
          price: i.price,
          sku: i.id,
          product_id: i.product_id || null,
          size: i.size || null,
        })),
      });

      setItems([]);
      navigate("/checkout/confirmation", { state: { orderId: newOrder.order_code || newOrder.id, status: newOrder.status } });
    } catch (e) {
      alert(`Payment failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 shadow-xl relative">
        <button onClick={() => navigate(-1)}
          className="absolute -top-12 left-0 flex items-center text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5 text-green-600" />
          </div>
        </div>

        <h2 className="text-xl font-serif mb-2 text-center text-brand-obsidian">Secure Card Payment</h2>
        <p className="text-center text-xs text-gray-500 mb-8 tracking-widest uppercase">Amount to Pay: PKR {finalTotal.toFixed(2)}</p>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-gray-500">Card Number</label>
            <input type="text" maxLength={19} placeholder="0000 0000 0000 0000"
              className="w-full p-4 border border-gray-200 outline-none focus:border-black font-mono text-sm"
              value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-gray-500">Expiry Date</label>
              <input type="text" maxLength={5} placeholder="MM/YY"
                className="w-full p-4 border border-gray-200 outline-none focus:border-black font-mono text-sm"
                value={expiry} onChange={(e) => setExpiry(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-gray-500">CVV</label>
              <input type="password" maxLength={3} placeholder="123"
                className="w-full p-4 border border-gray-200 outline-none focus:border-black font-mono text-sm"
                value={cvv} onChange={(e) => setCvv(e.target.value)} />
            </div>
          </div>

          <button onClick={handlePay} disabled={loading}
            className="w-full bg-brand-obsidian text-brand-pure-white py-5 rounded-none uppercase tracking-[0.2em] text-xs font-bold hover:bg-black transition-colors disabled:opacity-50 relative overflow-hidden mt-4">
            {loading ? (
              <motion.div initial={{ left: "-100%" }} animate={{ left: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute top-0 bottom-0 w-1/3 bg-white/20 skew-x-12" />
            ) : null}
            {loading ? "Processing..." : `Pay PKR ${finalTotal.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
