import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { motion } from "motion/react";
import { ShieldCheck, Truck, HeadphonesIcon, Award, Users, ChevronRight } from "lucide-react";

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
  { name: "Pyrex Glassware", img: "https://www.corning.com/etc.clientlibs/settings/wcm/designs/corning/resources/images/global/logo-glass-bg.png" },
  { name: "Sigma", img: "https://th.bing.com/th/id/R.fd27f2806c4d7c4d86ccfbc3f27f0494?rik=ivH1iwsQUl5WEA&riu=http%3a%2f%2frndmate.com%2fcdn%2fshop%2fcollections%2fmilliporesigma-logo.png%3fv%3d1705792684&ehk=ly5xVIlPu1u5T7%2bxRrhrfAT0XDINLaWbRes7pRX34Uk%3d&risl=&pid=ImgRaw&r=0" },
  { name: "Merck", img: "https://www.sigmaaldrich.com/static/logos/purple/merck.svg" },
  { name: "VWR", img: "https://occapi.avantorsciences.com/medias/vwr-part-of-avantor-logo.svg?context=bWFzdGVyfGltYWdlc3w1ODI1fGltYWdlL3N2Zyt4bWx8YUdWaEwyZzFaQzh4TURNNE16Z3hPVFUzTVRJek1DOTJkM0l0Y0dGeWRDMXZaaTFoZG1GdWRHOXlMV3h2WjI4dWMzWm58MTYzNTM4ZGQwNzhhZDQ4NjNjYTEzOWZkZTQzNWZhNGU4YTgzZTEyMGE3Y2Y3MGMzMjRkYWY4YjVhOWY3OTUxYg" }
];

