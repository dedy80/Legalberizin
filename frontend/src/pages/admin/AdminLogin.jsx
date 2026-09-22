import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Loader2, LockKeyhole } from "lucide-react";
import { API } from "@/lib/contact";

function formatApiError(detail) {
  if (detail == null) return "Terjadi kesalahan. Coba lagi.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg || JSON.stringify(e)).join(" ");
  return detail?.msg || String(detail);
}

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${API}/auth/login`, form);
      localStorage.setItem("legal_admin_token", data.token);
      navigate("/admin");
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl bg-white border border-sky-200 px-4 py-3 text-sm text-[#0C2D48] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition-all duration-300";

  return (
    <main data-testid="admin-login-page" className="min-h-screen flex items-center justify-center px-4 bg-[#F4F8FB]">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md glass rounded-2xl p-8 sm:p-10 glow-cyan"
      >
        <div className="flex flex-col items-center text-center">
          <img src="/logo.png" alt="Legalberizin.id" className="h-12 w-auto" />
          <h1 className="mt-6 text-xl font-extrabold tracking-tight">Admin Panel</h1>
          <p className="mt-1 text-sm text-slate-500">Masuk untuk mengelola leads & artikel blog</p>
        </div>

        {error && (
          <div data-testid="admin-login-error" className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-mono-alt uppercase tracking-[0.2em] text-slate-500 mb-2">Email</label>
            <input
              data-testid="admin-login-email"
              type="email"
              required
              className={inputCls}
              placeholder="admin@legalberizin.id"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-mono-alt uppercase tracking-[0.2em] text-slate-500 mb-2">Password</label>
            <input
              data-testid="admin-login-password"
              type="password"
              required
              className={inputCls}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
        </div>

        <button
          data-testid="admin-login-submit-button"
          type="submit"
          disabled={loading}
          className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 font-bold text-white hover:shadow-[0_0_30px_-5px_rgba(2,132,199,0.5)] transition-all duration-300 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LockKeyhole className="w-4 h-4" />}
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </motion.form>
    </main>
  );
}
