import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { scrollToId, waLink } from "@/data/content";

const HERO_IMAGE =
    "https://images.unsplash.com/photo-1562367072-fea5c7eb8748?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBqYWthcnRhJTIwc2t5c2NyYXBlciUyMGNvcnBvcmF0ZSUyMGxlZ2FsJTIwb2ZmaWNlJTIwYXJjaGl0ZWN0dXJlJTIwZXhlY3V0aXZlJTIwYnVzaW5lc3MlMjBtZWV0aW5nJTIwZGVzayUyMGNvbnN1bHRhdGlvbiUyMGRvY3VtZW50JTIwc2lnbmluZ3xlbnwwfHx8fDE3OTAwMDk0NjN8MA&ixlib=rb-4.1.0&q=85";

const Counter = ({ to, suffix = "" }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const [val, setVal] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const controls = animate(0, to, {
            duration: 2.2,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (v) => setVal(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, to]);

    return (
        <span ref={ref} className="tabular-nums">
            {val.toLocaleString("id-ID")}
            {suffix}
        </span>
    );
};

const MaskedLine = ({ children, delay }) => (
    <div className="overflow-hidden">
        <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    </div>
);

const STATS = [
    { value: 500, suffix: "+", label: "Badan Usaha Berdiri" },
    { value: 1200, suffix: "+", label: "Izin & Sertifikat Terbit" },
    { value: 98, suffix: "%", label: "Tingkat Persetujuan" },
    { value: 7, suffix: "", label: "Layanan Unggulan" },
];

export const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
    const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    return (
        <section ref={ref} className="relative min-h-screen flex flex-col justify-end overflow-hidden" data-testid="hero-section">
            <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
                <img
                    src={HERO_IMAGE}
                    alt="Skyline bisnis Jakarta"
                    className="w-full h-[120%] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D12]/80 via-[#0B0D12]/60 to-[#0B0D12]" />
                <div className="absolute inset-0 gold-glow" />
            </motion.div>

            <motion.div style={{ opacity: fade }} className="max-w-7xl mx-auto w-full px-5 sm:px-8 pt-40 pb-16 sm:pb-24">
                <MaskedLine delay={0.25}>
                    <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-gold font-semibold font-mono2 mb-6">
                        Konsultan Perizinan &amp; Legalitas Usaha — Indonesia
                    </p>
                </MaskedLine>

                <h1 data-testid="hero-title" className="font-display font-semibold tracking-tight leading-[1.02] text-slate-50 text-5xl sm:text-7xl lg:text-8xl">
                    <MaskedLine delay={0.4}>
                        <span>Legalitas beres,</span>
                    </MaskedLine>
                    <MaskedLine delay={0.55}>
                        <span className="italic gold-text-gradient">bisnis melaju</span>
                    </MaskedLine>
                    <MaskedLine delay={0.7}>
                        <span>tanpa batas.</span>
                    </MaskedLine>
                </h1>

                <div className="mt-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-xl"
                    >
                        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                            Dari pendirian PT hingga izin BPOM dan alkes impor — Legalberizin.id
                            mengurus seluruh perizinan usaha Anda secara terstruktur, transparan,
                            dan tepat waktu.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <button
                                data-testid="hero-cta-form"
                                onClick={() => scrollToId("#konsultasi")}
                                className="group inline-flex items-center gap-2 bg-gold text-obsidian font-semibold px-7 py-3.5 rounded-full hover:bg-gold-light transition-colors"
                            >
                                Mulai Konsultasi Gratis
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                            <a
                                data-testid="hero-cta-whatsapp"
                                href={waLink("Halo Legalberizin.id, saya ingin konsultasi mengenai perizinan usaha saya.")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 border border-[#262D3D] text-slate-200 px-7 py-3.5 rounded-full hover:border-gold/60 hover:text-gold transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Chat WhatsApp
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#262D3D] border border-[#262D3D] rounded-2xl overflow-hidden w-full lg:max-w-2xl"
                        data-testid="hero-stats"
                    >
                        {STATS.map((s) => (
                            <div key={s.label} className="bg-[#121620]/90 px-5 py-6">
                                <p className="font-display text-3xl sm:text-4xl font-semibold text-gold">
                                    <Counter to={s.value} suffix={s.suffix} />
                                </p>
                                <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-wider text-slate-500">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};
