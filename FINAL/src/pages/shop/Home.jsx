import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { motion } from "motion/react";
import { ShieldCheck, Truck, HeadphonesIcon, Award, Users, ChevronRight, ArrowRight } from "lucide-react";

const CATEGORIES = [
  { 
    name: "Handheld Testers", 
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop",
    desc: "Test like a pro on the go. Pocket-sized. Lightweight. Convenient. Start collecting consistent readings anywhere."
  },
  { 
    name: "Portable Meters", 
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
    desc: "Built for the lab or field. Durable. Reliable. Easy to use. Verify on the spot and test multiple parameters at once."
  },
  { 
    name: "Benchtop Meters", 
    image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=800&auto=format&fit=crop",
    desc: "Suited for many applications. Advanced. Versatile. Accurate. Surpass quality standards with our dependable Benchtop Meters."
  },
  { 
    name: "Automatic Titrators", 
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop",
    desc: "Get peace of mind and full support. Precise. Accurate. High-Performing. Attain exact, repeatable measurements."
  }
];

const BRANDS = [
  { name: "HANNA instruments", img: "https://cdn2.hubspot.net/hubfs/2134380/Hanna-Logo-Blue-2023.png?width=140&height=44&name=Hanna-Logo-Blue-2023.png" },
  { name: "WILLE55", img: "https://www.wile.fi/wp-content/themes/farmcomp/assets/wile-logo.svg" },
  { name: "GroLine", img: "https://www.groline.com/we/we.dll/Pic?UN=20747&F=C&T=801&Age=1512596728" },
  { name: "Pyrex Glassware", img: "https://th.bing.com/th/id/R.2e2e428a261f26a09f88804dbb1c640a?rik=DS%2box%2fKVtyTdig&pid=ImgRaw&r=0" },
  { name: "Merck", img: "https://www.sigmaaldrich.com/static/logos/purple/merck.svg" },
  { name: "VWR", img: "https://occapi.avantorsciences.com/medias/vwr-part-of-avantor-logo.svg?context=bWFzdGVyfGltYWdlc3w1ODI1fGltYWdlL3N2Zyt4bWx8YUdWaEwyZzFaQzh4TURNNE16Z3hPVFUzTVRJek1DOTJkM0l0Y0dGeWRDMXZaaTFoZG1GdWRHOXlMV3h2WjI4dWMzWm58MTYzNTM4ZGQwNzhhZDQ4NjNjYTEzOWZkZTQzNWZhNGU4YTgzZTEyMGE3Y2Y3MGMzMjRkYWY4YjVhOWY3OTUxYg" }
];

