import React from "react";
import { motion } from "motion/react";
import { ScrollReveal } from "./ScrollReveal";

const lookbookImages = [
  "https://i.pinimg.com/736x/c0/98/7b/c0987bd0616949fa1b00538d7896da0f.jpg",
  "https://images.unsplash.com/photo-1626537848208-3b7acf765011?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://i.pinimg.com/1200x/5f/76/89/5f7689b352566d8bfd8062a7d070317d.jpg",
  "https://plus.unsplash.com/premium_photo-1690406382707-16d9cc7a83d5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://i.pinimg.com/736x/56/c4/ae/56c4aec15b2a951a6326ed9d54ff6204.jpg"
];

// Predefined rotations to prevent layout jumping on re-renders, giving a neat fanned-out look
const rotations = [-12, -6, 0, 6, 12];

export function StackedImageSection() {
  return (
    <section className="py-40 bg-brand-pure-white overflow-hidden border-t border-brand-obsidian/5 relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center justify-items-center">
          
          <div className="order-2 lg:order-1 relative w-full flex justify-center max-w-md aspect-[3/4] h-[500px]">
            {lookbookImages.map((src, i) => (
              <motion.div
                key={i}
                className="absolute inset-x-8 inset-y-0 shadow-2xl border-[8px] border-white overflow-hidden origin-bottom cursor-pointer bg-brand-alabaster rounded-2xl"
                initial={{ rotate: rotations[i], zIndex: i }}
                whileHover={{
                  scale: 1.05,
                  rotate: rotations[i] * 0.5,
                  zIndex: 50,
                  y: -40,
                  x: i % 2 === 0 ? -10 : 10
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  loading="lazy"
                  src={src}
                  alt={`Lookbook Snapshot ${i + 1}`}
                  className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                />
              </motion.div>
            ))}
          </div>

          <div className="order-1 lg:order-2 flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl mx-auto w-full">
            <ScrollReveal staggerDelay={0.15}>
              <div className="flex flex-col leading-[0.85] mb-10 font-sans font-black tracking-tighter uppercase text-[4rem] sm:text-[6rem] lg:text-[7rem]">
                <span 
                  className="text-transparent select-none transition-colors duration-500 hover:text-brand-obsidian" 
                  style={{ WebkitTextStroke: "2px rgba(0,0,0,0.15)" }}
                >
                  STREETWEAR
                </span>
                <span className="text-brand-obsidian selection:bg-black selection:text-white">
                  STREETWEAR
                </span>
                <span 
                  className="text-transparent select-none transition-colors duration-500 hover:text-brand-obsidian" 
                  style={{ WebkitTextStroke: "2px rgba(0,0,0,0.15)" }}
                >
                  STREETWEAR
                </span>
              </div>
              <p className="text-brand-obsidian/70 text-lg md:text-xl font-medium leading-relaxed tracking-wide">
                A revolution in silhouette and form. We deconstruct classic staples and rebuild them with uncompromising fabrics.
                Every layer tells a story of purposeful design, balancing grit with absolute refinement.
              </p>
            </ScrollReveal>
          </div>
          
        </div>
      </div>
    </section>
  );
}
