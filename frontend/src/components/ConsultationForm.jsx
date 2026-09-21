import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, Loader2, MessageCircle, Send, ShieldCheck } from "lucide-react";
import {
    SERVICES, LEGAL_STATUS_OPTIONS, TIMELINE_OPTIONS, waLink,
} from "@/data/content";
import { Reveal, SectionHeading } from "@/components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const INITIAL = {
    name: "", whatsapp: "", email: "", service: "",
    legal_status: "", timeline: "", domicile: "", message: "",
};

const inputCls =
    "w-full bg-[#0E1118] border border-[#262D3D] rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-gold/60 transition-colors";

export const ConsultationForm = ({ presetService }) => {
    const [form, setForm] = useState(INITIAL);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (presetService) setForm((f) => ({ ...f, service: presetService }));
    }, [presetService]);

    const set = (key) => (e) => {
        setForm({ ...form, [key]: e.target.value });
        setErrors((er) => ({ ...er, [key]: undefined }));
    };

    const validate = () => {
        const er = {};
        if (!form.name.trim()) er.name = "Nama wajib diisi";
        if (!/^[0-9+\-\s]{9,16}$/.test(form.whatsapp.trim()))
            er.whatsapp = "Nomor WhatsApp tidak valid";
        if (!form.service) er.service = "Pilih layanan";
        if (!form.legal_status) er.legal_status = "Pilih status legalitas";
        if (!form.timeline) er.timeline = "Pilih target waktu";
        if (!form.domicile.trim()) er.domicile = "Domisili wajib diisi";
        setErrors(er);
        return Object.keys(er).length === 0;
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await axios.post(`${API}/consultations`, form);
            setSubmitted(true);
            toast.success("Permintaan konsultasi terkirim. Tim kami akan segera menghubungi Anda.");
        } catch (err) {
            toast.error("Gagal mengirim. Silakan coba lagi atau hubungi kami via WhatsApp.");
        } finally {
            setLoading(false);
        }
    };

    const waMessage = `Halo Legalberizin.id, saya ${form.name || "..."}. Saya butuh layanan: ${form.service || "-"}. Status legalitas: ${form.legal_status || "-"}. Target waktu: ${form.timeline || "-"}. Domisili: ${form.domicile || "-"}. Mohon info langkah selanjutnya.`;

    return (
        <section id="konsultasi" className="relative py-24 sm:py-32 bg-[#0E1118] border-y border-[#262D3D]" data-testid="consultation-section">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5">
                    <SectionHeading
                        eyebrow="Konsultasi Gratis"
                        title="Ceritakan kebutuhan Anda, kami petakan jalannya"
                        description="Jawab beberapa pertanyaan singkat — konsultan kami akan menghubungi Anda maksimal 1×24 jam kerja dengan rencana perizinan yang jelas."
                    />
                    <Reveal delay={0.25}>
                        <ul className="mt-10 space-y-5">
                            {[
                                "Respons konsultan maksimal 1×24 jam kerja",
                                "Analisis kebutuhan izin tanpa biaya",
                                "Penawaran tertulis & transparan di awal",
                                "Data Anda dijaga kerahasiaannya",
                            ].map((point) => (
                                <li key={point} className="flex items-start gap-3 text-sm text-slate-300">
                                    <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>

                <div className="lg:col-span-7">
                    <Reveal delay={0.15}>
                        <div className="card-lux rounded-3xl p-7 sm:p-10 relative overflow-hidden">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                            <AnimatePresence mode="wait">
                                {submitted ? (
                                    <motion.div
                                        key="success"
                                        data-testid="consultation-success"
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        className="text-center py-14"
                                    >
                                        <span className="mx-auto w-16 h-16 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center">
                                            <CheckCircle2 className="w-8 h-8 text-gold" />
                                        </span>
                                        <h3 className="mt-6 font-display text-3xl font-semibold text-slate-50">
                                            Terima kasih, {form.name.split(" ")[0]}.
                                        </h3>
                                        <p className="mt-3 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                                            Permintaan konsultasi Anda sudah kami terima. Untuk respons
                                            lebih cepat, lanjutkan percakapan langsung via WhatsApp.
                                        </p>
                                        <a
                                            data-testid="consultation-success-whatsapp"
                                            href={waLink(waMessage)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-8 inline-flex items-center gap-2 bg-[#25D366] text-obsidian font-semibold px-7 py-3.5 rounded-full hover:brightness-110 transition"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Lanjutkan via WhatsApp
                                        </a>
                                        <button
                                            data-testid="consultation-reset-btn"
                                            onClick={() => { setSubmitted(false); setForm(INITIAL); }}
                                            className="mt-4 block mx-auto text-xs text-slate-500 hover:text-gold transition-colors underline underline-offset-4"
                                        >
                                            Kirim permintaan lain
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onSubmit={submit}
                                        noValidate
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                                    >
                                        <div className="sm:col-span-1">
                                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Nama Lengkap *</label>
                                            <input
                                                data-testid="consultation-input-name"
                                                className={inputCls}
                                                placeholder="Nama Anda"
                                                value={form.name}
                                                onChange={set("name")}
                                            />
                                            {errors.name && <p data-testid="error-name" className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Nomor WhatsApp *</label>
                                            <input
                                                data-testid="consultation-input-phone"
                                                className={inputCls}
                                                placeholder="08xxxxxxxxxx"
                                                value={form.whatsapp}
                                                onChange={set("whatsapp")}
                                            />
                                            {errors.whatsapp && <p data-testid="error-whatsapp" className="mt-1.5 text-xs text-red-400">{errors.whatsapp}</p>}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Email (opsional)</label>
                                            <input
                                                data-testid="consultation-input-email"
                                                type="email"
                                                className={inputCls}
                                                placeholder="nama@perusahaan.com"
                                                value={form.email}
                                                onChange={set("email")}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Layanan yang dibutuhkan *</label>
                                            <select
                                                data-testid="consultation-select-service"
                                                className={`${inputCls} appearance-none ${form.service ? "" : "text-slate-600"}`}
                                                value={form.service}
                                                onChange={set("service")}
                                            >
                                                <option value="" disabled>Pilih layanan...</option>
                                                {SERVICES.map((s) => (
                                                    <option key={s.id} value={s.title}>{s.number} — {s.title}</option>
                                                ))}
                                            </select>
                                            {errors.service && <p data-testid="error-service" className="mt-1.5 text-xs text-red-400">{errors.service}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Status legalitas saat ini *</label>
                                            <select
                                                data-testid="consultation-select-status"
                                                className={`${inputCls} appearance-none ${form.legal_status ? "" : "text-slate-600"}`}
                                                value={form.legal_status}
                                                onChange={set("legal_status")}
                                            >
                                                <option value="" disabled>Pilih status...</option>
                                                {LEGAL_STATUS_OPTIONS.map((o) => (
                                                    <option key={o} value={o}>{o}</option>
                                                ))}
                                            </select>
                                            {errors.legal_status && <p data-testid="error-status" className="mt-1.5 text-xs text-red-400">{errors.legal_status}</p>}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Target waktu operasional *</label>
                                            <select
                                                data-testid="consultation-select-timeline"
                                                className={`${inputCls} appearance-none ${form.timeline ? "" : "text-slate-600"}`}
                                                value={form.timeline}
                                                onChange={set("timeline")}
                                            >
                                                <option value="" disabled>Pilih target...</option>
                                                {TIMELINE_OPTIONS.map((o) => (
                                                    <option key={o} value={o}>{o}</option>
                                                ))}
                                            </select>
                                            {errors.timeline && <p data-testid="error-timeline" className="mt-1.5 text-xs text-red-400">{errors.timeline}</p>}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Domisili usaha *</label>
                                            <input
                                                data-testid="consultation-input-domicile"
                                                className={inputCls}
                                                placeholder="Contoh: Jakarta Selatan"
                                                value={form.domicile}
                                                onChange={set("domicile")}
                                            />
                                            {errors.domicile && <p data-testid="error-domicile" className="mt-1.5 text-xs text-red-400">{errors.domicile}</p>}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Pertanyaan / pesan tambahan</label>
                                            <textarea
                                                data-testid="consultation-input-message"
                                                rows={4}
                                                className={`${inputCls} resize-none`}
                                                placeholder="Ceritakan singkat rencana bisnis atau kendala perizinan Anda..."
                                                value={form.message}
                                                onChange={set("message")}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <button
                                                data-testid="consultation-form-submit-btn"
                                                type="submit"
                                                disabled={loading}
                                                className="w-full inline-flex items-center justify-center gap-2 bg-gold text-obsidian font-semibold px-7 py-4 rounded-full hover:bg-gold-light transition-colors disabled:opacity-60"
                                            >
                                                {loading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Send className="w-4 h-4" />
                                                )}
                                                {loading ? "Mengirim..." : "Kirim Permintaan Konsultasi"}
                                            </button>
                                            <p className="mt-3 text-center text-[11px] text-slate-600">
                                                Dengan mengirim formulir, Anda menyetujui dihubungi oleh tim Legalberizin.id.
                                            </p>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};
