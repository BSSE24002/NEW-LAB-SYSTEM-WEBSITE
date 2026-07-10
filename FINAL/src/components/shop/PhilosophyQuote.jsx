import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ScrollReveal } from "./ScrollReveal";

export function PhilosophyQuote() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section ref={containerRef} className="py-32 md:py-48 bg-[#0a0a0a] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-0 left-[10%] w-[40vw] h-[80vh] bg-white mix-blend-overlay blur-[120px] rounded-full"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-0 right-[10%] w-[30vw] h-[60vh] bg-gray-500 mix-blend-overlay blur-[100px] rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
        <ScrollReveal>
          <div className="mb-8 flex justify-center">
            <div className="w-px h-16 bg-white/20" />
          </div>
          <p className="text-[2rem] md:text-[3.5rem] lg:text-[4.5rem] font-sans font-black tracking-tighter uppercase leading-[1.1] mb-12">
            "We don't just supply instruments. <br className="hidden md:block" />
            <span className="text-white/40">We empower discoveries.</span>"
          </p>
          <div className="uppercase tracking-[0.3em] text-xs font-bold text-white/60">
            — The Lab System Ethos
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
