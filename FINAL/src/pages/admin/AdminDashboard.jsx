import React, { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, Globe, Monitor, Loader2 } from "lucide-react";
import { api } from "../../services/api";

export function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getOrders()
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalSales = orders
    .filter((o) => o.status !== "refunded")
    .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

  const totalOrders = orders.length;
  const onlineOrders = orders.filter((o) => o.type === "online").length;
  const posOrders = orders.filter((o) => o.type === "pos").length;

  if (loading) return (
    <div className="p-10 flex items-center gap-3 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" /> Loading dashboard...
    </div>
  );

  if (error) return (
    <div className="p-10 text-red-500 font-mono text-sm">Error: {error}</div>
  );

  return (
    <div className="p-10 max-w-[1600px] mx-auto">
      <h1 className="text-3xl font-serif mb-10 text-brand-obsidian tracking-wide">
        Executive Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="p-8 border border-gray-100 bg-white">
          <div className="flex justify-between items-start mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Revenue</p>
            <DollarSign className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-4xl font-mono text-brand-obsidian">
            PKR {totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="p-8 border border-gray-100 bg-white">
          <div className="flex justify-between items-start mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Orders</p>
            <ShoppingBag className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-4xl font-mono text-brand-obsidian">{totalOrders}</p>
        </div>

        <div className="p-8 border border-gray-100 bg-white">
          <div className="flex justify-between items-start mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Online Orders</p>
            <Globe className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-4xl font-mono text-brand-obsidian">{onlineOrders}</p>
        </div>

        <div className="p-8 border border-gray-100 bg-white">
          <div className="flex justify-between items-start mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">POS Transactions</p>
            <Monitor className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-4xl font-mono text-brand-obsidian">{posOrders}</p>
        </div>
      </div>

      <div className="bg-brand-obsidian text-white p-10">
        <h2 className="text-xl font-serif tracking-wide mb-4">Real-Time Inventory Synchronization</h2>
        <p className="font-mono text-sm opacity-80 max-w-2xl leading-relaxed text-gray-300">
          The inventory is synced in real-time across POS and Online channels via Socket.io.
          All stock changes from orders and POS transactions are reflected instantly.
        </p>
      </div>
    </div>
  );
}
