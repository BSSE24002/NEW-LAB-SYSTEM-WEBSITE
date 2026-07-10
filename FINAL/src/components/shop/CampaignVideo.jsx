import React from "react";
import { ScrollReveal } from "./ScrollReveal";

export function CampaignVideo() {
  return (
    <section className="py-20 md:py-32 bg-brand-pure-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col items-center">
        
        {/* Aesthetic Text Above the Video */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-[3rem] md:text-[5rem] font-sans font-black tracking-tighter uppercase text-brand-obsidian selection:bg-black selection:text-white leading-none mb-4">
              Precision in Action
            </h2>
            <p className="text-brand-obsidian/60 text-xs md:text-sm tracking-[0.4em] uppercase font-bold">
              Data You Can Trust
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal className="w-full flex justify-center">
          {/* Fixed Dimension Video Container */}
          <div className="relative w-full max-w-[1100px] h-[500px] md:h-[700px] overflow-hidden rounded-3xl bg-black shadow-2xl">
            
            {/* 
              To use your own video:
              1. Place your video file (e.g., 'campaign.mp4') in the 'public' folder of your project.
              2. Change the src attribute below to: src="/campaign.mp4"
            */}
            <video
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen"
              autoPlay
              loop
              muted
              playsInline
              src="/vid.mp4"
            >
              Your browser does not support the video tag.
            </video>
            
            {/* Gradient Overlay for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 pointer-events-none"></div>

            {/* Fancy Font Overlay ON the Video */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
              <h3 
                className="text-[4rem] md:text-[8rem] font-sans font-black uppercase text-transparent select-none transition-colors duration-500 hover:text-brand-obsidian leading-none tracking-tighter pointer-events-auto cursor-default"
                style={{ WebkitTextStroke: "2px rgba(255,255,255,0.9)" }}
              >
                
              </h3>
              <p className="text-white/90 text-xs md:text-sm tracking-[0.5em] uppercase mt-6 drop-shadow-md font-bold">
                Uncompromising Engineering
              </p>
            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
