import React from "react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "./ScrollReveal";
import { motion } from "motion/react";

const CATEGORIES = [
  {
    title: "Spectrometers",
    span: "col-span-1 md:col-span-2 row-span-2",
    image:
      "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=1200&auto=format&fit=crop",
    link: "/catalog?category=Spectrometers",
  },
  {
    title: "Microscopes",
    span: "col-span-1 row-span-1",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop",
    link: "/catalog?category=Microscopes",
  },
  {
    title: "Centrifuges",
    span: "col-span-1 row-span-1",
    image:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop",
    link: "/catalog?category=Centrifuges",
  },
  {
    title: "Chromatographs",
    span: "col-span-1 md:col-span-2 row-span-1",
    image:
      "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=1200&auto=format&fit=crop",
    link: "/catalog?category=Chromatographs",
  },
];

export function BentoCategories() {
  return (
    <section className="py-32 bg-brand-pure-white border-t border-brand-obsidian/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-[3rem] md:text-[5rem] leading-none font-sans font-black tracking-tight uppercase mb-4 text-brand-obsidian">
                Core Instruments.
              </h2>
              <p className="text-brand-obsidian/70 text-lg md:text-xl font-medium max-w-lg">
                Curated categories engineered to integrate seamlessly into your laboratory workflows.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[300px_300px] md:grid-rows-[400px_300px] gap-4 md:gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={i}
              to={cat.link}
              className={`group relative overflow-hidden bg-brand-alabaster block rounded-2xl ${cat.span}`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700 z-10" />
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100"
              />
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <div className="overflow-hidden">
                  <h3 className="text-white text-2xl md:text-4xl font-black uppercase tracking-tighter translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    {cat.title}
                  </h3>
                </div>
                <div className="mt-2 w-max text-xs text-white uppercase font-bold tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center gap-2">
                  Explore <span className="text-lg leading-none">-&gt;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
