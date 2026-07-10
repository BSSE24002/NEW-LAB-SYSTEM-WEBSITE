import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../../components/shop/ProductCard";
import { api } from "../../services/api";
import { ChevronLeft, ChevronRight, Truck, ShieldCheck, HeadphonesIcon, CreditCard, ArrowRight, FileText, Video, Award, Star } from "lucide-react";
import { motion } from "motion/react";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=2000&auto=format&fit=crop",
    subtitle: "NEW GENERATION",
    title: "Advanced Titration Systems",
    description: "Experience unparalleled accuracy with our latest automated titrators designed for maximum lab efficiency.",
    buttonText: "Shop Now",
    buttonLink: "/catalog?category=Titration"
  },
  {
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2000&auto=format&fit=crop",
    subtitle: "PRECISION OPTICS",
    title: "Clinical Microscopes",
    description: "Crystal clear resolution for your most demanding diagnostic and research needs.",
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

const RESOURCES = [
  { title: "HPLC Method Development Guide", type: "Application Note", icon: FileText, link: "#" },
  { title: "Advances in Mass Spectrometry", type: "Webinar Replay", icon: Video, link: "#" },
  { title: "Water Quality Testing Standards 2026", type: "Whitepaper", icon: Award, link: "#" }
];

const TESTIMONIALS = [
  { quote: "The precision of their chromatographs has revolutionized our quality control pipeline. Exceptional support team.", author: "Dr. A. Rahman", institute: "National Pharma Research" },
  { quote: "We upgraded our entire diagnostic wing with their microscopy solutions. The optical clarity is unmatched.", author: "Prof. S. Khan", institute: "City Medical Institute" },
  { quote: "Reliable equipment and seamless integration. Their calibration services are incredibly prompt and professional.", author: "M. Ahmed", institute: "AgriTech Labs" }
];

const BRANDS = ["Thermo Fisher", "Agilent", "Shimadzu", "PerkinElmer", "Waters", "Bruker", "Eppendorf", "Sartorius"];

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <section className="relative w-full h-[75vh] md:h-[85vh] overflow-hidden group bg-gray-900">
        {HERO_SLIDES.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 max-w-[1200px] mx-auto">
              <span className="text-white tracking-[0.4em] text-xs md:text-sm font-bold mb-6 drop-shadow-md">
                {slide.subtitle}
              </span>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight drop-shadow-lg leading-tight">
                {slide.title}
              </h2>
              <p className="text-white/90 text-lg md:text-2xl max-w-3xl mb-10 drop-shadow-md font-medium">
                {slide.description}
              </p>
              <Link 
                to={slide.buttonLink} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 uppercase tracking-widest text-sm font-bold transition-all shadow-xl hover:scale-105"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}
        
        <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/10 hover:bg-white text-white hover:text-blue-600 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hidden md:block">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/10 hover:bg-white text-white hover:text-blue-600 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hidden md:block">
          <ChevronRight className="w-8 h-8" />
        </button>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-4">
          {HERO_SLIDES.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-blue-600 w-10' : 'bg-white/50 hover:bg-white'}`}
            />
          ))}
        </div>
      </section>

      {/* 2. USP / Brand Trust Bar */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-gray-300">
            <div className="flex flex-col items-center justify-center gap-3 px-4">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-900">100% Authentic</span>
              <span className="text-xs text-gray-500 hidden md:block">Certified lab instruments</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 px-4">
              <Truck className="w-8 h-8 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-900">Nationwide Delivery</span>
              <span className="text-xs text-gray-500 hidden md:block">Secure & insured shipping</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 px-4">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-900">Bank Transfer Only</span>
              <span className="text-xs text-gray-500 hidden md:block">Secure corporate payments</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 px-4">
              <HeadphonesIcon className="w-8 h-8 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-900">Expert Support</span>
              <span className="text-xs text-gray-500 hidden md:block">24/7 technical assistance</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category Grid */}
      <section className="py-24 md:py-32 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900 mb-6">Shop by Category</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {CATEGORIES.map((cat, idx) => (
            <Link to={`/catalog?category=${cat.name}`} key={idx} className="group relative overflow-hidden block aspect-[4/3] bg-gray-200 shadow-sm hover:shadow-xl transition-shadow">
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur px-8 py-4 min-w-[75%] text-center transform transition-transform group-hover:-translate-y-2 border border-gray-100">
                  <h3 className="text-sm md:text-lg font-bold uppercase tracking-widest text-gray-900">{cat.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Brands Marquee */}
      <section className="bg-white py-12 border-y border-gray-100 overflow-hidden flex flex-col items-center">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-8 text-center">Trusted Brands & Partners</h3>
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 40 }} 
          className="flex whitespace-nowrap gap-20 items-center w-max opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
        >
          {Array(4).fill(null).map((_, i) => (
            <React.Fragment key={i}>
              {BRANDS.map((brand, j) => (
                <span key={j} className="text-xl md:text-3xl font-black uppercase tracking-widest text-gray-800">{brand}</span>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </section>

      {/* 5. Best Sellers Scroller */}
      <section className="py-24 md:py-32 bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900 mb-6">Best Sellers</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto md:mx-0"></div>
            </div>
            <Link to="/catalog" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors">
              View All Instruments <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="overflow-x-auto pb-8 hide-scrollbar">
            <div className="flex gap-8 w-max">
              {loading ? (
                <div className="w-full flex items-center justify-center p-20 text-gray-400 font-bold uppercase tracking-widest">Loading products...</div>
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map(product => (
                  <div key={product.id} className="w-[300px] md:w-[350px] flex-shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="w-full text-gray-400 p-20 font-bold uppercase tracking-widest">No products found.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Promotional Banner */}
      <section className="w-full bg-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 md:py-32 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="md:w-2/3 text-center md:text-left">
            <span className="text-blue-200 text-sm font-bold uppercase tracking-[0.3em] mb-4 block">Enterprise Lab Solutions</span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Setting up a new facility?</h2>
            <p className="text-blue-100 text-lg md:text-xl max-w-3xl font-medium leading-relaxed">
              Our engineering team provides end-to-end consulting, procurement, and installation services for industrial, pharmaceutical, and academic laboratories.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center md:justify-end w-full">
             <Link to="/contact" className="w-full md:w-auto text-center bg-white text-blue-700 hover:bg-gray-100 px-10 py-5 font-bold uppercase tracking-widest text-sm transition-transform shadow-2xl hover:scale-105">
               Contact Sales Team
             </Link>
          </div>
        </div>
      </section>

      {/* 7. Shop by Industry */}
      <section className="py-24 md:py-32 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900 mb-6">Shop by Industry</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {INDUSTRIES.map((industry, idx) => (
            <div key={idx} className="group cursor-pointer relative overflow-hidden rounded-lg aspect-[4/5] bg-gray-200 shadow-md hover:shadow-xl transition-all">
              <img 
                src={industry.image} 
                alt={industry.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent transition-opacity" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                <h3 className="text-white text-lg md:text-xl font-bold uppercase tracking-widest leading-snug drop-shadow-md transform transition-transform group-hover:-translate-y-2">
                  {industry.name}
                </h3>
                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-4 opacity-0 group-hover:opacity-100 transition-opacity">Explore Solutions &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Technical Resources */}
      <section className="py-24 md:py-32 bg-gray-100 border-y border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900 mb-6">Technical Resources</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">Access our library of application notes, manuals, and webinar recordings.</p>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RESOURCES.map((res, idx) => {
              const Icon = res.icon;
              return (
                <a key={idx} href={res.link} className="bg-white p-8 border border-gray-200 hover:border-blue-600 hover:shadow-xl transition-all group flex flex-col items-start text-left">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 flex items-center justify-center rounded-lg mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">{res.type}</span>
                  <h4 className="text-xl font-bold text-gray-900 mb-6 leading-snug">{res.title}</h4>
                  <span className="mt-auto text-sm font-bold uppercase tracking-widest text-gray-400 group-hover:text-blue-600 flex items-center gap-2 transition-colors">
                    Download / View <ArrowRight className="w-4 h-4" />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900 mb-6">Trusted Worldwide</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((test, idx) => (
              <div key={idx} className="p-8 border border-gray-100 bg-gray-50 flex flex-col items-center text-center">
                <div className="flex gap-1 mb-6 text-blue-600">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-gray-700 text-lg font-medium italic leading-relaxed mb-8">"{test.quote}"</p>
                <div className="mt-auto">
                  <h5 className="font-bold uppercase tracking-widest text-gray-900 text-sm mb-1">{test.author}</h5>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{test.institute}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Newsletter / Footer Pre-CTA */}
      <section className="bg-gray-900 text-white py-24 md:py-32 border-b-8 border-blue-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">Stay Informed</h2>
          <p className="text-gray-400 text-lg mb-12">Subscribe to our newsletter for the latest instrument releases, technical webinars, and industry news.</p>
          <form className="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your corporate email" className="flex-1 p-5 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 uppercase text-sm font-bold tracking-widest transition-colors shadow-lg">
              Subscribe
            </button>
          </form>
          <p className="mt-6 text-xs text-gray-500 font-medium">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>

    </div>
  );
}
