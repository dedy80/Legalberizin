import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, BadgeCheck, Clock3, MessageCircle } from "lucide-react";
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
  { value: "09", label: "Layanan Spesialis" },
  { value: "24/7", label: "LegalAI Assistant Siaga" },
];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} data-testid="hero-section" className="relative min-h-screen flex items-center overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2400&auto=format&fit=crop"
          alt="Gedung korporat profesional"
          className="w-full h-[120%] object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4F8FB]/70 via-[#F4F8FB]/80 to-[#F4F8FB]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F4F8FB]/85 via-[#F4F8FB]/20 to-[#F4F8FB]/50" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-cyan-400/25 blur-[140px] animate-[pulse-glow_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-sky-400/25 blur-[120px]" />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-7">
          <RevealLine delay={0.4}>
            <p className="font-mono-alt text-xs uppercase tracking-[0.3em] text-sky-600 mb-8" data-testid="hero-eyebrow">
              Konsultan Legalitas & Perizinan — Jakarta Utara
            </p>
          </RevealLine>

          <h1 className="text-4xl sm:text-6xl lg:text-[4.4rem] font-extrabold tracking-tight leading-[1.02]">
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
            className="mt-8 max-w-xl text-slate-600 text-base sm:text-lg leading-relaxed"
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
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 font-bold text-white hover:shadow-[0_0_40px_-5px_rgba(0,240,255,0.6)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Konsultasi Gratis
              <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform duration-300" />
            </button>
            <a
              data-testid="hero-cta-whatsapp"
              href={WA_DEFAULT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 font-semibold text-sky-700 hover:border-sky-400 hover:bg-sky-100/70 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              Chat WhatsApp Direct
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-2xl border-t border-sky-200 pt-8"
            data-testid="hero-stats"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl sm:text-4xl font-extrabold text-gradient">{s.value}</p>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative hidden lg:block"
          data-testid="hero-model"
        >
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2.2rem] bg-gradient-to-br from-cyan-400/35 to-blue-600/25 blur-2xl" />
            <div className="relative rounded-[2rem] overflow-hidden border border-sky-200 shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-700">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop"
                alt="Konsultan legalitas profesional Legalberizin.id"
                className="w-full h-[540px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C2D48]/45 via-transparent to-transparent" />
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -left-8 top-10 glass rounded-2xl px-5 py-4 flex items-center gap-3 shadow-xl"
            >
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <BadgeCheck className="w-5 h-5 text-white" />
              </span>
              <div>
                <p className="font-extrabold text-sm">1.500+ Dokumen Terbit</p>
                <p className="text-xs text-slate-500">Resmi & terdaftar</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
              className="absolute -right-6 bottom-12 glass rounded-2xl px-5 py-4 flex items-center gap-3 shadow-xl"
            >
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center">
                <Clock3 className="w-5 h-5 text-white" />
              </span>
              <div>
                <p className="font-extrabold text-sm">Respons Cepat</p>
                <p className="text-xs text-slate-500">Konsultasi tiap hari</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
