import React, { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const ITEMS = [
  {
    id: 1,
    title: "Electron Microscope",
    subtitle: "Imaging",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Mass Spectrometer",
    subtitle: "Analysis",
    img: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Gas Chromatograph",
    subtitle: "Separation",
    img: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Ultra Centrifuge",
    subtitle: "Preparation",
    img: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Thermal Cycler",
    subtitle: "Core Equipment",
    img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop",
  },
];

export function AccordionGallery() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // In the PORTER example, hovering expands the item significantly while others shrink.
  return (
    <section className="relative w-full h-[80vh] flex overflow-hidden bg-brand-obsidian border-y border-white/10">
      {/* Absolute Logo overlay for that editorial magazine feel */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none mix-blend-difference text-white">
        <h1 className="text-[5rem] md:text-[8rem] font-sans font-black tracking-tighter leading-none opacity-80 uppercase italic">
          NEW LAB.
        </h1>
      </div>

      {ITEMS.map((item, index) => {
        const isHovered = hoveredIdx === index;
        const isAnyHovered = hoveredIdx !== null;

        // Compute flex value
        // If hovered: flex grow heavily (e.g. 5)
        // If another is hovered: shrink (e.g. 0.8)
        // If none hovered: equal (e.g. 1)
        const flexValue = isHovered ? 5 : isAnyHovered ? 0.8 : 1;

        return (
          <motion.div
            key={item.id}
            onMouseEnter={() => setHoveredIdx(index)}
            onMouseLeave={() => setHoveredIdx(null)}
            animate={{ flex: flexValue }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full overflow-hidden border-r border-white/10 last:border-r-0 cursor-pointer group"
            style={{ willChange: "flex" }}
          >
            {/* Base Image */}
            <motion.img
              loading="lazy"
              animate={{
                scale: isHovered ? 1.05 : 1,
                filter: isHovered
                  ? "grayscale(0%)"
                  : isAnyHovered
                    ? "grayscale(80%)"
                    : "grayscale(30%)",
              }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              src={item.img}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ willChange: "transform, filter" }}
            />

            {/* Dark overlay for contrast */}
            <motion.div
              animate={{ opacity: isHovered ? 0.1 : isAnyHovered ? 0.4 : 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-black pointer-events-none"
            />

            {/* Bottom Content / Titles */}
            <motion.div
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 30,
              }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: isHovered ? 0.1 : 0,
              }}
              className="absolute bottom-12 left-8 right-8 pointer-events-none flex flex-col items-center text-center"
            >
              <span className="text-white text-[10px] font-bold tracking-[0.4em] uppercase mb-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                {item.subtitle}
              </span>
              <h3 className="text-white text-3xl md:text-5xl font-sans font-black tracking-tighter uppercase drop-shadow-2xl">
                {item.title}
              </h3>

              <Link to="/catalog" className="mt-6 pointer-events-auto">
                <button className="text-xs text-white font-bold tracking-[0.2em] uppercase border-b border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-colors">
                  View Collection
                </button>
              </Link>
            </motion.div>
          </motion.div>
        );
      })}
    </section>
  );
}
