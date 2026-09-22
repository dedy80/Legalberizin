import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, MessageCircle } from "lucide-react";
import { WA_DEFAULT, scrollToId } from "@/lib/contact";

const RevealLine = ({ children, delay = 0 }) => (
  <span className="block overflow-hidden pb-1">
    <motion.span
      className="block"
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

const STATS = [
  { value: "1.500+", label: "Izin & Badan Usaha Terbit" },
  { value: "07", label: "Layanan Spesialis" },
  { value: "24/7", label: "LegalAI Assistant Siaga" },
];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} data-testid="hero-section" className="relative min-h-screen flex items-center overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1580968129299-c9809833a1ae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBjb3Jwb3JhdGUlMjBqYWthcnRhJTIwb2ZmaWNlJTIwc2t5c2NyYXBlciUyMGN5YW4lMjBibHVlJTIwZHVza3xlbnwwfHx8fDE3OTAwMzkxOTF8MA&ixlib=rb-4.1.0&q=85"
          alt="Jakarta skyline"
          className="w-full h-[120%] object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F17]/70 via-[#0B0F17]/80 to-[#0B0F17]" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[140px] animate-[pulse-glow_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-sky-700/20 blur-[120px]" />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 w-full">
        <RevealLine delay={0.4}>
          <p className="font-mono-alt text-xs uppercase tracking-[0.3em] text-cyan-400 mb-8" data-testid="hero-eyebrow">
            Konsultan Legalitas & Perizinan — Jakarta Utara
          </p>
        </RevealLine>

        <h1 className="text-4xl sm:text-6xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.02]">
          <RevealLine delay={0.55}>Fokus Bangun Bisnis.</RevealLine>
          <RevealLine delay={0.7}>
            <span className="text-gradient">Legalitasnya,</span>
          </RevealLine>
          <RevealLine delay={0.85}>Kami yang Urus.</RevealLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl text-slate-400 text-base sm:text-lg leading-relaxed"
        >
          Pendirian PT, CV, Yayasan, Virtual Office, hingga izin BPOM & Alkes impor —
          satu pintu, transparan, dan beres sampai dokumen terbit.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            data-testid="hero-cta-consultation"
            onClick={() => scrollToId("#konsultasi")}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-600 px-7 py-3.5 font-bold text-[#0B0F17] hover:shadow-[0_0_40px_-5px_rgba(0,240,255,0.6)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Konsultasi Gratis
            <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform duration-300" />
          </button>
          <a
            data-testid="hero-cta-whatsapp"
            href={WA_DEFAULT}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 font-semibold text-cyan-300 hover:border-cyan-400/40 hover:bg-cyan-400/10 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            Chat WhatsApp Direct
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-20 grid grid-cols-3 gap-6 max-w-2xl border-t border-cyan-400/10 pt-8"
          data-testid="hero-stats"
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-4xl font-extrabold text-gradient">{s.value}</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
