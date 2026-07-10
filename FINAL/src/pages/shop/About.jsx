import React from "react";
import { motion } from "motion/react";
import { ScrollReveal } from "../../components/shop/ScrollReveal";

export function About() {
  return (
    <div className="bg-brand-pure-white text-brand-obsidian min-h-screen pt-32 pb-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-24">
          <ScrollReveal>
            <h1 className="text-[4rem] md:text-[8rem] leading-none font-sans font-black tracking-tighter uppercase mb-8">
              Our Ethos.
            </h1>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-xl md:text-3xl max-w-4xl font-medium leading-normal text-brand-obsidian/80">
              In a world of excess, we choose intentionality. DRAPE is built on
              the belief that a wardrobe should be a curated collection of
              heavy-hitting essentials.
            </p>
          </ScrollReveal>
        </div>

        {/* Cinematic Imagery */}
        <ScrollReveal>
          <div className="w-full h-[60vh] md:h-[80vh] relative mb-32 overflow-hidden bg-brand-alabaster rounded-3xl">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1574177367965-3e37ff611c48?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Design Process"
              className="absolute inset-0 w-full h-full object-cover grayscale-[30%]"
            />
          </div>
        </ScrollReveal>

        {/* The Manifesto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-32">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
              The Architecture
              <br />
              of Clothing.
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <div className="flex flex-col gap-8 text-lg font-medium text-brand-obsidian/70 leading-relaxed">
              <p>
                We approach clothing like architecture. Every garment is
                rigorously tested, meticulously patterned, and crafted from
                custom-milled fabrics. The result is a modular wardrobe designed
                to move seamlessly through your life.
              </p>
              <p>
                Our collections are not defined by seasons, but by utility and
                evolution. We continuously refine our core pieces, iterating on
                the perfect drape, the ideal weight, and the most durable
                construction methods.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          <ScrollReveal>
            <div className="aspect-[3/4] bg-brand-alabaster relative overflow-hidden rounded-2xl">
              <img loading="lazy" src="https://images.unsplash.com/photo-1591422561155-a118fe7ce34c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:scale-105 transition-all duration-700" alt="Material" />
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="aspect-[3/4] bg-brand-alabaster relative overflow-hidden md:-mt-12 rounded-2xl">
              <img loading="lazy" src="https://images.unsplash.com/photo-1708800329959-35b7bf01163b?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:scale-105 transition-all duration-700" alt="Crafting" />
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="aspect-[3/4] bg-brand-alabaster relative overflow-hidden rounded-2xl">
              <img loading="lazy" src="https://images.unsplash.com/photo-1723164965009-c01db9a8eb2b?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:scale-105 transition-all duration-700" alt="Fabric" />
            </div>
          </ScrollReveal>
        </div>

        {/* Pillars */}
        <div className="border-t border-brand-obsidian/10 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ScrollReveal>
              <h3 className="text-xs font-black tracking-[0.2em] uppercase mb-4 text-brand-soft-grey">01 &mdash; Materials</h3>
              <h4 className="text-2xl font-black uppercase tracking-tight mb-4">Uncompromising<br />Quality</h4>
              <p className="text-brand-obsidian/70 font-medium leading-relaxed">We source the finest organic cottons, heavy-duty hardware, and premium textiles. Our fabrics are custom-milled to meet strict specifications for weight, texture, and durability.</p>
            </ScrollReveal>
            <ScrollReveal>
              <h3 className="text-xs font-black tracking-[0.2em] uppercase mb-4 text-brand-soft-grey">02 &mdash; Construction</h3>
              <h4 className="text-2xl font-black uppercase tracking-tight mb-4">Built for<br />Longevity</h4>
              <p className="text-brand-obsidian/70 font-medium leading-relaxed">Fast fashion is a flaw. Our garments utilize triple-stitched seams, reinforced stress points, and tailored techniques to ensure they outlast fleeting trends.</p>
            </ScrollReveal>
            <ScrollReveal>
              <h3 className="text-xs font-black tracking-[0.2em] uppercase mb-4 text-brand-soft-grey">03 &mdash; Design</h3>
              <h4 className="text-2xl font-black uppercase tracking-tight mb-4">Redefining<br />Basics</h4>
              <p className="text-brand-obsidian/70 font-medium leading-relaxed">Minimalism shouldn't mean boring. Through subtle articulation, oversized drapes, and precise proportions, we elevate the daily uniform into something extraordinary.</p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
