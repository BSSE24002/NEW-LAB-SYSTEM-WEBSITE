import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Truck, HeadphonesIcon, Award, Users, ChevronRight, ChevronLeft, ArrowRight, ShoppingCart } from "lucide-react";

const CATEGORIES = [
  { name: "Handheld Testers", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=400&auto=format&fit=crop" },
  { name: "Portable Meters", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400&auto=format&fit=crop" },
  { name: "Benchtop Meters", image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=400&auto=format&fit=crop" },
  { name: "Automatic Titrators", image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=400&auto=format&fit=crop" },
  { name: "Electrodes", image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=400&auto=format&fit=crop" },
  { name: "Reagents", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400&auto=format&fit=crop" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=400&auto=format&fit=crop" }
];

const BRANDS = [
  { name: "HANNA", img: "https://cdn2.hubspot.net/hubfs/2134380/Hanna-Logo-Blue-2023.png?width=140&height=44&name=Hanna-Logo-Blue-2023.png" },
  { name: "WILLE55", img: "https://www.wile.fi/wp-content/themes/farmcomp/assets/wile-logo.svg" },
  { name: "GroLine", img: "https://www.groline.com/we/we.dll/Pic?UN=20747&F=C&T=801&Age=1512596728" },
  { name: "Merck", img: "https://www.sigmaaldrich.com/static/logos/purple/merck.svg" },
  { name: "VWR", img: "https://occapi.avantorsciences.com/medias/vwr-part-of-avantor-logo.svg?context=bWFzdGVyfGltYWdlc3w1ODI1fGltYWdlL3N2Zyt4bWx8YUdWaEwyZzFaQzh4TURNNE16Z3hPVFUzTVRJek1DOTJkM0l0Y0dGeWRDMXZaaTFoZG1GdWRHOXlMV3h2WjI4dWMzWm58MTYzNTM4ZGQwNzhhZDQ4NjNjYTEzOWZkZTQzNWZhNGU4YTgzZTEyMGE3Y2Y3MGMzMjRkYWY4YjVhOWY3OTUxYg" }
];

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=1600&auto=format&fit=crop",
    title: "Precision Equipment for Professional Labs",
    subtitle: "Up to 20% off on select Benchtop Meters",
    color: "bg-blue-900/80"
  },
  {
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1600&auto=format&fit=crop",
    title: "New Arrivals: Portable Water Testing",
    subtitle: "Shop the latest field instruments from top brands",
    color: "bg-green-900/80"
  },
  {
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1600&auto=format&fit=crop",
    title: "Automated Titration Systems",
    subtitle: "Enhance accuracy and save time. Free setup included.",
    color: "bg-slate-900/80"
  }
];

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    api.getProducts().then((data) => {
      setFeaturedProducts(data.slice(0, 10)); // Load 10 products for a dense grid
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));

  return (
    <div className="bg-[#f0f2f5] text-gray-900 font-sans min-h-screen pb-10">
      
      {/* 1. Category Circles (Top Navigation) */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-4 md:py-6">
          <div className="flex overflow-x-auto gap-4 md:gap-8 pb-2 no-scrollbar justify-start md:justify-center">
            {CATEGORIES.map((cat, idx) => (
              <Link key={idx} to={`/catalog?category=${cat.name}`} className="flex flex-col items-center gap-3 min-w-[80px] md:min-w-[100px] group">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#0056b3] transition-all p-1 bg-white shadow-sm">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-xs md:text-sm text-center font-medium text-gray-700 group-hover:text-[#0056b3] transition-colors leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Hero Carousel (E-commerce Style) */}
      <div className="max-w-[1400px] mx-auto px-4 mt-4 md:mt-6">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl md:rounded-2xl overflow-hidden bg-gray-200 shadow-md group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img src={HERO_SLIDES[currentSlide].image} alt="Promo" className="w-full h-full object-cover" />
              <div className={`absolute inset-0 ${HERO_SLIDES[currentSlide].color} flex flex-col justify-center px-8 md:px-20`}>
                <h2 className="text-white text-3xl md:text-6xl font-extrabold max-w-2xl leading-tight mb-4 shadow-black drop-shadow-lg">
                  {HERO_SLIDES[currentSlide].title}
                </h2>
                <p className="text-gray-200 text-lg md:text-2xl mb-8 max-w-xl drop-shadow-md">
                  {HERO_SLIDES[currentSlide].subtitle}
                </p>
                <div>
                  <Link to="/catalog" className="inline-block bg-white text-black px-6 py-3 md:px-8 md:py-4 font-bold rounded shadow-lg hover:bg-gray-100 transition-colors uppercase tracking-wide text-sm">
                    Shop Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all shadow-md ${currentSlide === idx ? "bg-white w-8" : "bg-white/50"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Promotional Mid Banners */}
      <div className="max-w-[1400px] mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Link to="/catalog" className="block w-full aspect-[21/9] bg-blue-100 rounded-xl overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop" alt="Promo 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540]/90 to-transparent p-8 flex flex-col justify-center">
              <span className="bg-[#0056b3] text-white text-xs font-bold px-2 py-1 uppercase w-max mb-3 rounded">Hot Deal</span>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-2 max-w-[60%]">Industrial Testing Gear</h3>
              <p className="text-blue-100 text-sm md:text-base underline underline-offset-4">Shop Collection</p>
            </div>
          </Link>
          <Link to="/catalog" className="block w-full aspect-[21/9] bg-green-100 rounded-xl overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow">
            <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop" alt="Promo 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-transparent p-8 flex flex-col justify-center">
              <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 uppercase w-max mb-3 rounded">New In</span>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-2 max-w-[60%]">Water Treatment Solutions</h3>
              <p className="text-emerald-100 text-sm md:text-base underline underline-offset-4">Discover More</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Featured Products Grid (Dense E-commerce Style) */}
      <div className="max-w-[1400px] mx-auto px-4 mt-12 md:mt-16">
        <div className="flex items-center justify-between mb-6 border-b border-gray-300 pb-3">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/catalog" className="text-[#0056b3] font-medium hover:underline text-sm md:text-base flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product, idx) => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group flex flex-col relative">
                {/* Sale Badge Example (Randomized for visual effect on first 2) */}
                {idx < 2 && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase z-10">
                    Sale
                  </div>
                )}
                
                <Link to={`/product/${product.id}`} className="block relative aspect-square p-4 bg-white flex items-center justify-center">
                  <img src={product.thumbnail_url} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" />
                </Link>
                
                <div className="p-3 md:p-4 flex flex-col flex-grow border-t border-gray-100">
                  <div className="text-[10px] text-gray-400 mb-1 font-mono">{product.sku}</div>
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="text-gray-800 text-sm md:text-sm font-medium mb-2 line-clamp-2 hover:text-[#0056b3] transition-colors leading-snug h-10">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-auto">
                    <div className="text-[#0A2540] font-bold text-lg md:text-xl">
                      PKR {Number(product.price).toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Immediate Action Button */}
                  <Link to={`/product/${product.id}`} className="mt-3 w-full bg-[#f4f8fb] hover:bg-[#0056b3] hover:text-white text-[#0056b3] border border-blue-100 font-semibold py-2 rounded text-center text-xs md:text-sm transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500">Loading products...</div>
          )}
        </div>
      </div>

      {/* 5. Official Brands Banner (Animated Marquee) */}
      <div className="bg-white border-y border-gray-200 mt-12 md:mt-16 py-12 overflow-hidden">
        <h2 className="text-center text-xl font-bold text-gray-800 mb-8 uppercase tracking-wide">Official Partners & Brands</h2>
        <div className="relative w-full flex" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          <div className="flex whitespace-nowrap gap-16 md:gap-24 items-center w-max px-8 animate-marquee">
            {/* Repeat the brands array twice to create an infinite loop effect */}
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                {BRANDS.map((brand, idx) => (
                  <div key={`${i}-${idx}`} className="h-10 md:h-14 flex items-center justify-center transition-all duration-300">
                    {brand.img.includes('http') ? (
                      <img src={brand.img} alt={brand.name} className="max-h-full max-w-[140px] md:max-w-[180px] object-contain" />
                    ) : (
                      <span className="font-black text-2xl text-gray-800">{brand.name}</span>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 5.5 New Arrivals (Additional Grid) */}
      <div className="max-w-[1400px] mx-auto px-4 mt-12 md:mt-16">
        <div className="flex items-center justify-between mb-6 border-b border-gray-300 pb-3">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h2>
          <Link to="/catalog" className="text-[#0056b3] font-medium hover:underline text-sm md:text-base flex items-center gap-1">
            Discover Latest <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
          {featuredProducts.length > 0 ? (
            // Reversing the array just to show a different order for New Arrivals
            [...featuredProducts].reverse().slice(0, 5).map((product, idx) => (
              <div key={`new-${product.id}`} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group flex flex-col relative">
                <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase z-10">
                  New
                </div>
                <Link to={`/product/${product.id}`} className="block relative aspect-square p-4 bg-white flex items-center justify-center">
                  <img src={product.thumbnail_url} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" />
                </Link>
                <div className="p-3 md:p-4 flex flex-col flex-grow border-t border-gray-100">
                  <div className="text-[10px] text-gray-400 mb-1 font-mono">{product.sku}</div>
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="text-gray-800 text-sm md:text-sm font-medium mb-2 line-clamp-2 hover:text-[#0056b3] transition-colors leading-snug h-10">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-auto">
                    <div className="text-[#0A2540] font-bold text-lg md:text-xl">
                      PKR {Number(product.price).toLocaleString()}
                    </div>
                  </div>
                  <Link to={`/product/${product.id}`} className="mt-3 w-full bg-[#f4f8fb] hover:bg-[#0056b3] hover:text-white text-[#0056b3] border border-blue-100 font-semibold py-2 rounded text-center text-xs md:text-sm transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500">Loading new arrivals...</div>
          )}
        </div>
      </div>

      {/* 6. Customer Testimonials */}
      <div className="bg-[#0A2540] text-white py-16 mt-16">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 font-serif">What Our Clients Say</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">Trusted by leading laboratories, research facilities, and educational institutions nationwide.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: "The automated titration system we purchased has cut our analysis time in half. Excellent support and seamless installation.", author: "Dr. Ahmed", role: "Head of QA, Pharmaco" },
              { text: "Best prices for authentic Hanna instruments. The delivery was fast and the equipment was perfectly calibrated out of the box.", author: "Sarah M.", role: "Research Associate" },
              { text: "New Lab System is our go-to vendor for all lab consumables and precision meters. Their technical support is unmatched.", author: "Prof. Khan", role: "University of Science" }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white/10 p-8 rounded-xl border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
                <p className="text-gray-200 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <h4 className="font-bold">{testimonial.author}</h4>
                  <p className="text-xs text-blue-300">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Value Propositions (Footer Banner) */}
      <div className="max-w-[1400px] mx-auto px-4 mt-12 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: "Free Delivery", desc: "For orders over Rs. 50,000" },
            { icon: ShieldCheck, title: "100% Authentic", desc: "Sourced directly from brands" },
            { icon: Award, title: "Best Prices", desc: "Guaranteed market competitive" },
            { icon: HeadphonesIcon, title: "24/7 Support", desc: "Dedicated technical assistance" }
          ].map((val, idx) => (
            <div key={idx} className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[#0056b3] bg-blue-50 p-3 rounded-full">
                <val.icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm md:text-base">{val.title}</h4>
                <p className="text-xs md:text-sm text-gray-500">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
