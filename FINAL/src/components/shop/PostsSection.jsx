import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { ScrollReveal } from "./ScrollReveal";

export function PostsSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPosts()
      .then((data) => setPosts(data.slice(0, 3))) // Show top 3
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || posts.length === 0) return null;

  return (
    <section className="py-32 bg-brand-alabaster border-y border-gray-200">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-[3rem] md:text-[4rem] leading-none font-sans font-black tracking-tight uppercase text-brand-obsidian">
              Latest Updates
            </h2>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <ScrollReveal key={post.id}>
              <div className="bg-white p-8 border border-gray-200 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <span className="text-[10px] font-mono text-brand-soft-grey uppercase tracking-widest mb-4 block">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                <h3 className="text-xl font-black uppercase tracking-widest text-brand-obsidian mb-4">
                  {post.title}
                </h3>
                <p className="text-sm text-brand-obsidian/70 font-medium leading-relaxed flex-1">
                  {post.content}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
