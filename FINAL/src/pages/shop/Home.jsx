import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../../components/shop/ProductCard";
import { api } from "../../services/api";
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, HeadphonesIcon, CreditCard, ArrowRight } from "lucide-react";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=2000&auto=format&fit=crop",
    subtitle: "NEW GENERATION",
    title: "Advanced Titration Systems",
    description: "Experience unparalleled accuracy with our latest automated titrators.",
    buttonText: "Shop Now",
    buttonLink: "/catalog?category=Titration"
  },
  {
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2000&auto=format&fit=crop",
    subtitle: "PRECISION OPTICS",
    title: "Clinical Microscopes",
    description: "Crystal clear resolution for your most demanding diagnostic needs.",
    buttonText: "Discover More",
    buttonLink: "/catalog?category=Microscopy"
  },
  {
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000&auto=format&fit=crop",
    subtitle: "PROMOTION",
    title: "Free Calibration",
    description: "Get 1-year free factory calibration on all Spectrometers purchased this month.",
    buttonText: "View Offer",
    buttonLink: "/catalog?category=Spectrometry"
  }
];

const CATEGORIES = [
  { name: "Spectrometers", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop" },
  { name: "Microscopes", image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop" },
  { name: "Centrifuges", image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=800&auto=format&fit=crop" },
  { name: "Chromatographs", image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=800&auto=format&fit=crop" },
  { name: "Balances & Scales", image: "https://images.unsplash.com/photo-1581093806997-124204d9fa9d?q=80&w=800&auto=format&fit=crop" },
  { name: "Incubators", image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop" }
];

const INDUSTRIES = [
  { name: "Pharmaceuticals", image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=600&auto=format&fit=crop" },
  { name: "Water Treatment", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop" },
  { name: "Food & Beverage", image: "https://images.unsplash.com/photo-1556767576-5ec41e3239ea?q=80&w=600&auto=format&fit=crop" },
  { name: "Clinical Diagnostics", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop" }
];

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.getProducts().then((data) => {
      setFeaturedProducts(data.slice(0, 8));
    }).catch(() => {
      setFeaturedProducts([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="bg-white text-gray-900 font-sans">
      
      {/* 1. Full-Width Hero Slider */}
      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden group">
        {HERO_SLIDES.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
              <span className="text-white tracking-[0.3em] text-sm md:text-base font-semibold mb-4 drop-shadow-md">
                {slide.subtitle}
              </span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-8 drop-shadow-md">
                {slide.description}
              </p>
              <Link 
                to={slide.buttonLink} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 uppercase tracking-widest text-sm font-bold transition-colors shadow-lg"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/20 hover:bg-white text-white hover:text-blue-600 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:block">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/20 hover:bg-white text-white hover:text-blue-600 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:block">
          <ChevronRight className="w-6 h-6" />
        </button>
        
        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {HERO_SLIDES.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-blue-600 w-8' : 'bg-white/50 hover:bg-white'}`}
            />
          ))}
        </div>
      </section>

      {/* 2. USP / Brand Trust Bar */}
      <section className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-gray-300">
            <div className="flex flex-col items-center justify-center gap-2 px-4">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wide text-gray-700">100% Authentic</span>
              <span className="text-[10px] text-gray-500 hidden md:block">Certified lab instruments</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 px-4">
              <Truck className="w-6 h-6 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wide text-gray-700">Nationwide Delivery</span>
              <span className="text-[10px] text-gray-500 hidden md:block">Secure & insured shipping</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 px-4">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wide text-gray-700">Bank Transfer Only</span>
              <span className="text-[10px] text-gray-500 hidden md:block">Secure corporate payments</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 px-4">
              <HeadphonesIcon className="w-6 h-6 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wide text-gray-700">Expert Support</span>
              <span className="text-[10px] text-gray-500 hidden md:block">24/7 technical assistance</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category Grid */}
      <section className="py-16 md:py-24 max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-gray-900 mb-3">Shop by Category</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link to={`/catalog?category=${cat.name}`} key={idx} className="group relative overflow-hidden block aspect-[4/3] bg-gray-200">
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur px-6 py-3 min-w-[70%] text-center transform transition-transform group-hover:-translate-y-2">
                  <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-gray-900">{cat.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Best Sellers Scroller */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-gray-900 mb-3">Best Sellers</h2>
              <div className="w-16 h-1 bg-blue-600"></div>
            </div>
            <Link to="/catalog" className="hidden md:flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto pb-8 hide-scrollbar">
            <div className="flex gap-6 w-max">
              {loading ? (
                <div className="w-full flex items-center justify-center p-12 text-gray-400">Loading products...</div>
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map(product => (
                  <div key={product.id} className="w-[280px] md:w-[320px] flex-shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="w-full text-gray-400">No products found.</div>
              )}
            </div>
          </div>
          
          <div className="mt-6 md:hidden flex justify-center">
             <Link to="/catalog" className="inline-block border border-gray-900 px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-colors">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Promotional Banner */}
      <section className="w-full bg-blue-600 text-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-2/3">
            <span className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-2 block">Enterprise Solutions</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Need a custom laboratory setup?</h2>
            <p className="text-blue-100 text-lg max-w-2xl">Our engineers provide end-to-end consulting, procurement, and installation for industrial and academic laboratories.</p>
          </div>
          <div className="md:w-1/3 flex justify-end w-full">
             <Link to="/contact" className="w-full md:w-auto text-center bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 font-bold uppercase tracking-widest text-sm transition-colors shadow-lg">
               Contact Sales Team
             </Link>
          </div>
        </div>
      </section>

      {/* 6. Shop by Industry */}
      <section className="py-16 md:py-24 max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-gray-900 mb-3">Shop by Industry</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INDUSTRIES.map((industry, idx) => (
            <div key={idx} className="group cursor-pointer relative overflow-hidden rounded-full aspect-square bg-gray-200">
              <img 
                src={industry.image} 
                alt={industry.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-blue-600/60 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                <h3 className="text-white text-sm md:text-lg font-bold uppercase tracking-widest leading-snug drop-shadow-md">
                  {industry.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Newsletter / Footer Pre-CTA */}
      <section className="border-t border-gray-200 bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">Stay Informed</h2>
          <p className="text-gray-600 mb-8">Subscribe to our newsletter for the latest instrument releases, technical webinars, and industry news.</p>
          <form className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto border border-gray-300" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" className="flex-1 p-3 focus:outline-none focus:bg-gray-50" />
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 uppercase text-xs font-bold tracking-widest transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
