import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const ARRIVALS = [
  {
    title: "Spectrometers",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=687&auto=format&fit=crop",
    link: "/catalog?category=Spectrometers"
  },
  {
    title: "Microscopes",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=687&auto=format&fit=crop",
    link: "/catalog?category=Microscopes"
  },
  {
    title: "Chromatographs",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=687&auto=format&fit=crop",
    link: "/catalog?category=Chromatographs"
  },
  {
    title: "Centrifuges",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=687&auto=format&fit=crop",
    link: "/catalog?category=Centrifuges"
  },
  {
    title: "Thermal Cyclers",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=687&auto=format&fit=crop",
    link: "/catalog?category=Thermal Cyclers"
  },
  {
    title: "Balances",
    image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=687&auto=format&fit=crop",
    link: "/catalog?category=Balances"
  }
];

export function NewArrivalsSection() {
  const scrollRef = useRef(null);
  const isHovered = useRef(false);

  useEffect(() => {
    let animationFrameId;
    let exactScrollLeft = scrollRef.current ? scrollRef.current.scrollLeft : 0;

    const autoScroll = () => {
      if (scrollRef.current && !isHovered.current) {
        // Sync if user manually scrolled
        if (Math.abs(exactScrollLeft - scrollRef.current.scrollLeft) > 2) {
          exactScrollLeft = scrollRef.current.scrollLeft;
        }

        exactScrollLeft += 0.75; // very slow speed
        scrollRef.current.scrollLeft = exactScrollLeft;
        
        // Reset to start if reached the end for infinite feel
        if (
          scrollRef.current.scrollLeft >=
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 1
        ) {
          exactScrollLeft = 0;
          scrollRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };
    animationFrameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 600 : 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="py-10 md:py-16 bg-brand-pure-white border-t border-brand-obsidian/5 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-8">
        <ScrollReveal>
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-[2.5rem] md:text-[4rem] leading-none font-sans font-black tracking-tighter uppercase text-brand-obsidian">
              New Arrivals.
            </h2>
            <div className="hidden md:flex gap-4">
              <button 
                onClick={() => scroll("left")}
                className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-brand-alabaster transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scroll("right")}
                className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-brand-alabaster transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div 
        className="relative group max-w-[1400px] mx-auto pl-6 lg:pl-12 pr-6 lg:pr-12 md:pr-0"
        onMouseEnter={() => (isHovered.current = true)}
        onMouseLeave={() => (isHovered.current = false)}
        onTouchStart={() => (isHovered.current = true)}
        onTouchEnd={() => (isHovered.current = false)}
      >
        {/* Mobile controls inner layer */}
        <div className="absolute top-[40%] -translate-y-1/2 left-2 z-10 md:hidden opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => scroll("left")}
              className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-black"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
        </div>
        <div className="absolute top-[40%] -translate-y-1/2 right-2 z-10 md:hidden opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => scroll("right")}
              className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-black"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 md:gap-6 hide-scrollbars pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {ARRIVALS.map((item, idx) => (
            <Link 
              key={idx} 
              to={item.link}
              className="w-[280px] md:w-[350px] shrink-0 group/card flex flex-col"
            >
              <div className="bg-brand-alabaster rounded-3xl overflow-hidden aspect-[2.25/4] w-full relative mb-6">
                <img 
                  loading="lazy"
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-105"
                />
              </div>
              <div className="flex items-center justify-between px-2">
                <span className="font-bold text-sm md:text-base uppercase tracking-widest">{item.title}</span>
                <ArrowRight className="w-5 h-5 text-brand-obsidian/40 group-hover/card:text-brand-obsidian transition-colors group-hover/card:translate-x-1 duration-300" />
              </div>
            </Link>
          ))}
          {/* add trailing padding space for desktop to not cut off at the exact edge */}
          <div className="w-[24px] md:w-[48px] shrink-0" />
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbars::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
