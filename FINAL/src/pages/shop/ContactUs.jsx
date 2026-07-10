import React, { useState } from "react";
import { ScrollReveal } from "../../components/shop/ScrollReveal";
import { ScrambleText } from "../../components/shop/ScrambleText";
import { MagneticButton } from "../../components/shop/MagneticButton";

export function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div className="bg-brand-pure-white text-brand-obsidian min-h-screen pt-40 pb-20">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <h2 className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-400 mb-6 text-center">Support</h2>
          <ScrambleText text="CONTACT US" className="text-4xl md:text-6xl font-serif font-black tracking-tighter uppercase mb-20 text-center" />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <ScrollReveal>
            <div className="space-y-12">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-4">Customer Care</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  Have a question about an order, sizing, or our products? Our team is available Monday to Friday, 9am - 6pm PKT.
                </p>
                <a href="mailto:support@newlab.com" className="text-brand-obsidian font-bold tracking-widest text-xs uppercase border-b border-brand-obsidian pb-1">
                  support@newlab.com
                </a>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-4">Wholesale & Press</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  For all B2B inquiries, stockist requests, and media relations, please reach out to our partnerships team.
                </p>
                <a href="mailto:partnerships@newlab.com" className="text-brand-obsidian font-bold tracking-widest text-xs uppercase border-b border-brand-obsidian pb-1">
                  partnerships@newlab.com
                </a>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:border-brand-obsidian transition-colors text-sm font-sans"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:border-brand-obsidian transition-colors text-sm font-sans"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Message</label>
                <textarea
                  required
                  rows="5"
                  className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:border-brand-obsidian transition-colors text-sm font-sans resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              
              <MagneticButton as="button" disabled={status === "sending"} className="w-full">
                <div className="w-full text-center px-10 py-5 bg-brand-obsidian text-white uppercase tracking-[0.2em] text-xs font-bold transition-all duration-300 hover:bg-black">
                  {status === "sending" ? "Sending..." : status === "sent" ? "Message Sent!" : "Send Message"}
                </div>
              </MagneticButton>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
