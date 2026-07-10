import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-brand-obsidian text-brand-pure-white py-20 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-4xl font-sans font-black tracking-tighter uppercase mb-6 text-white">
            NEW LAB SYSTEM
          </h2>
          <p className="text-brand-soft-grey text-sm max-w-sm uppercase tracking-widest leading-loose">
           Precision Analytical Instruments for Advanced Research and Industry.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-brand-soft-grey">
            Explore
          </h4>
          <ul className="space-y-4 text-sm font-medium uppercase tracking-widest">
            <li>
              <Link
                to="/catalog"
                className="hover:text-brand-soft-grey transition-colors"
              >
                Spectrometers
              </Link>
            </li>
            <li>
              <Link
                to="/catalog?category=Chromatographs"
                className="hover:text-brand-soft-grey transition-colors"
              >
                Chromatographs
              </Link>
            </li>
            <li>
              <Link
                to="/catalog?category=Microscopes"
                className="hover:text-brand-soft-grey transition-colors"
              >
                Microscopes
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-brand-soft-grey transition-colors"
              >
                Our Story
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-brand-soft-grey">
            Support
          </h4>
          <ul className="space-y-4 text-sm font-medium uppercase tracking-widest">
            <li>
              <Link
                to="/shipping-returns"
                className="hover:text-brand-soft-grey transition-colors"
              >
                Shipping &amp; Returns
              </Link>
            </li>
            <li>
              <Link
                to="/size-guide"
                className="hover:text-brand-soft-grey transition-colors"
              >
                Size Guide
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-brand-soft-grey transition-colors"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="hover:text-brand-soft-grey transition-colors"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-brand-soft-grey uppercase tracking-widest">
          © {new Date().getFullYear()} NEW LAB SYSTEM. All Rights Reserved.
        </p>
        <div className="flex gap-6 text-xs text-brand-soft-grey uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">
            Instagram
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Journal
          </a>
        </div>
      </div>
    </footer>
  );
}
