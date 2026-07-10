import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export function LoginModal({ isOpen, onClose }) {
  const [view, setView] = useState("selection");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const reset = () => { setError(""); setSuccessMsg(""); };

  const handleLogin = async (type) => {
    reset();
    setLoading(true);
    try {
      if (type === "admin" || type === "staff") {
        // Use the real staff login API
        const staff = await api.loginStaff(email, password); // password field holds the PIN value
        localStorage.setItem("userRole", staff.role);
        localStorage.setItem("userName", staff.username || staff.name || "Staff");
        localStorage.setItem("staffId", staff.id);
        if (staff.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/admin/pos");
        }
        onClose();

      } else if (type === "customer_register") {
        if (!name || !email || !phone || !password) {
          setError("All fields are required.");
          return;
        }
        await api.registerCustomer({ first_name: name.split(" ")[0], last_name: name.split(" ").slice(1).join(" ") || "", email, phone, password });
        localStorage.setItem("userRole", "customer");
        localStorage.setItem("customerEmail", email);
        navigate("/profile");
        onClose();

      } else if (type === "customer") {
        // Customer login: look up by email and verify (basic — real auth would use JWT)
        const customer = await api.getCustomer(email);
        // For now accept any existing customer (full auth is a separate task)
        if (customer && customer.email === email) {
          localStorage.setItem("userRole", "customer");
          localStorage.setItem("customerEmail", email);
          navigate("/profile");
          onClose();
        } else {
          setError("No account found with this email.");
        }

      } else if (type === "customer_forgot") {
        if (!phone) { setError("Phone number is required."); return; }
        setSuccessMsg("If an account with that phone exists, a reset link has been sent.");

      } else if (type === "customer_reset") {
        if (!password) { setError("New password is required."); return; }
        setView("customer");
        setPassword("");
        setSuccessMsg("Password reset successfully. Please login.");
      }
    } catch (e) {
      setError(e.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (view) {
      case "customer": return "Customer Login";
      case "customer_register": return "Register Account";
      case "customer_forgot": return "Recover Account";
      case "customer_reset": return "Set New Password";
      case "staff": return "Staff Login";
      case "admin": return "Admin Login";
      default: return "Login";
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-4 py-3 bg-brand-alabaster border border-brand-obsidian/10 focus:outline-none focus:border-brand-obsidian font-mono text-sm";
  const btnPrimary = `w-full mt-2 py-4 bg-brand-obsidian text-brand-pure-white font-black uppercase tracking-widest text-sm hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-brand-pure-white text-brand-obsidian overflow-hidden rounded-xl shadow-2xl"
        >
          <div className="p-6 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-brand-obsidian/60 hover:text-brand-obsidian transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {view === "selection" && (
              <div className="pt-4 flex flex-col gap-4">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-center">
                  Login Portal
                </h2>
                <button
                  onClick={() => { setView("customer"); reset(); }}
                  className="w-full py-4 border border-brand-obsidian/20 font-bold uppercase tracking-widest text-sm hover:bg-brand-obsidian hover:text-brand-pure-white transition-colors"
                >
                  Customer Access
                </button>
                <button
                  onClick={() => { setView("staff"); reset(); }}
                  className="w-full py-4 border border-brand-obsidian/20 font-bold uppercase tracking-widest text-sm hover:bg-brand-obsidian hover:text-brand-pure-white transition-colors"
                >
                  Staff Portal
                </button>
                <div className="mt-8 pt-8 border-t border-brand-obsidian/10 flex justify-center">
                  <button
                    onClick={() => { setView("admin"); reset(); }}
                    className="text-xs font-bold uppercase tracking-widest text-brand-obsidian/40 hover:text-brand-obsidian transition-colors"
                  >
                    Admin Access
                  </button>
                </div>
              </div>
            )}

            {view !== "selection" && (
              <div className="pt-4 flex flex-col gap-6">
                <div className="flex items-center gap-4 mb-2">
                  <button
                    onClick={() => { setView("selection"); reset(); }}
                    className="text-sm font-bold uppercase tracking-widest text-brand-obsidian/40 hover:text-brand-obsidian"
                  >
                    &lt; Back
                  </button>
                  <h2 className="text-xl font-black uppercase tracking-tight">{getTitle()}</h2>
                </div>

                {error && (
                  <div className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</div>
                )}
                {successMsg && (
                  <div className="text-green-600 text-xs font-bold uppercase tracking-widest">{successMsg}</div>
                )}

                <div className="flex flex-col gap-4">
                  {view === "customer_register" && (
                    <>
                      <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                      <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                      <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
                      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
                    </>
                  )}

                  {view === "customer" && (
                    <>
                      <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
                    </>
                  )}

                  {view === "customer_forgot" && (
                    <>
                      <p className="text-xs uppercase font-mono text-gray-500 mb-2">Enter your phone number to verify your account.</p>
                      <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
                    </>
                  )}

                  {view === "customer_reset" && (
                    <>
                      <p className="text-xs uppercase font-mono text-gray-500 mb-2">Enter your new password.</p>
                      <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
                    </>
                  )}

                  {(view === "staff" || view === "admin") && (
                    <>
                      <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                      <input type="password" placeholder={view === "admin" ? "Admin PIN" : "Staff PIN"} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
                    </>
                  )}

                  <button
                    onClick={() => handleLogin(view)}
                    disabled={loading}
                    className={btnPrimary}
                  >
                    {loading ? "Please wait..." : (view === "customer_register" || view === "customer_reset" ? "Submit" : "Secure Login")}
                  </button>

                  {view === "customer" && (
                    <div className="flex flex-col gap-2 mt-2">
                      <button onClick={() => { setView("customer_forgot"); reset(); }} className="text-xs font-bold text-center tracking-widest text-brand-obsidian/50 hover:text-brand-obsidian uppercase">
                        Forgot Password?
                      </button>
                      <button onClick={() => { setView("customer_register"); reset(); }} className="text-xs font-bold text-center tracking-widest text-brand-obsidian/50 hover:text-brand-obsidian uppercase">
                        Don't have an account? Register
                      </button>
                    </div>
                  )}

                  {view === "customer_register" && (
                    <button onClick={() => { setView("customer"); reset(); }} className="text-xs font-bold text-center tracking-widest text-brand-obsidian/50 hover:text-brand-obsidian uppercase mt-2">
                      Already have an account? Login
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
