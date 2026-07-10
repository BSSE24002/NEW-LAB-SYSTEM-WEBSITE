import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Loader2, ShoppingCart } from "lucide-react";
import { chatWithAssistant } from "../../services/ai";
import { api } from "../../services/api";
import { useCart } from "../../context/CartContext";

export function FloatingWidgets() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm New Lab System's assistant. How can I help you find the right equipment today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inventory, setInventory] = useState([]);
  const messagesEndRef = useRef(null);
  
  const { addItem, setIsCartOpen: openCartDrawer } = useCart();

  useEffect(() => {
    // Fetch products once so the AI knows what we sell
    api.getProducts().then(data => {
      setInventory(data);
    }).catch(console.error);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const response = await chatWithAssistant(apiMessages, inventory);
      
      setMessages([...newMessages, { role: "assistant", content: response }]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, I encountered an error connecting to the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addItem({ ...product, quantity: 1, size: 'Default', color: 'Default' });
    openCartDrawer(true);
  };

  // Custom renderer for messages to detect [PRODUCT:id]
  const renderMessageContent = (content) => {
    const parts = content.split(/(\[PRODUCT:\d+\])/g);
    
    return parts.map((part, index) => {
      const match = part.match(/\[PRODUCT:(\d+)\]/);
      if (match) {
        const productId = parseInt(match[1]);
        const product = inventory.find(p => p.id === productId);
        
        if (product) {
          return (
            <div key={index} className="my-2 bg-white rounded border border-gray-200 overflow-hidden shadow-sm">
              <div className="flex gap-3 p-2 items-center">
                <img src={product.thumbnail_url} alt={product.name} className="w-12 h-12 object-contain" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs font-bold text-[#0056b3]">PKR {Number(product.price).toLocaleString()}</p>
                </div>
              </div>
              <button 
                onClick={() => handleAddToCart(product)}
                className="w-full bg-[#0A2540] text-white text-xs font-semibold py-2 hover:bg-[#0056b3] transition-colors flex justify-center items-center gap-1"
              >
                <ShoppingCart className="w-3 h-3" /> Add to Cart
              </button>
            </div>
          );
        } else {
          return null; // Ignore if product doesn't exist
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      
      {/* AI Chat Window */}
      {isChatOpen && (
        <div className="w-[320px] sm:w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 mb-2" style={{ height: '450px' }}>
          {/* Header */}
          <div className="bg-[#0A2540] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-sm">AI Assistant</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-gray-300 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-[#0056b3] text-white self-end rounded-br-sm' : 'bg-white text-gray-800 border border-gray-200 self-start rounded-bl-sm shadow-sm'}`}>
                {msg.role === 'assistant' ? renderMessageContent(msg.content) : msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white text-gray-800 border border-gray-200 self-start rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#0056b3]" /> <span className="text-xs text-gray-500">Searching inventory...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g. I need a pH meter..." 
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-[#0056b3] outline-none"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-9 h-9 rounded-full bg-[#0056b3] text-white flex items-center justify-center disabled:opacity-50 hover:bg-[#0A2540] transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4 ml-[-2px]" />
            </button>
          </form>
        </div>
      )}

      {/* AI Toggle Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-14 h-14 bg-[#0A2540] rounded-full text-white flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform group relative"
      >
        {isChatOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7 group-hover:animate-bounce" />}
        {!isChatOpen && (
          <span className="absolute right-[70px] bg-[#0A2540] text-white text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            Ask AI
          </span>
        )}
      </button>

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/923009494654?text=I%20came%20across%20your%20website%20and%20want%20to%20order%20something" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] rounded-full text-white flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform group relative"
      >
        <MessageSquare className="w-7 h-7" />
        <span className="absolute right-[70px] bg-[#25D366] text-white text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
          WhatsApp Us
        </span>
      </a>

    </div>
  );
}
