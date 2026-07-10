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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    api.getProducts().then((data) => {
      // Show minimum 8 products as requested
      setFeaturedProducts(data.slice(0, 8)); 
    }).catch(console.error);
  }, []);

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen">
      
      {/* 1. Ultra Premium Hero Section (Minimalist Retail Style) */}
      <section className="relative w-full bg-black text-white overflow-hidden min-h-[85vh] flex flex-col items-center justify-center pt-24 pb-12">
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="w-full flex flex-col items-center">
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl font-bold mb-6 tracking-tight leading-[1.1]">
              Precision.<br />Redefined.
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-2xl mb-10 text-gray-400 font-light max-w-2xl">
              Uncompromising accuracy for the modern laboratory. Experience the next generation of analytical instruments.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex gap-4">
              <Link 
                to="/catalog" 
                className="bg-white text-black px-8 py-4 rounded-full font-semibold text-sm hover:bg-gray-200 transition-colors"
              >
                Shop Now
              </Link>
              <Link 
                to="/catalog?category=Benchtop Meters" 
                className="bg-transparent border border-gray-600 text-white px-8 py-4 rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto mt-16 px-6">
            <motion.img 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              src="https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=1200&auto=format&fit=crop" 
              alt="Professional Lab Equipment" 
              className="w-full h-auto object-cover rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            />
        </div>
      </section>

      {/* 1.5 Featured Products (8 Products Grid) */}
      <section className="bg-white py-32 border-b border-gray-100">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
          className="max-w-[1400px] mx-auto px-6 lg:px-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-4">Featured.</motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-500 text-xl">The standard in analytical excellence.</motion.p>
            </div>
            <motion.div variants={fadeInUp}>
              <Link to="/catalog" className="text-black font-semibold text-sm hover:underline flex items-center gap-1 group">
                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
          
          {/* Changed to an 8 item grid with clean, flat aesthetics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <motion.div variants={fadeInUp} key={product.id} className="h-full">
                  <Link to={`/product/${product.id}`} className="bg-gray-50/50 p-6 transition-all duration-300 group flex flex-col h-full hover:bg-gray-100">
                    <div className="aspect-square flex items-center justify-center mb-8 p-4 bg-white border border-gray-100">
                      <img src={product.thumbnail_url} alt={product.name} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                    </div>
                    <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">{product.sku}</div>
                    <h3 className="text-black font-semibold text-lg mb-4 leading-snug line-clamp-2">{product.name}</h3>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xl font-bold text-black">PKR {Number(product.price).toLocaleString()}</span>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-400">Loading products...</div>
            )}
          </div>
        </motion.div>
      </section>

      {/* 2. Product Line Grid */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="mb-20">
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight">Categories.</motion.h2>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CATEGORIES.map((cat, idx) => (
              <motion.div variants={fadeInUp} key={idx} className="flex flex-col group h-full bg-white p-8 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-black text-3xl font-bold mb-4">{cat.name}</h3>
                <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">{cat.desc}</p>
                <div className="w-full aspect-video bg-gray-100 flex items-center justify-center mb-8 overflow-hidden">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <Link to={`/catalog?category=${cat.name}`} className="inline-flex items-center gap-2 text-black font-semibold hover:underline mt-auto">
                  Explore {cat.name} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Marquee Brands Section */}
      <section className="bg-white py-24 overflow-hidden border-y border-gray-100">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16 px-6">
          <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">Industry Leaders</h2>
        </motion.div>
        
        <div className="relative w-full overflow-hidden flex" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          <motion.div 
            animate={{ x: ["0%", "-50%"] }} 
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }} 
            className="flex whitespace-nowrap gap-16 items-center w-max px-8"
          >
            {Array(4).fill(null).map((_, i) => (
              <React.Fragment key={i}>
                {BRANDS.map((brand, j) => (
                  <div key={`${i}-${j}`} className="w-32 md:w-40 flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 duration-300">
                     {brand.img.includes('http') ? (
                       <img src={brand.img} alt={brand.name} className="max-w-full max-h-16 object-contain" />
                     ) : (
                       <span className="text-black font-black text-xl">{brand.name}</span>
                     )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Trusted by Industry Grid */}
      <section className="py-32 bg-black text-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="mb-20">
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Applications.</motion.h2>
          </motion.div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            {INDUSTRIES.map((industry, idx) => (
              <motion.div variants={fadeInUp} key={idx} className="h-[400px] relative group overflow-hidden bg-gray-900">
                <Link to="/catalog?industry=true" className="block w-full h-full">
                  <img 
                    src={industry.image} 
                    alt={industry.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                  />
                  <div className="absolute inset-0 flex items-end p-8">
                    <h3 className="text-white text-3xl font-bold leading-tight max-w-xs">
                      {industry.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. Support Banner */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { icon: Award, title: "Premium Quality", desc: "Industry standard" },
              { icon: ShieldCheck, title: "Secure Checkout", desc: "100% protected" },
              { icon: Users, title: "Expert Support", desc: "Dedicated team" },
              { icon: HeadphonesIcon, title: "24/7 Service", desc: "Always here" },
              { icon: Truck, title: "Fast Delivery", desc: "Nationwide shipping" }
            ].map((item, idx) => (
              <motion.div variants={fadeInUp} key={idx} className="flex flex-col items-start border-t border-gray-200 pt-8">
                <item.icon className="w-8 h-8 text-black mb-6" strokeWidth={1.5} />
                <h4 className="font-semibold text-lg text-black mb-2">{item.title}</h4>
                <p className="text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
