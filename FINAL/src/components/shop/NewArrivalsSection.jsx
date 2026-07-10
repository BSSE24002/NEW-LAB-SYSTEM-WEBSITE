import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const ARRIVALS = [
  {
    title: "T-Shirts",
    image: "https://i.pinimg.com/736x/f4/a8/f7/f4a8f7500522a4177075fc068977e9f1.jpg",
    link: "/catalog?category=tees"
  },
  {
    title: "T-Shirts",
    image: "https://i.pinimg.com/736x/14/99/70/149970db619d38285a6612eb26f7bbe7.jpg",
    link: "/catalog?category=bottoms"
  },
  {
    title: "Shirts",
    image: "https://i.pinimg.com/736x/ae/13/a8/ae13a800589b6c77cfe032077cfcccdf.jpg",
    link: "/catalog?category=outerwear"
  },
  {
    title: "Caps",
    image: "https://i.pinimg.com/736x/37/88/b8/3788b8e278d5b63aec8215a25ea662c9.jpg",
    link: "/catalog"
  },
  {
    title: "Hoodies & Sweatshirts",
    image: "https://i.pinimg.com/1200x/70/ec/01/70ec01dfb695634e3b365755bdf2aba8.jpg",
    link: "/catalog"
  },
  {
    title: "Caps",
    image: "https://i.pinimg.com/1200x/c1/92/1a/c1921a895f4d386ea57af8f5280b55d7.jpg",
    link: "/catalog"
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
