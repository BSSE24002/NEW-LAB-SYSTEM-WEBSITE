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
              In a world of approximations, we choose absolute precision. NEW LAB SYSTEM is built on
              the belief that scientific discovery requires uncompromising tools.
            </p>
          </ScrollReveal>
        </div>

        {/* Cinematic Imagery */}
        <ScrollReveal>
          <div className="w-full h-[60vh] md:h-[80vh] relative mb-32 overflow-hidden bg-brand-alabaster rounded-3xl">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1470&auto=format&fit=crop"
              alt="Lab Engineering"
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
              of Analysis.
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <div className="flex flex-col gap-8 text-lg font-medium text-brand-obsidian/70 leading-relaxed">
              <p>
                We approach instrumentation like architecture. Every component is
                rigorously tested, meticulously calibrated, and crafted from
                industrial-grade materials. The result is a modular laboratory system designed
                to integrate seamlessly into your workflow.
              </p>
              <p>
                Our equipment is not defined by trends, but by utility and
                evolution. We continuously refine our core instruments, iterating on
                the perfect resolution, the ideal sensitivity, and the most reliable
                data capture methods.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          <ScrollReveal>
            <div className="aspect-[3/4] bg-brand-alabaster relative overflow-hidden rounded-2xl">
              <img loading="lazy" src="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=687&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:scale-105 transition-all duration-700" alt="Material" />
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="aspect-[3/4] bg-brand-alabaster relative overflow-hidden md:-mt-12 rounded-2xl">
              <img loading="lazy" src="https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=627&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:scale-105 transition-all duration-700" alt="Crafting" />
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="aspect-[3/4] bg-brand-alabaster relative overflow-hidden rounded-2xl">
              <img loading="lazy" src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=736&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:scale-105 transition-all duration-700" alt="Fabric" />
            </div>
          </ScrollReveal>
        </div>

        {/* Pillars */}
        <div className="border-t border-brand-obsidian/10 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ScrollReveal>
              <h3 className="text-xs font-black tracking-[0.2em] uppercase mb-4 text-brand-soft-grey">01 &mdash; Components</h3>
              <h4 className="text-2xl font-black uppercase tracking-tight mb-4">Uncompromising<br />Accuracy</h4>
              <p className="text-brand-obsidian/70 font-medium leading-relaxed">We source the finest optics, heavy-duty electronics, and premium sensors. Our instruments are custom-calibrated to meet strict specifications for sensitivity, resolution, and durability.</p>
            </ScrollReveal>
            <ScrollReveal>
              <h3 className="text-xs font-black tracking-[0.2em] uppercase mb-4 text-brand-soft-grey">02 &mdash; Manufacturing</h3>
              <h4 className="text-2xl font-black uppercase tracking-tight mb-4">Built for<br />Longevity</h4>
              <p className="text-brand-obsidian/70 font-medium leading-relaxed">Planned obsolescence is a flaw. Our equipment utilizes industrial-grade casing, reinforced stress points, and advanced cooling techniques to ensure they outlast grueling operations.</p>
            </ScrollReveal>
            <ScrollReveal>
              <h3 className="text-xs font-black tracking-[0.2em] uppercase mb-4 text-brand-soft-grey">03 &mdash; Design</h3>
              <h4 className="text-2xl font-black uppercase tracking-tight mb-4">Redefining<br />Systems</h4>
              <p className="text-brand-obsidian/70 font-medium leading-relaxed">Complexity shouldn't mean confusing. Through subtle ergonomics, intuitive interfaces, and precise data outputs, we elevate the daily laboratory routine into something extraordinary.</p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
