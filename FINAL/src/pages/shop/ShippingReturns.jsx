import React from "react";
import { ScrollReveal } from "../../components/shop/ScrollReveal";
import { ScrambleText } from "../../components/shop/ScrambleText";
import { Package, RefreshCcw, ShieldCheck } from "lucide-react";

export function ShippingReturns() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-brand-pure-white text-brand-obsidian min-h-screen pt-40 pb-20">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <h2 className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-400 mb-6 text-center">Support</h2>
          <ScrambleText text="SHIPPING & RETURNS" className="text-4xl md:text-6xl font-serif font-black tracking-tighter uppercase mb-20 text-center" />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl h-full border border-gray-100">
              <Package className="w-10 h-10 mb-6 text-brand-obsidian" />
              <h3 className="font-black uppercase tracking-widest text-sm mb-4">Express Delivery</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Fast, reliable shipping nationwide. Free shipping on orders over PKR 5,999.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl h-full border border-gray-100">
              <RefreshCcw className="w-10 h-10 mb-6 text-brand-obsidian" />
              <h3 className="font-black uppercase tracking-widest text-sm mb-4">30-Day Returns</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Not perfectly satisfied? Return unworn items within 30 days for a full refund or exchange.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl h-full border border-gray-100">
              <ShieldCheck className="w-10 h-10 mb-6 text-brand-obsidian" />
              <h3 className="font-black uppercase tracking-widest text-sm mb-4">Secure Transit</h3>
              <p className="text-gray-500 text-xs leading-relaxed">All parcels are fully insured and tracked from our warehouse to your doorstep.</p>
            </div>
          </ScrollReveal>
        </div>

        <div className="space-y-16">
          <ScrollReveal>
            <h3 className="text-2xl font-serif font-black uppercase tracking-wide mb-6">Shipping Policy</h3>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed font-sans">
              <p>We process and dispatch all orders within 24-48 hours of order confirmation. Delivery typically takes 2-4 business days for major cities and 3-5 business days for remote areas.</p>
              <p>You will receive a tracking link via email and SMS as soon as your order leaves our facility. Please ensure someone is available at the provided address to receive the package.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <h3 className="text-2xl font-serif font-black uppercase tracking-wide mb-6">Returns & Exchanges</h3>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed font-sans">
              <p>Items must be returned in their original condition, unworn, unwashed, and with all tags attached. Returns that do not meet our policy will not be accepted and will be sent back to the customer.</p>
              <p>To initiate a return or exchange, please contact our support team with your order number. Return shipping costs are the responsibility of the customer unless the item received is defective or incorrect.</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
