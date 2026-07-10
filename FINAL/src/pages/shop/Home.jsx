import React, { useState, useEffect } from "react";
import { FabricReveal } from "../../components/shop/FabricReveal";
import { ProductCard } from "../../components/shop/ProductCard";
import { ScrambleText } from "../../components/shop/ScrambleText";
import { MagneticButton } from "../../components/shop/MagneticButton";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ScrollReveal } from "../../components/shop/ScrollReveal";
import { AccordionGallery } from "../../components/shop/AccordionGallery";
import { StackedImageSection } from "../../components/shop/StackedImageSection";
import { BentoCategories } from "../../components/shop/BentoCategories";
import { NewArrivalsSection } from "../../components/shop/NewArrivalsSection";
import { PhilosophyQuote } from "../../components/shop/PhilosophyQuote";
import { CampaignVideo } from "../../components/shop/CampaignVideo";
import { api } from "../../services/api";
import { Loader2 } from "lucide-react";

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    api
      .getProducts()
      .then((data) => setFeaturedProducts(data.slice(0, 4)))
      .catch(() => setFeaturedProducts([]))
      .finally(() => setLoadingFeatured(false));
  }, []);
  return (
    <div className="bg-brand-pure-white text-brand-obsidian">
      <section className="relative h-[100svh] bg-black overflow-hidden flex items-center justify-center">
        <motion.div initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0">
          <img fetchpriority="high" src="https://images.unsplash.com/photo-1594587895869-d90d9ab289f1?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Hero Campaign" className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </motion.div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 mt-20">
          <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-brand-soft-grey text-sm uppercase tracking-[0.4em] font-medium mb-6">REDEFINING MODERN BASICS</motion.h2>
          <ScrambleText text="ELEVATED" className="text-brand-pure-white text-[15vw] md:text-[12vw] leading-none tracking-tighter font-sans font-black uppercase text-center" />
          <ScrambleText text="ESSENTIALS." className="text-brand-pure-white text-[15vw] md:text-[12vw] leading-none tracking-tighter font-sans font-black uppercase text-center bg-clip-text bg-gradient-to-b from-white to-gray-500" />
          <div className="mt-16 flex gap-6">
            <Link to="/catalog"><MagneticButton as="div"><div className="px-10 py-5 bg-white text-black uppercase tracking-[0.2em] text-xs font-bold rounded-full">SHOP COLLECTION</div></MagneticButton></Link>
            <Link to="/about"><MagneticButton as="div"><div className="px-10 py-5 bg-transparent text-white uppercase tracking-[0.2em] text-xs font-bold rounded-full border border-white hover:bg-white/10 transition-all duration-500">OUR PHILOSOPHY</div></MagneticButton></Link>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[9px] text-white/50 tracking-[0.4em] uppercase font-bold">Scroll</span>
          <div className="w-px h-12 bg-white/20 relative overflow-hidden"><motion.div animate={{ y: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute inset-0 bg-white" /></div>
        </motion.div>
      </section>

      <section className="bg-brand-obsidian py-6 md:py-8 border-y flex overflow-hidden relative">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 45 }} className="flex whitespace-nowrap gap-12 text-brand-pure-white text-[2rem] md:text-[4rem] font-sans font-black uppercase tracking-tighter w-max leading-none">
          {Array(6).fill(null).map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-white">FREE SHIPPING OVER PKR 5,999</span>
              <span className="text-transparent" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.7)" }}>UNCOMPROMISING QUALITY</span>
              <span className="text-white">LIMITED STOCK</span>
              <span className="text-transparent" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.7)" }}>PREMIUM FABRICS</span>
            </React.Fragment>
          ))}
        </motion.div>
      </section>

      <NewArrivalsSection />
      <BentoCategories />
      <PhilosophyQuote />
      <FabricReveal />
      <CampaignVideo />

      <section className="py-40 bg-brand-pure-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <ScrollReveal>
            <h2 className="text-[3rem] md:text-[5rem] leading-none font-sans font-black tracking-tight uppercase mb-6 text-center">The Pursuit of<br />Perfection.</h2>
            <p className="text-brand-obsidian/70 text-lg font-medium max-w-2xl mx-auto text-center mb-24">Uncompromising quality starts with the raw materials. We source the heaviest organic cottons and purest textiles to create garments that outlast trends.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: "https://images.unsplash.com/photo-1630512874316-88dcd1925237?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Heavyweight Origins", desc: "Our signature 300GSM organic cotton provides unmatched structure." },
              { img: "https://i.pinimg.com/1200x/19/0a/63/190a63ce44054c8b61e1806f5094bab8.jpg", title: "Refined Details", desc: "From subtle embroidered logos to custom-dyed fabrics, every element is meticulously calibrated." },
              { img: "https://i.pinimg.com/736x/08/77/6c/08776c4c457e8d1268d38e2d50df7b2d.jpg", title: "Masterful Tailoring", desc: "Precision cut and triple-stitched for relaxed, modern silhouettes." },
            ].map(({ img, title, desc }) => (
              <ScrollReveal key={title}><div className="group cursor-pointer"><div className="aspect-[4/5] bg-brand-alabaster relative overflow-hidden mb-6 rounded-2xl"><img loading="lazy" src={img} className="w-full h-full object-cover grayscale opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" /></div><h3 className="text-xl font-black uppercase tracking-widest mb-2">{title}</h3><p className="text-sm text-brand-obsidian/60 font-medium leading-relaxed">{desc}</p></div></ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <StackedImageSection />
      <AccordionGallery />

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-40">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div>
            <ScrambleText text="THE COLLECTION." className="text-[3rem] md:text-[5rem] leading-none font-sans font-black tracking-tight mb-6" />
            <p className="text-brand-obsidian/70 text-lg md:text-xl font-medium max-w-lg">Everyday staples re-engineered for the modern silhouette.</p>
          </div>
          <Link to="/catalog" className="group flex items-center gap-2 text-sm uppercase font-black tracking-widest border-b-2 border-transparent hover:border-brand-obsidian pb-1 transition-colors">Explore All <span className="group-hover:translate-x-1 transition-transform">-&gt;</span></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {loadingFeatured ? (
              <div className="col-span-4 flex items-center justify-center py-16 text-brand-obsidian/30 gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs uppercase tracking-widest font-bold">Loading...</span>
              </div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="col-span-4 text-center py-16 text-brand-obsidian/30 text-xs uppercase tracking-widest font-bold">
                No products available
              </div>
            )}
          </div>
      </section>

      <section className="py-40 bg-brand-obsidian relative overflow-hidden flex items-center justify-center">
        <div className="relative z-10 w-full max-w-2xl mx-auto px-6 text-center text-brand-pure-white">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-sans font-black tracking-tighter uppercase mb-6">Join The Inner Circle.</h2>
            <p className="text-brand-soft-grey font-medium mb-12 text-sm tracking-widest uppercase leading-loose max-w-lg mx-auto">Unlock early access to our limited capsule drops and exclusive community events.</p>
            <form className="flex flex-col md:flex-row gap-6 items-center border-b border-brand-soft-grey/30 pb-4" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="EMAIL ADDRESS" className="flex-1 w-full bg-transparent p-2 text-sm font-bold tracking-[0.2em] uppercase focus:outline-none placeholder:text-brand-soft-grey/50" />
              <button className="text-xs font-bold tracking-[0.2em] uppercase hover:text-brand-soft-grey transition-colors shrink-0">Subscribe</button>
            </form>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-40 bg-brand-alabaster">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 flex flex-col items-start gap-8">
              <h2 className="text-[3rem] md:text-[4rem] leading-none font-sans font-black tracking-tight uppercase">Our Ethos</h2>
              <p className="text-brand-obsidian/70 text-lg leading-relaxed max-w-xl font-medium">In a world of excess, we choose intentionality. DRAPE is built on the belief that a wardrobe should be a curated collection of heavy-hitting essentials.</p>
              <Link to="/about" className="group flex items-center gap-2 text-sm uppercase font-black tracking-widest border-b-2 border-transparent hover:border-brand-obsidian pb-1 transition-colors mt-4">Discover Our Process <span className="group-hover:translate-x-1 transition-transform">-&gt;</span></Link>
            </div>
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4 pt-12">
                <ScrollReveal><img loading="lazy" src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" className="w-full h-[400px] object-cover rounded-2xl" alt="Tee 1" /></ScrollReveal>
                <ScrollReveal><img loading="lazy" src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop" className="w-full h-[300px] object-cover rounded-2xl" alt="Cap" /></ScrollReveal>
              </div>
              <div className="flex flex-col gap-4">
                <ScrollReveal><img loading="lazy" src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop" className="w-full h-[300px] object-cover rounded-2xl" alt="Tee 2" /></ScrollReveal>
                <ScrollReveal><img loading="lazy" src="https://images.unsplash.com/photo-1574015974293-817812ccf152?q=80&w=800&auto=format&fit=crop" className="w-full h-[400px] object-cover rounded-2xl" alt="Cap 2" /></ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-48 bg-black text-brand-pure-white overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 opacity-40">
          <img loading="lazy" src="https://images.unsplash.com/photo-1542406859-a5c9aa4be2ba?q=80&w=2500&auto=format&fit=crop" alt="Footer" className="w-full h-full object-cover grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80" />
        </div>
        <div className="relative z-10">
          <ScrollReveal>
            <h2 className="text-[3.5rem] md:text-[6rem] leading-none font-sans font-black tracking-tighter uppercase mb-2">Upgrade Your</h2>
            <h2 className="text-[3.5rem] md:text-[6rem] leading-none font-sans font-black tracking-tighter uppercase mb-12 text-transparent" style={{ WebkitTextStroke: "2px rgba(255,255,255,1)" }}>Uniform.</h2>
            <Link to="/catalog"><MagneticButton as="div"><div className="px-14 py-6 bg-white text-brand-obsidian uppercase tracking-[0.2em] text-sm font-bold rounded-full hover:scale-105 transition-transform duration-500 hover:bg-gray-200">Shop Collection</div></MagneticButton></Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
