import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Send, Mail, MapPin, MessageCircle } from "lucide-react";
import { API, EMAIL, LOCATION, WA_DISPLAY, waLink } from "@/lib/contact";

const SERVICE_OPTIONS = [
  "Pendirian Badan Usaha (PT / CV / Yayasan)",
  "Virtual Office Jakarta Utara",
  "Sertifikat Standar KBLI 46441",
  "Izin BPOM Kosmetik Impor",
  "Notifikasi Izin Edar Kosmetik Impor",
  "Izin Alkes Impor",
  "Layanan Digital (NIB / OSS / PKP)",
  "Lainnya",
];

const inputCls =
  "w-full rounded-xl bg-white border border-sky-200 px-4 py-3 text-sm text-[#0C2D48] placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition-all duration-300";

export default function LeadForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: SERVICE_OPTIONS[0], message: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Mohon isi nama dan nomor WhatsApp Anda.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/consultations`, form);
      toast.success("Permintaan konsultasi terkirim! Tim kami akan segera menghubungi Anda.");
      setForm({ name: "", phone: "", email: "", service: SERVICE_OPTIONS[0], message: "" });
    } catch {
      toast.error("Gagal mengirim. Silakan coba lagi atau hubungi WhatsApp kami.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="konsultasi" data-testid="consultation-lead-form" className="relative py-28 lg:py-36 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5"
        >
          <p className="font-mono-alt text-xs uppercase tracking-[0.3em] text-sky-600 mb-6">Mulai Sekarang</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
            Ceritakan Kebutuhan Anda. <span className="text-gradient">Sisanya Biar Kami.</span>
          </h2>
          <p className="mt-6 text-slate-600 text-sm sm:text-base leading-relaxed">
            Isi form konsultasi — tim kami akan menghubungi Anda maksimal 1×24 jam. Atau langsung chat untuk respon tercepat.
          </p>
          <div className="mt-10 space-y-5">
            <a data-testid="contact-wa-row" href={waLink("Halo Legalberizin.id, saya ingin konsultasi.")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <span className="w-11 h-11 rounded-xl glass flex items-center justify-center group-hover:border-sky-400 transition-colors"><MessageCircle className="w-5 h-5 text-sky-600" /></span>
              <div><p className="text-xs text-slate-500">WhatsApp</p><p className="font-semibold group-hover:text-sky-600 transition-colors">{WA_DISPLAY}</p></div>
            </a>
            <a data-testid="contact-email-row" href={`mailto:${EMAIL}`} className="flex items-center gap-4 group">
              <span className="w-11 h-11 rounded-xl glass flex items-center justify-center group-hover:border-sky-400 transition-colors"><Mail className="w-5 h-5 text-sky-600" /></span>
              <div><p className="text-xs text-slate-500">Email</p><p className="font-semibold group-hover:text-sky-600 transition-colors">{EMAIL}</p></div>
            </a>
            <div data-testid="contact-location-row" className="flex items-center gap-4">
              <span className="w-11 h-11 rounded-xl glass flex items-center justify-center"><MapPin className="w-5 h-5 text-sky-600" /></span>
              <div><p className="text-xs text-slate-500">Kantor</p><p className="font-semibold">{LOCATION}</p></div>
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="lg:col-span-7 glass rounded-2xl p-6 sm:p-10 glow-cyan"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono-alt uppercase tracking-[0.2em] text-slate-500 mb-2">Nama Lengkap *</label>
              <input data-testid="lead-form-name" className={inputCls} placeholder="Nama Anda" value={form.name} onChange={set("name")} />
            </div>
            <div>
              <label className="block text-xs font-mono-alt uppercase tracking-[0.2em] text-slate-500 mb-2">No. WhatsApp *</label>
              <input data-testid="lead-form-phone" className={inputCls} placeholder="08xxxxxxxxxx" value={form.phone} onChange={set("phone")} />
            </div>
            <div>
              <label className="block text-xs font-mono-alt uppercase tracking-[0.2em] text-slate-500 mb-2">Email</label>
              <input data-testid="lead-form-email" type="email" className={inputCls} placeholder="nama@email.com" value={form.email} onChange={set("email")} />
            </div>
            <div>
              <label className="block text-xs font-mono-alt uppercase tracking-[0.2em] text-slate-500 mb-2">Layanan</label>
              <select data-testid="lead-form-service" className={inputCls} value={form.service} onChange={set("service")}>
                {SERVICE_OPTIONS.map((s) => <option key={s} value={s} className="bg-white">{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono-alt uppercase tracking-[0.2em] text-slate-500 mb-2">Ceritakan Kebutuhan Anda</label>
              <textarea data-testid="lead-form-message" rows={4} className={inputCls} placeholder="Contoh: Saya ingin mendirikan PT untuk bisnis impor kosmetik..." value={form.message} onChange={set("message")} />
            </div>
          </div>
          <button
            data-testid="lead-form-submit-button"
            type="submit"
            disabled={loading}
            className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 font-bold text-white hover:shadow-[0_0_40px_-5px_rgba(0,240,255,0.6)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? "Mengirim..." : "Kirim Permintaan Konsultasi"}
          </button>
          <p className="mt-4 text-center text-xs text-slate-600">Data Anda aman dan hanya digunakan untuk keperluan konsultasi.</p>
        </motion.form>
      </div>
    </section>
  );
}
