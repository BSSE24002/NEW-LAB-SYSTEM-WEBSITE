import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { api } from "../../services/api";

export function StaffManagement() {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [role, setRole] = useState("staff");

  const currentRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (currentRole !== "admin") { navigate("/admin"); return; }
    api.getStaff()
      .then(setStaffList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !email || !pin) return;
    setSaving(true);
    try {
      const newStaff = await api.createStaff({ name, email, pin, role });
      setStaffList((prev) => [...prev, newStaff]);
      setName(""); setEmail(""); setPin(""); setRole("staff");
    } catch (e) {
      alert(`Failed: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const removeStaff = async (id) => {
    try {
      await api.deleteStaff(id);
      setStaffList((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      alert(`Failed: ${e.message}`);
    }
  };

  if (loading) return (
    <div className="p-10 flex items-center gap-3 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" /> Loading staff...
    </div>
  );

  if (error) return <div className="p-10 text-red-500 font-mono text-sm">Error: {error}</div>;

  return (
    <div className="p-10 max-w-[1600px] mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-serif text-brand-obsidian tracking-wide">Organization / Team</h1>
        <p className="text-gray-400 mt-2 uppercase tracking-[0.15em] text-[10px] font-bold">Access Control</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="col-span-1 lg:col-span-2 bg-white border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FAFAFA] border-b border-gray-100 text-[10px] font-bold tracking-widest uppercase text-gray-500">
              <tr>
                <th className="p-5">Name</th>
                <th className="p-5">Email</th>
                <th className="p-5">Role</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-5 font-bold font-mono text-xs">{staff.name}</td>
                  <td className="p-5 font-mono text-xs text-gray-400">{staff.email}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest ${staff.role === "admin" ? "bg-brand-obsidian text-white" : "bg-gray-100 text-gray-600"}`}>
                      {staff.role}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    {!staff.is_main_admin && (
                      <button onClick={() => removeStaff(staff.id)}
                        className="text-[10px] uppercase font-bold tracking-widest text-red-500 hover:text-red-700 transition-colors">
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-1 border border-gray-100 bg-white p-8">
          <h2 className="text-sm font-serif uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Provision Account</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-5 font-mono text-xs">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 focus:outline-none focus:border-brand-obsidian transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 focus:outline-none focus:border-brand-obsidian transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Passcode (PIN)</label>
              <input type="text" required value={pin} onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 focus:outline-none focus:border-brand-obsidian transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Access Level</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 focus:outline-none focus:border-brand-obsidian uppercase tracking-widest font-bold text-[10px] transition-colors">
                <option value="staff">Staff</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <button type="submit" disabled={saving}
              className="w-full mt-4 py-4 bg-brand-obsidian text-white font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Provisioning..." : "Provision Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
