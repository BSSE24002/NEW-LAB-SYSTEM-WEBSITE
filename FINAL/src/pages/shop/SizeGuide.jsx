import React from "react";
import { ScrollReveal } from "../../components/shop/ScrollReveal";
import { ScrambleText } from "../../components/shop/ScrambleText";

export function SizeGuide() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-brand-pure-white text-brand-obsidian min-h-screen pt-40 pb-20">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <h2 className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-400 mb-6 text-center">Support</h2>
          <ScrambleText text="DIMENSIONS GUIDE" className="text-4xl md:text-6xl font-serif font-black tracking-tighter uppercase mb-20 text-center" />
        </ScrollReveal>

        <ScrollReveal>
          <p className="text-center text-gray-600 text-sm max-w-2xl mx-auto mb-16 leading-relaxed">
            Our analytical instruments are designed for modularity and efficient workspace utilization. 
            Use the charts below to determine the appropriate spatial requirements and benchtop footprint for your laboratory setup.
          </p>
        </ScrollReveal>

        <div className="space-y-20">
          <ScrollReveal>
            <h3 className="text-xl font-black uppercase tracking-widest mb-8 text-center">Benchtop Systems (Spectrometers & Microscopes)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 uppercase tracking-widest text-[10px] font-bold text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Configuration</th>
                    <th className="px-6 py-4">Width (cm)</th>
                    <th className="px-6 py-4">Depth (cm)</th>
                    <th className="px-6 py-4">Height (cm)</th>
                    <th className="px-6 py-4">Weight (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-obsidian">Compact (S)</td>
                    <td className="px-6 py-4">45 - 55</td>
                    <td className="px-6 py-4">50</td>
                    <td className="px-6 py-4">40</td>
                    <td className="px-6 py-4">25</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-obsidian">Standard (M)</td>
                    <td className="px-6 py-4">60 - 75</td>
                    <td className="px-6 py-4">65</td>
                    <td className="px-6 py-4">55</td>
                    <td className="px-6 py-4">45</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-obsidian">Extended (L)</td>
                    <td className="px-6 py-4">80 - 100</td>
                    <td className="px-6 py-4">75</td>
                    <td className="px-6 py-4">70</td>
                    <td className="px-6 py-4">75</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <h3 className="text-xl font-black uppercase tracking-widest mb-8 text-center">Floor-Standing (Centrifuges & Chromatographs)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 uppercase tracking-widest text-[10px] font-bold text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Configuration</th>
                    <th className="px-6 py-4">Footprint (W x D cm)</th>
                    <th className="px-6 py-4">Clearance Height (cm)</th>
                    <th className="px-6 py-4">Weight (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-obsidian">Mid-Capacity</td>
                    <td className="px-6 py-4">70 x 80</td>
                    <td className="px-6 py-4">120</td>
                    <td className="px-6 py-4">150</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-obsidian">High-Capacity</td>
                    <td className="px-6 py-4">90 x 100</td>
                    <td className="px-6 py-4">160</td>
                    <td className="px-6 py-4">280</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-obsidian">Ultra-Capacity</td>
                    <td className="px-6 py-4">120 x 120</td>
                    <td className="px-6 py-4">200</td>
                    <td className="px-6 py-4">450</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
