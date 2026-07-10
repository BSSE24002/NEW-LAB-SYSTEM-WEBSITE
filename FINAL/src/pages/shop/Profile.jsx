import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { api } from "../../services/api";

export function Profile() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("customerEmail");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    if (role !== "customer" || !email) { navigate("/"); return; }

    Promise.all([
      api.getCustomer(email).catch(() => null),
      api.getCustomerOrders(email).catch(() => []),
    ]).then(([cust, ords]) => {
      setCustomer(cust);
      setOrders(ords);
    }).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customerEmail");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center gap-3 text-gray-400 pt-32">
      <Loader2 className="w-5 h-5 animate-spin" /> Loading profile...
    </div>
  );

  return (
    <div className="bg-brand-pure-white text-brand-obsidian min-h-screen pt-32 pb-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-end mb-16">
          <h1 className="text-[4rem] md:text-[6rem] leading-none font-sans font-black tracking-tighter uppercase">Profile</h1>
          <button onClick={handleLogout}
            className="pb-1 border-b-2 border-brand-obsidian text-xs font-bold tracking-[0.1em] uppercase hover:text-red-500 hover:border-red-500 transition-colors">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="col-span-1">
            <h2 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-brand-obsidian/10 pb-4">Details</h2>
            <div className="space-y-4 font-mono text-sm">
              <div><p className="text-gray-400 mb-1">EMAIL</p><p className="font-bold">{customer?.email || email}</p></div>
              <div><p className="text-gray-400 mb-1">PHONE</p><p className="font-bold">{customer?.phone || "N/A"}</p></div>
              {customer?.first_name && (
                <div><p className="text-gray-400 mb-1">NAME</p><p className="font-bold">{customer.first_name} {customer.last_name}</p></div>
              )}
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h2 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-brand-obsidian/10 pb-4">My Orders</h2>
            {orders.length === 0 ? (
              <p className="font-mono text-sm text-gray-500">No orders found.</p>
            ) : (
              <div className="flex flex-col gap-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-brand-obsidian/10 p-6 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-2 font-mono text-sm">
                      <p className="font-bold text-lg">{order.id}</p>
                      <p className="text-gray-500">{new Date(order.date || order.created_at).toLocaleDateString()}</p>
                      <p className="uppercase font-bold pt-2">
                        Status: <span className="text-green-600">{order.status}</span>
                      </p>
                    </div>
                    <div className="space-y-2 font-mono text-sm text-right">
                      <p className="font-bold text-xl">PKR {parseFloat(order.total).toFixed(2)}</p>
                      <p className="text-gray-500">{order.items?.length || 0} Items</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