const INDUSTRIES = [
  { name: "Food manufacturing", image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=600&auto=format&fit=crop" },
  { name: "Laboratory analysis", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop" },
  { name: "Industrial and metal finishing", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop" },
  { name: "Water treatment and municipalities", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop" }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    api.getProducts().then((data) => {
      setFeaturedProducts(data.slice(0, 8));
    }).catch(console.error);
  }, []);

  return (
    <div className="bg-[#f4f8fb] text-gray-900 font-sans min-h-screen overflow-hidden">
      
      {/* 1. Ultra Premium Hero Section */}
      <section className="relative w-full flex flex-col md:flex-row bg-[#0A2540] overflow-hidden min-h-[90vh]">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2540] via-[#0056b3]/20 to-[#0A2540] opacity-80" />
        <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-[#0056b3]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-400/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center items-start px-8 py-16 md:px-24 text-white">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-xl">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-8 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-50">Enterprise Grade</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
              Experience precision.
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl mb-10 text-blue-100/90 font-light leading-relaxed">
              One meter. One parameter. One result. Confidently check pH and elevate your quality assurance process with unparalleled accuracy.
            </motion.p>
            
            <motion.div variants={fadeInUp}>
              <Link 
                to="/catalog?category=Benchtop Meters" 
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-8 py-4 font-bold text-[#0A2540] transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest text-sm">
                  Explore Edge <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
            <motion.img 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              src="https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=800&auto=format&fit=crop" 
              alt="edge pH Meter" 
              className="max-w-full h-auto drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)] object-contain mix-blend-screen opacity-90 rounded-3xl"
              whileHover={{ scale: 1.05, rotate: -2, transition: { duration: 0.5 } }}
            />
        </div>
      </section>

      {/* 1.5 Featured Products (Dynamic from DB) */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10"
        >
          <div className="flex justify-between items-end mb-16">
            <div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-[#0A2540] tracking-tight mb-2">Featured Instruments</motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-500 text-lg">Top-rated equipment for your laboratory</motion.p>
            </div>
            <motion.div variants={fadeInUp}>
              <Link to="/catalog" className="text-[#0056b3] font-bold text-sm uppercase tracking-widest hover:text-[#0A2540] flex items-center gap-1 transition-colors group">
                View Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 4).map(product => (
                <motion.div variants={fadeInUp} key={product.id} className="h-full">
                  <Link to={`/product/${product.id}`} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 group flex flex-col h-full relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-10">
                      {product.sku}
                    </div>
                    <div className="aspect-square flex items-center justify-center mb-6 p-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <img src={product.thumbnail_url} alt={product.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply relative z-10" />
                    </div>
                    <h3 className="text-[#0A2540] font-bold text-xl mb-3 leading-tight group-hover:text-[#0056b3] transition-colors line-clamp-2">{product.name}</h3>
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-2xl font-extrabold text-[#0A2540]">PKR {Number(product.price).toLocaleString()}</span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#0056b3] group-hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-4 text-center py-20 text-gray-400 font-medium">Initializing instruments database...</div>
            )}
          </div>
        </motion.div>
      </section>

      {/* 2. Product Line Grid */}
      <section className="py-24 max-w-[1400px] mx-auto px-6 lg:px-12 relative">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-20 max-w-3xl mx-auto">
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-[#0A2540] mb-6 tracking-tight">Equipment you can rely on</motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-500 text-lg leading-relaxed">Discover our comprehensive range of high-performance analytical testing instruments engineered for absolute precision.</motion.p>
        </motion.div>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((cat, idx) => (
            <motion.div variants={fadeInUp} key={idx} className="flex flex-col group h-full">
              <div className="w-full aspect-[4/3] rounded-3xl bg-gray-100 flex items-center justify-center mb-6 overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 bg-[#0A2540]/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h3 className="text-[#0A2540] text-2xl font-bold mb-3">{cat.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">{cat.desc}</p>
              <Link to={`/catalog?category=${cat.name}`} className="inline-flex items-center gap-2 text-[#0056b3] font-bold text-sm uppercase tracking-widest hover:text-[#0A2540] transition-colors">
                Shop Category <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. Marquee Brands Section */}
      <section className="bg-white py-24 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16 max-w-2xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A2540] mb-4">Find your favorites in one place</h2>
          <p className="text-gray-500 text-lg">Explore the world's most trusted analytical instrument brands.</p>
        </motion.div>
        
        <div className="relative w-full overflow-hidden flex" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          <motion.div 
            animate={{ x: ["0%", "-50%"] }} 
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }} 
            className="flex whitespace-nowrap gap-8 items-center w-max px-4"
          >
            {Array(4).fill(null).map((_, i) => (
              <React.Fragment key={i}>
                {BRANDS.map((brand, j) => (
                  <div key={`${i}-${j}`} className="w-40 h-32 md:w-48 md:h-36 bg-[#f4f8fb] rounded-2xl flex items-center justify-center p-6 hover:shadow-md transition-shadow">
                     {brand.img.includes('http') ? (
                       <img src={brand.img} alt={brand.name} className="max-w-full max-h-full object-contain transition-transform hover:scale-110 duration-500" />
                     ) : (
                       <span className="text-[#0056b3] font-black text-xl">{brand.name}</span>
                     )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Trusted by Industry Grid */}
      <section className="py-24 bg-[#0A2540] relative overflow-hidden">
        {/* Abstract background blur for depth */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[100px]" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-20 max-w-3xl mx-auto">
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Trusted by industry professionals</motion.h2>
            <motion.p variants={fadeInUp} className="text-blue-100/80 text-lg">Get the job done with scientific testing equipment tailored for your specific environment.</motion.p>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INDUSTRIES.map((industry, idx) => (
              <motion.div variants={fadeInUp} key={idx} className="h-full">
                <Link to="/catalog?industry=true" className="group relative flex flex-col items-center h-full rounded-3xl overflow-hidden shadow-2xl block">
                  <div className="w-full aspect-[4/5] relative">
                    <img 
                      src={industry.image} 
                      alt={industry.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {/* Glassmorphism gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-[#0A2540]/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white text-xl font-bold leading-snug mb-2">
                        {industry.name}
                      </h3>
                      <div className="h-1 w-8 bg-[#0056b3] rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. Support Banner */}
      <section className="py-24 bg-[#f4f8fb] border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A2540] tracking-tight">We're here to support your testing needs</h2>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: Award, title: "Shop Best Sellers", desc: "Top rated equipment" },
              { icon: ShieldCheck, title: "Technical Support", desc: "Product assistance" },
              { icon: Users, title: "Product Experts", desc: "Learn more" },
              { icon: HeadphonesIcon, title: "Customer Service", desc: "Order updates" },
              { icon: Truck, title: "Free Shipping", desc: "Orders over 50,000 PKR" }
            ].map((item, idx) => (
              <motion.div variants={fadeInUp} key={idx} className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-shadow group">
                <div className="w-16 h-16 rounded-2xl bg-[#f4f8fb] text-[#0056b3] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#0056b3] group-hover:text-white transition-all duration-300">
                  <item.icon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-sm text-[#0A2540] mb-2 text-center">{item.title}</h4>
                <p className="text-xs text-gray-500 text-center">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
