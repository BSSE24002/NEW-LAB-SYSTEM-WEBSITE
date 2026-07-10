import React from "react";
import { ScrollReveal } from "../../components/shop/ScrollReveal";
import { ScrambleText } from "../../components/shop/ScrambleText";

export function FAQ() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      q: "How long does shipping take?",
      a: "Orders are processed within 1-2 business days. Standard delivery within Pakistan takes 2-4 business days for major cities and 3-5 business days for remote areas."
    },
    {
      q: "Do you ship internationally?",
      a: "Currently, we only ship within Pakistan. We are working on expanding our reach globally in the near future."
    },
    {
      q: "How do I track my order?",
      a: "Once your order is dispatched, you will receive an email and SMS with a tracking number and a link to monitor your shipment in real-time."
    },
    {
      q: "What is your return policy?",
      a: "We offer a 30-day return policy for items in their original, unworn condition with all tags attached. Please visit our Shipping & Returns page for detailed instructions."
    },
    {
      q: "How can I contact customer service?",
      a: "You can reach us at support@drape.com or use the contact form on our Contact Us page. Our support team is available Monday to Friday, 9am - 6pm PKT."
    },
    {
      q: "Are the garments pre-shrunk?",
      a: "Yes, our heavyweight cotton garments undergo a pre-shrinking process during manufacturing to ensure minimal shrinkage after your first wash."
    }
  ];

  return (
    <div className="bg-brand-pure-white text-brand-obsidian min-h-screen pt-40 pb-20">
      <div className="max-w-[800px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <h2 className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-400 mb-6 text-center">Support</h2>
          <ScrambleText text="FAQ" className="text-4xl md:text-6xl font-serif font-black tracking-tighter uppercase mb-20 text-center" />
        </ScrollReveal>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index}>
              <div className="border-b border-gray-100 pb-8">
                <h3 className="text-sm font-black uppercase tracking-widest mb-4">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
