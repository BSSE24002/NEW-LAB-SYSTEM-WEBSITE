import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ScrollReveal } from "../../components/shop/ScrollReveal";
import { ProductCard } from "../../components/shop/ProductCard";
import { api } from "../../services/api";
import { Loader2, ArrowRight, Activity, Cpu, Database, ShieldCheck } from "lucide-react";

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    api
      .getProducts()
      .then((data) => setFeaturedProducts(data.slice(0, 4)))
      .catch(() => setFeaturedProducts([]))
      .finally(() => setLoadingFeatured(false));
  }, []);

  const TABS = [
    {
      title: "Spectrometry",
      desc: "High-resolution mass and optical spectrometry systems engineered for precise molecular analysis at the nanogram level.",
      img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
      specs: ["Mass Range: 10-2000 m/z", "Resolution: >100,000", "Scan Rate: 50 Hz"]
    },
    {
      title: "Microscopy",
      desc: "Advanced scanning electron and confocal microscopes offering unprecedented clarity and sub-nanometer resolution.",
      img: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1600&auto=format&fit=crop",
      specs: ["Resolution: 0.8nm", "Magnification: 1,000,000x", "Detector: In-lens SE"]
    },
    {
      title: "Chromatography",
      desc: "Automated gas and liquid chromatography platforms designed for rapid, high-throughput volatile compound separation.",
      img: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1600&auto=format&fit=crop",
      specs: ["Pressure: up to 15,000 psi", "Flow Rate: 0.001 - 10 mL/min", "Oven Temp: 450°C"]
    }
  ];

  return (
    <div className="bg-brand-pure-white text-brand-obsidian font-sans">
      
      {/* 1. Split-Screen Hero */}
      <section className="relative min-h-[100svh] flex flex-col lg:flex-row pt-20">
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-20 py-20 z-10 bg-brand-pure-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-[2px] bg-brand-obsidian"></span>
              <span className="text-xs uppercase tracking-widest font-bold text-brand-obsidian/70">New Lab System</span>
            </div>
            <h1 className="text-[4rem] lg:text-[6rem] leading-[0.9] font-black uppercase tracking-tighter mb-8 text-brand-obsidian">
              Next-Gen<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-400">Analytics.</span>
            </h1>
            <p className="text-lg text-brand-obsidian/70 font-medium max-w-md leading-relaxed mb-12">
              Equip your laboratory with industry-leading precision instruments. Engineered for automated workflows, robust compliance, and absolute data integrity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalog" className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-obsidian text-white uppercase text-xs font-bold tracking-widest hover:bg-blue-600 transition-colors">
                Explore Catalog <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="flex items-center justify-center px-8 py-4 bg-transparent border border-brand-obsidian text-brand-obsidian uppercase text-xs font-bold tracking-widest hover:bg-brand-alabaster transition-colors">
                Request Demo
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto overflow-hidden bg-brand-obsidian">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }} 
            animate={{ scale: 1, opacity: 0.8 }} 
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1600&auto=format&fit=crop" 
            alt="Hero Instrument" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-brand-pure-white/20 lg:hidden" />
        </div>
      </section>

      {/* 2. Industries Served Marquee */}
      <section className="bg-brand-alabaster py-6 border-y border-brand-obsidian/10 overflow-hidden flex">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }} 
          className="flex whitespace-nowrap gap-16 text-brand-obsidian/40 text-sm font-bold uppercase tracking-[0.3em] w-max"
        >
          {Array(8).fill(null).map((_, i) => (
            <React.Fragment key={i}>
              <span>Pharmaceuticals</span>
              <span>•</span>
              <span>Biotechnology</span>
              <span>•</span>
              <span>Material Science</span>
              <span>•</span>
              <span>Clinical Diagnostics</span>
              <span>•</span>
            </React.Fragment>
          ))}
        </motion.div>
      </section>

      {/* 3. Technical Capabilities (Tabbed Interface) */}
      <section className="py-32 max-w-[1400px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-[2.5rem] md:text-[4rem] font-black uppercase tracking-tighter leading-none mb-4">Core Capabilities.</h2>
              <p className="text-brand-obsidian/60 max-w-lg font-medium">Discover our specialized product lines designed to meet the rigorous demands of modern analytical science.</p>
            </div>
            <div className="flex gap-4 border-b border-brand-obsidian/10 w-full md:w-auto">
              {TABS.map((tab, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors relative ${activeTab === idx ? 'text-brand-obsidian' : 'text-brand-obsidian/40 hover:text-brand-obsidian/70'}`}
                >
                  {tab.title}
                  {activeTab === idx && (
                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="bg-brand-alabaster rounded-3xl overflow-hidden min-h-[500px] flex flex-col md:flex-row relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full md:w-1/2 p-12 lg:p-20 flex flex-col justify-center"
            >
              <h3 className="text-3xl font-black uppercase tracking-tight mb-6">{TABS[activeTab].title}</h3>
              <p className="text-brand-obsidian/70 leading-relaxed mb-10">{TABS[activeTab].desc}</p>
              <div className="space-y-4 mb-10">
                {TABS[activeTab].specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold tracking-widest uppercase">{spec}</span>
                  </div>
                ))}
              </div>
              <Link to={`/catalog?category=${TABS[activeTab].title}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">
                View Instruments <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </AnimatePresence>

          <div className="w-full md:w-1/2 relative h-[300px] md:h-auto overflow-hidden">
             <AnimatePresence mode="wait">
               <motion.img 
                  key={activeTab}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={TABS[activeTab].img}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90"
               />
             </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 4. "Inside the Engineering" Feature */}
      <section className="bg-brand-obsidian text-brand-pure-white py-32 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
           <ScrollReveal>
             <div className="text-center mb-20">
               <h2 className="text-[3rem] md:text-[5rem] font-black uppercase tracking-tighter leading-none mb-6">Engineered for<br/>Absolute Certainty.</h2>
               <p className="text-brand-soft-grey max-w-2xl mx-auto text-lg">Every instrument is constructed with industrial-grade materials and integrated with smart telemetry for real-time performance monitoring.</p>
             </div>
           </ScrollReveal>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mt-12">
             <ScrollReveal>
               <div className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-6">
                   <Activity className="w-8 h-8 text-blue-400" />
                 </div>
                 <h4 className="text-xl font-bold uppercase tracking-widest mb-4">High Sensitivity</h4>
                 <p className="text-brand-soft-grey/80 text-sm leading-relaxed">Achieve sub-part-per-trillion detection limits with our proprietary signal enhancement technology.</p>
               </div>
             </ScrollReveal>
             <ScrollReveal>
               <div className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-6">
                   <Cpu className="w-8 h-8 text-blue-400" />
                 </div>
                 <h4 className="text-xl font-bold uppercase tracking-widest mb-4">Automated Workflows</h4>
                 <p className="text-brand-soft-grey/80 text-sm leading-relaxed">Reduce manual errors with robotic sample handling and AI-driven predictive maintenance.</p>
               </div>
             </ScrollReveal>
             <ScrollReveal>
               <div className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-6">
                   <Database className="w-8 h-8 text-blue-400" />
                 </div>
                 <h4 className="text-xl font-bold uppercase tracking-widest mb-4">Data Integrity</h4>
                 <p className="text-brand-soft-grey/80 text-sm leading-relaxed">Built-in 21 CFR Part 11 compliance with encrypted audit trails and secure cloud backups.</p>
               </div>
             </ScrollReveal>
           </div>
        </div>
      </section>

      {/* 5. Featured Instruments Grid */}
      <section className="py-32 max-w-[1400px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-[2.5rem] md:text-[4rem] font-black uppercase tracking-tighter leading-none mb-4">Featured Systems.</h2>
              <p className="text-brand-obsidian/60 max-w-lg font-medium">Explore our flagship analytical instruments currently leading the industry in precision.</p>
            </div>
            <Link to="/catalog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-brand-obsidian pb-1 hover:text-blue-600 hover:border-blue-600 transition-colors">
              View Entire Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loadingFeatured ? (
            <div className="col-span-4 flex items-center justify-center py-20 text-brand-obsidian/30 gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs uppercase tracking-widest font-bold">Loading Systems...</span>
            </div>
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <div className="col-span-4 text-center py-20 text-brand-obsidian/30 text-xs uppercase tracking-widest font-bold">
              No instruments available
            </div>
          )}
        </div>
      </section>

      {/* 6. Performance Metrics */}
      <section className="py-24 bg-brand-alabaster border-y border-brand-obsidian/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-brand-obsidian/10">
           <ScrollReveal>
             <div className="flex flex-col items-center text-center pt-8 md:pt-0">
               <span className="text-5xl font-black text-blue-600 mb-2">40%</span>
               <span className="text-xs uppercase font-bold tracking-widest text-brand-obsidian/60 mb-2">Faster Throughput</span>
               <p className="text-sm font-medium">Optimize your lab's operational efficiency.</p>
             </div>
           </ScrollReveal>
           <ScrollReveal>
             <div className="flex flex-col items-center text-center pt-8 md:pt-0">
               <span className="text-5xl font-black text-blue-600 mb-2">&lt;0.01%</span>
               <span className="text-xs uppercase font-bold tracking-widest text-brand-obsidian/60 mb-2">Error Rate</span>
               <p className="text-sm font-medium">Unparalleled accuracy and reproducibility.</p>
             </div>
           </ScrollReveal>
           <ScrollReveal>
             <div className="flex flex-col items-center text-center pt-8 md:pt-0">
               <span className="text-5xl font-black text-blue-600 mb-2">ISO</span>
               <span className="text-xs uppercase font-bold tracking-widest text-brand-obsidian/60 mb-2">9001 Certified</span>
               <p className="text-sm font-medium">Manufactured under rigorous quality controls.</p>
             </div>
           </ScrollReveal>
        </div>
      </section>

      {/* 7. Streamlined Final CTA */}
      <section className="py-32 bg-brand-pure-white text-center px-6">
        <ScrollReveal>
          <h2 className="text-[3rem] md:text-[5rem] font-black uppercase tracking-tighter leading-none mb-8">Equip Your<br/>Laboratory Today.</h2>
          <p className="text-brand-obsidian/60 font-medium max-w-xl mx-auto mb-12">Contact our technical sales team for custom configurations, pricing, and live demonstrations of our systems.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="px-10 py-5 bg-brand-obsidian text-white uppercase text-xs font-bold tracking-widest hover:bg-blue-600 transition-colors">
              Consult an Expert
            </Link>
            <Link to="/catalog" className="px-10 py-5 bg-brand-alabaster border border-brand-obsidian/10 text-brand-obsidian uppercase text-xs font-bold tracking-widest hover:bg-gray-200 transition-colors">
              Browse Systems
            </Link>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
