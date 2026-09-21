import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, BadgeCheck, FileText, ArrowRight } from "lucide-react";
import { ESTIMATOR_OPTIONS, scrollToId } from "@/data/content";
import { Reveal, SectionHeading } from "@/components/Reveal";

export const Estimator = () => {
    const [active, setActive] = useState(ESTIMATOR_OPTIONS[0].id);
    const current = ESTIMATOR_OPTIONS.find((o) => o.id === active);

    return (
        <section id="estimasi" className="relative py-24 sm:py-32" data-testid="estimator-section">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <SectionHeading
                    eyebrow="Cek Kebutuhan Izin"
                    title="Pilih model bisnis Anda, lihat kebutuhannya"
                    description="Gambaran instan mengenai izin wajib, dokumen, dan estimasi waktu — sebelum Anda menghubungi kami."
                    align="center"
                />

                <Reveal delay={0.2} className="mt-12">
                    <div className="flex flex-wrap justify-center gap-3">
                        {ESTIMATOR_OPTIONS.map((opt) => (
                            <button
                                key={opt.id}
                                data-testid={`estimator-option-${opt.id}`}
                                onClick={() => setActive(opt.id)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 ${
                                    active === opt.id
                                        ? "bg-gold text-obsidian border-gold"
                                        : "border-[#262D3D] text-slate-300 hover:border-gold/50 hover:text-gold"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </Reveal>

                <div className="mt-10 max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current.id}
                            data-testid="estimator-panel"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="card-lux rounded-3xl p-8 sm:p-10"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-50">
                                    {current.headline}
                                </h3>
                                <span className="inline-flex items-center gap-2 text-sm text-gold border border-gold/40 rounded-full px-4 py-1.5 shrink-0 w-fit">
                                    <Clock className="w-4 h-4" />
                                    {current.duration}
                                </span>
                            </div>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-gold font-semibold mb-4 flex items-center gap-2">
                                        <BadgeCheck className="w-4 h-4" /> Izin yang wajib dimiliki
                                    </p>
                                    <ul className="space-y-3">
                                        {current.licenses.map((l) => (
                                            <li key={l} className="flex items-start gap-3 text-sm text-slate-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                                                {l}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-gold font-semibold mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Dokumen yang disiapkan
                                    </p>
                                    <ul className="space-y-3">
                                        {current.docs.map((d) => (
                                            <li key={d} className="flex items-start gap-3 text-sm text-slate-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <button
                                data-testid="estimator-cta"
                                onClick={() => scrollToId("#konsultasi")}
                                className="group mt-10 inline-flex items-center gap-2 bg-gold text-obsidian font-semibold px-6 py-3 rounded-full hover:bg-gold-light transition-colors"
                            >
                                Diskusikan kebutuhan saya
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
