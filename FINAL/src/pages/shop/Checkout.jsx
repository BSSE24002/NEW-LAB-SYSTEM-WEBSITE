import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { api } from "../../services/api";

export function Checkout() {
  const navigate = useNavigate();
  const { items, total, setItems } = useCart();

  const [formData, setFormData] = useState({ email: "", phone: "", address: "", city: "", zipCode: "" });
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [bankDetails, setBankDetails] = useState({ accountTitle: "", tid: "", screenshot: "" });
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isPlacing, setIsPlacing] = useState(false);
  const [touched, setTouched] = useState({});

  const shippingCharges = items.length > 0 ? 250 : 0;
  const finalTotal = total + shippingCharges - discountAmount;

  const handleApplyDiscount = async () => {
    try {
      const coupon = await api.validateCoupon(discountCode);
      if (coupon.type === "percentage") {
        setDiscountAmount((total * coupon.value) / 100);
      } else {
        setDiscountAmount(coupon.value);
      }
    } catch {
      alert("Invalid or expired discount code");
      setDiscountAmount(0);
    }
  };

  const handleConfirmOrder = async () => {
    if (items.length === 0) return;

    // Mark all fields as touched to show errors
    setTouched({ email: true, phone: true, address: true, city: true, zipCode: true, accountTitle: true, tid: true });

    // Validate required fields
    if (
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.zipCode.trim() ||
      (paymentMethod === "bank" && (!bankDetails.accountTitle.trim() || !bankDetails.tid.trim()))
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Card payment removed

    setIsPlacing(true);
    try {
      const newOrder = await api.createOrder({
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        payment_method: "bank_transfer",
        payment_details: { accountTitle: bankDetails.accountTitle, tid: bankDetails.tid, screenshot: bankDetails.screenshot },
        subtotal: total,
        shipping: shippingCharges,
        discount: discountAmount,
        total_amount: finalTotal,
        items: items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price, sku: i.id, product_id: i.product_id || null, size: i.size || null })),
      });

      setItems([]);
      navigate("/checkout/confirmation", { state: { orderId: newOrder.order_code || newOrder.id, status: newOrder.status } });
    } catch (e) {
      alert(`Order failed: ${e.message}`);
    } finally {
      setIsPlacing(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setBankDetails({ ...bankDetails, screenshot: reader.result });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen text-center flex flex-col items-center justify-center">
        <h1 className="text-3xl font-serif mb-6 text-brand-obsidian">Your cart is empty.</h1>
        <button onClick={() => navigate("/catalog")} className="text-gray-400 hover:text-brand-obsidian uppercase tracking-[0.2em] text-[10px] font-bold transition-colors">
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-brand-obsidian mb-12 transition-colors">
        <ArrowLeft className="w-3 h-3 mr-3" /> Back
      </button>

      <div className="flex flex-col lg:flex-row gap-20">
        <div className="flex-1 space-y-16">
          <section>
            <h2 className="text-2xl font-serif mb-8 tracking-wide text-brand-obsidian">Contact Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address <span className="text-red-500">*</span></label>
                <input type="email" required placeholder="e.g. john@example.com"
                  className={`w-full p-4 bg-[#FAFAFA] border outline-none focus:border-brand-obsidian transition-colors font-mono text-sm ${touched.email && !formData.email.trim() ? 'border-red-400' : 'border-gray-200'}`}
                  value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setTouched({ ...touched, email: true }); }} />
                {touched.email && !formData.email.trim() && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-widest">Required</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" required placeholder="e.g. 0300-1234567"
                  className={`w-full p-4 bg-[#FAFAFA] border outline-none focus:border-brand-obsidian transition-colors font-mono text-sm ${touched.phone && !formData.phone.trim() ? 'border-red-400' : 'border-gray-200'}`}
                  value={formData.phone} onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setTouched({ ...touched, phone: true }); }} />
                {touched.phone && !formData.phone.trim() && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-widest">Required</p>}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-8 tracking-wide text-brand-obsidian">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Full Address <span className="text-red-500">*</span></label>
                <input type="text" required placeholder="Street, House No, Area"
                  className={`w-full p-4 bg-[#FAFAFA] border outline-none focus:border-brand-obsidian transition-colors font-mono text-sm ${touched.address && !formData.address.trim() ? 'border-red-400' : 'border-gray-200'}`}
                  value={formData.address} onChange={(e) => { setFormData({ ...formData, address: e.target.value }); setTouched({ ...touched, address: true }); }} />
                {touched.address && !formData.address.trim() && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-widest">Required</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">City <span className="text-red-500">*</span></label>
                  <input type="text" required placeholder="e.g. Karachi"
                    className={`w-full p-4 bg-[#FAFAFA] border outline-none focus:border-brand-obsidian transition-colors font-mono text-sm ${touched.city && !formData.city.trim() ? 'border-red-400' : 'border-gray-200'}`}
                    value={formData.city} onChange={(e) => { setFormData({ ...formData, city: e.target.value }); setTouched({ ...touched, city: true }); }} />
                  {touched.city && !formData.city.trim() && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-widest">Required</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">ZIP Code <span className="text-red-500">*</span></label>
                  <input type="text" required placeholder="e.g. 75500"
                    className={`w-full p-4 bg-[#FAFAFA] border outline-none focus:border-brand-obsidian transition-colors font-mono text-sm ${touched.zipCode && !formData.zipCode.trim() ? 'border-red-400' : 'border-gray-200'}`}
                    value={formData.zipCode} onChange={(e) => { setFormData({ ...formData, zipCode: e.target.value }); setTouched({ ...touched, zipCode: true }); }} />
                  {touched.zipCode && !formData.zipCode.trim() && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-widest">Required</p>}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-8 tracking-wide text-brand-obsidian">Payment Method</h2>
            <div className="space-y-4">
              {/* Card option removed */}
              <label className={`block p-5 border cursor-pointer transition-colors ${paymentMethod === "bank" ? "border-brand-obsidian bg-gray-50" : "border-gray-200 bg-[#FAFAFA]"}`}>
                <div className="flex items-center">
                  <input type="radio" name="payment" value="bank" checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")} className="mr-4 w-4 h-4 accent-brand-obsidian" />
                  <span className="font-bold uppercase tracking-widest text-[10px] text-brand-obsidian mt-0.5">Bank Transfer</span>
                </div>
              </label>
            </div>

            {paymentMethod === "bank" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 p-8 border border-gray-200 bg-[#FAFAFA]">
                <div className="mb-6">
                  <h3 className="font-bold uppercase tracking-widest text-[10px] mb-2 text-brand-obsidian">Bank Account Details</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Please transfer the total amount to the following account:</p>
                </div>
                <div className="font-mono text-sm mb-6 bg-white p-5 border border-gray-200 shadow-sm">
                  <p className="mb-1 text-gray-500 uppercase tracking-widest text-[10px]">Bank</p><p className="mb-4">New Lab Bank</p>
                  <p className="mb-1 text-gray-500 uppercase tracking-widest text-[10px]">Account Title</p><p className="mb-4">NEW LAB OFFICIAL</p>
                  <p className="mb-1 text-gray-500 uppercase tracking-widest text-[10px]">Account No</p><p>1234 5678 9101 1121</p>
                </div>
                <div className="space-y-4">
                  <input type="text" required placeholder="Account Title from which you paid" className="w-full p-4 border border-gray-200 outline-none focus:border-brand-obsidian text-sm font-mono" value={bankDetails.accountTitle} onChange={(e) => setBankDetails({ ...bankDetails, accountTitle: e.target.value })} />
                  <input type="text" required placeholder="Transaction ID (TID)" className="w-full p-4 border border-gray-200 outline-none focus:border-brand-obsidian text-sm font-mono" value={bankDetails.tid} onChange={(e) => setBankDetails({ ...bankDetails, tid: e.target.value })} />
                  <div className="pt-4">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-3 text-gray-400">Upload Screenshot of Payment</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-3 border border-gray-200 text-xs bg-white font-mono file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-[0.15em] file:bg-gray-50 file:text-brand-obsidian hover:file:bg-gray-100 transition-colors cursor-pointer" />
                  </div>
                </div>
              </motion.div>
            )}
          </section>
        </div>

        <div className="lg:w-[450px]">
          <div className="sticky top-32 p-8 border border-gray-200 bg-[#FAFAFA]">
            <h2 className="text-2xl font-serif mb-8 tracking-wide text-brand-obsidian">Order Summary</h2>
            <div className="space-y-6 mb-8 overflow-y-auto max-h-[40vh] pr-2 no-scrollbar">
              {items.map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-16 h-20 bg-gray-100 flex-shrink-0 overflow-hidden">
                    {item.thumbnail_url ? (
                      <img src={item.thumbnail_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between pt-1">
                    <div>
                      <h4 className="font-serif text-sm tracking-wide text-brand-obsidian">{item.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{item.color} / {item.size} x {item.quantity}</p>
                    </div>
                    <div className="font-mono text-xs">
                      {item.original_price && item.original_price > item.price && (
                        <span className="line-through text-gray-400 mr-2">PKR {(item.original_price * item.quantity).toFixed(2)}</span>
                      )}
                      <span className={item.original_price && item.original_price > item.price ? "text-red-600 font-bold" : ""}>
                        PKR {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="py-6 border-t border-gray-200 space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Subtotal</span><span className="font-mono text-brand-obsidian">PKR {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Shipping</span><span className="font-mono text-brand-obsidian">PKR {shippingCharges.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-green-600">
                  <span>Discount</span><span className="font-mono">- PKR {discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="py-4 mb-6">
              <div className="flex gap-2">
                <input type="text" placeholder="Coupon Code" className="w-full p-4 bg-white border border-gray-200 outline-none focus:border-brand-obsidian text-xs font-mono uppercase" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} />
                <button onClick={handleApplyDiscount} className="bg-brand-obsidian text-white px-6 text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors">Apply</button>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8 pt-6 border-t border-gray-200">
              <span className="font-bold uppercase tracking-widest text-[10px] text-gray-400 mb-1">Total</span>
              <span className="font-mono text-xl font-bold text-brand-obsidian">PKR {finalTotal.toFixed(2)}</span>
            </div>

            <button onClick={handleConfirmOrder} disabled={items.length === 0 || isPlacing}
              className="w-full bg-brand-obsidian text-white py-5 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isPlacing ? "Placing Order..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
