import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-brand-obsidian text-brand-pure-white py-20 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-4xl font-sans font-black tracking-tighter uppercase mb-6">
            DRAPE<span className="text-red-500">.</span>
          </h2>
          <p className="text-brand-soft-grey text-sm max-w-sm uppercase tracking-widest leading-loose">
           Redefining modern apparel. Expertly crafted in Pakistan for the uncompromising.
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
                Latest Collection
              </Link>
            </li>
            <li>
              <Link
                to="/catalog"
                className="hover:text-brand-soft-grey transition-colors"
              >
                Core Uniform
              </Link>
            </li>
            <li>
              <Link
                to="/catalog"
                className="hover:text-brand-soft-grey transition-colors"
              >
                Accessories
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
              <a
                href="#"
                className="hover:text-brand-soft-grey transition-colors"
              >
                Shipping &amp; Returns
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-brand-soft-grey transition-colors"
              >
                Size Guide
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-brand-soft-grey transition-colors"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-brand-soft-grey transition-colors"
              >
                FAQ
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-brand-soft-grey uppercase tracking-widest">
          © {new Date().getFullYear()} DRAPE. All Rights Reserved.
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