const INDUSTRIES = [
  { name: "Food manufacturing", image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=600&auto=format&fit=crop" },
  { name: "Laboratory analysis", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop" },
  { name: "Industrial and metal finishing", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop" },
  { name: "Water treatment and municipalities", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop" }
];

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    api.getProducts().then((data) => {
      setFeaturedProducts(data.slice(0, 8));
    }).catch(console.error);
  }, []);

  return (
    <div className="bg-white text-gray-900 font-sans">
      
      {/* 1. Clean Hero Section (Hanna Style) */}
      <section className="w-full flex flex-col md:flex-row bg-[#082952]">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-8 py-16 md:p-24 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Experience precision</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-lg leading-snug">
            One meter. One parameter. One result. Confidently check pH and improve your quality assurance process.
          </p>
          <Link 
            to="/catalog?category=Benchtop Meters" 
            className="border-2 border-white text-white hover:bg-white hover:text-[#082952] px-8 py-3 text-sm font-bold uppercase tracking-widest transition-colors"
          >
            Explore Edge
          </Link>
        </div>
        <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[600px] bg-gradient-to-br from-[#082952] to-[#04152b] flex items-center justify-center p-8">
            <img 
              src="https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=800&auto=format&fit=crop" 
              alt="edge pH Meter" 
              className="max-w-full h-auto drop-shadow-2xl object-contain mix-blend-screen opacity-90 hover:scale-105 transition-transform duration-700"
            />
        </div>
      </section>

      {/* 1.5 Featured Products (Dynamic from DB) */}
      <section className="bg-gray-50 py-20 border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Instruments</h2>
            <Link to="/catalog" className="text-[#0056b3] font-bold text-sm uppercase tracking-widest hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 4).map(product => (
                <Link to={`/product/${product.id}`} key={product.id} className="bg-white p-6 border border-gray-200 hover:shadow-lg transition-shadow group flex flex-col h-full">
                  <div className="aspect-square flex items-center justify-center mb-4 p-4">
                    <img src={product.thumbnail_url} alt={product.name} className="max-h-full object-contain group-hover:scale-105 transition-transform mix-blend-multiply" />
                  </div>
                  <span className="text-xs text-gray-400 mb-1">{product.sku}</span>
                  <h3 className="text-[#0056b3] font-bold text-lg mb-2 leading-tight group-hover:underline">{product.name}</h3>
                  <div className="mt-auto">
                    <span className="text-xl font-bold text-gray-900">PKR {Number(product.price).toLocaleString()}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-gray-500">Loading instruments...</div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Product Line Grid */}
      <section className="py-20 md:py-32 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Scientific testing equipment you can rely on</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="w-full aspect-square bg-gray-50 flex items-center justify-center mb-6 overflow-hidden">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-2/3 h-2/3 object-contain transition-transform duration-500 group-hover:scale-110 mix-blend-multiply"
                />
              </div>
              <h3 className="text-[#0056b3] text-xl font-bold mb-3">{cat.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 px-2">{cat.desc}</p>
              <Link to={`/catalog?category=${cat.name}`} className="mt-auto border-2 border-[#0056b3] text-[#0056b3] hover:bg-[#0056b3] hover:text-white px-8 py-2.5 text-sm font-bold uppercase transition-colors rounded-sm">
                Shop All
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Marquee Brands Section */}
      <section className="bg-gray-50 py-20 border-y border-gray-200 overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Find your favorites all in one place</h2>
          <p className="text-gray-600">Explore the analytical instrument brands you know and enjoy testing with the most</p>
        </div>
        
        <div className="relative w-full overflow-hidden flex">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }} 
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }} 
            className="flex whitespace-nowrap gap-12 items-center w-max px-6"
          >
            {Array(4).fill(null).map((_, i) => (
              <React.Fragment key={i}>
                {BRANDS.map((brand, j) => (
                  <div key={j} className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-4">
                     {brand.img.includes('http') ? (
                       <img src={brand.img} alt={brand.name} className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100" />
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
      <section className="py-20 md:py-32 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Trusted by industry professionals</h2>
          <p className="text-gray-600">Get the job done with scientific testing equipment made for you</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDUSTRIES.map((industry, idx) => (
            <Link to="/catalog?industry=true" key={idx} className="group flex flex-col items-center">
              <div className="w-full aspect-square overflow-hidden mb-4">
                <img 
                  src={industry.image} 
                  alt={industry.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h3 className="text-[#0056b3] text-lg font-bold text-center leading-snug hover:underline decoration-2 underline-offset-4">
                {industry.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Support Banner */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-16">We're here to support your testing needs</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 divide-x divide-gray-200">
            <div className="flex flex-col items-center px-4">
              <Award className="w-12 h-12 text-gray-900 mb-4" />
              <h4 className="font-bold text-sm text-gray-900 mb-2">Shop Best Sellers</h4>
            </div>
            <div className="flex flex-col items-center px-4">
              <ShieldCheck className="w-12 h-12 text-gray-900 mb-4" />
              <h4 className="font-bold text-sm text-gray-900 mb-2 text-center">Contact Technical Support</h4>
              <p className="text-xs text-gray-500 text-center">for product assistance</p>
            </div>
            <div className="flex flex-col items-center px-4">
              <Users className="w-12 h-12 text-gray-900 mb-4" />
              <h4 className="font-bold text-sm text-gray-900 mb-2 text-center">Talk to our Product Experts</h4>
              <p className="text-xs text-gray-500 text-center">to learn more</p>
            </div>
            <div className="flex flex-col items-center px-4">
              <HeadphonesIcon className="w-12 h-12 text-gray-900 mb-4" />
              <h4 className="font-bold text-sm text-gray-900 mb-2 text-center">Reach out to Customer Service</h4>
              <p className="text-xs text-gray-500 text-center">for order updates</p>
            </div>
            <div className="flex flex-col items-center px-4">
              <Truck className="w-12 h-12 text-gray-900 mb-4" />
              <h4 className="font-bold text-sm text-gray-900 mb-2 text-center">Enjoy Free Shipping</h4>
              <p className="text-xs text-gray-500 text-center">on orders over 50,000 PKR</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
