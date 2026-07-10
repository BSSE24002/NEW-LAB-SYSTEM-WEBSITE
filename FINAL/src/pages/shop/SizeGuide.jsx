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
          <ScrambleText text="SIZE GUIDE" className="text-4xl md:text-6xl font-serif font-black tracking-tighter uppercase mb-20 text-center" />
        </ScrollReveal>

        <ScrollReveal>
          <p className="text-center text-gray-600 text-sm max-w-2xl mx-auto mb-16 leading-relaxed">
            Our garments are designed for a modern, relaxed fit. If you prefer a more tailored look, we recommend sizing down. Use the charts below to find your perfect fit.
          </p>
        </ScrollReveal>

        <div className="space-y-20">
          <ScrollReveal>
            <h3 className="text-xl font-black uppercase tracking-widest mb-8 text-center">Tops (T-Shirts & Hoodies)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 uppercase tracking-widest text-[10px] font-bold text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Size</th>
                    <th className="px-6 py-4">Chest (Inches)</th>
                    <th className="px-6 py-4">Length (Inches)</th>
                    <th className="px-6 py-4">Shoulder (Inches)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-obsidian">Small (S)</td>
                    <td className="px-6 py-4">38 - 40</td>
                    <td className="px-6 py-4">27</td>
                    <td className="px-6 py-4">17.5</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-obsidian">Medium (M)</td>
                    <td className="px-6 py-4">40 - 42</td>
                    <td className="px-6 py-4">28</td>
                    <td className="px-6 py-4">18.5</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-obsidian">Large (L)</td>
                    <td className="px-6 py-4">42 - 44</td>
                    <td className="px-6 py-4">29</td>
                    <td className="px-6 py-4">19.5</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-obsidian">X-Large (XL)</td>
                    <td className="px-6 py-4">44 - 46</td>
                    <td className="px-6 py-4">30</td>
                    <td className="px-6 py-4">20.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <h3 className="text-xl font-black uppercase tracking-widest mb-8 text-center">Bottoms (Pants & Shorts)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 uppercase tracking-widest text-[10px] font-bold text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Size</th>
                    <th className="px-6 py-4">Waist (Inches)</th>
                    <th className="px-6 py-4">Inseam (Inches)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-obsidian">Small (S)</td>
                    <td className="px-6 py-4">28 - 30</td>
                    <td className="px-6 py-4">30</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-obsidian">Medium (M)</td>
                    <td className="px-6 py-4">31 - 33</td>
                    <td className="px-6 py-4">31</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-obsidian">Large (L)</td>
                    <td className="px-6 py-4">34 - 36</td>
                    <td className="px-6 py-4">32</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-obsidian">X-Large (XL)</td>
                    <td className="px-6 py-4">37 - 39</td>
                    <td className="px-6 py-4">33</td>
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
