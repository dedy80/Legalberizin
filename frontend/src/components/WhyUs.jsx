import { motion } from "framer-motion";
import { BadgeCheck, Clock3, MessagesSquare, ShieldCheck } from "lucide-react";

const CARDS = [
  { icon: BadgeCheck, title: "100% Legal & Terdaftar", desc: "Semua dokumen terbit resmi melalui kanal pemerintah: Kemenkumham, OSS, BPOM, dan Kemenkes." },
  { icon: Clock3, title: "Proses Cepat & Transparan", desc: "Timeline jelas sejak awal, update progres berkala, tanpa biaya tersembunyi." },
  { icon: MessagesSquare, title: "Konsultasi Tanpa Sekat", desc: "Diskusi dulu, bayar kemudian. Tim kami siap menjawab via WhatsApp setiap hari." },
  { icon: ShieldCheck, title: "Data Aman & Rahasia", desc: "Dokumen perusahaan Anda diperlakukan dengan standar kerahasiaan profesional." },
];

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export default function WhyUs() {
  return (
    <section id="keunggulan" data-testid="why-us-section" className="relative py-28 lg:py-36 bg-[#0E141F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p {...reveal} transition={{ duration: 0.6 }} className="font-mono-alt text-xs uppercase tracking-[0.3em] text-cyan-400 mb-6">
          Kenapa Legalberizin.id
        </motion.p>
        <motion.h2 {...reveal} transition={{ duration: 0.7, delay: 0.1 }} className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight max-w-2xl">
          Solusi Legalitas Satu Pintu. <span className="text-gradient">Partner Legal Bisnis Anda.</span>
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6">
          <motion.div {...reveal} transition={{ duration: 0.7, delay: 0.15 }} className="md:col-span-8 lg:col-span-7 relative rounded-2xl overflow-hidden group min-h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1748336698576-648750d82f86?fm=jpg&q=80&w=1600&auto=format&fit=crop"
              alt="Gedung pencakar langit Jakarta"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/40 to-transparent" />
            <div className="absolute bottom-0 p-8">
              <p className="font-mono-alt text-xs uppercase tracking-[0.25em] text-cyan-300">Kantor Kami</p>
              <p className="mt-2 text-xl sm:text-2xl font-bold">Berbasis di Jakarta Utara, melayani seluruh Indonesia.</p>
            </div>
          </motion.div>

          <motion.div {...reveal} transition={{ duration: 0.7, delay: 0.25 }} className="md:col-span-8 lg:col-span-5 glass rounded-2xl p-8 flex flex-col justify-center glow-cyan">
            <p className="text-5xl sm:text-6xl font-extrabold text-gradient">1.500+</p>
            <p className="mt-3 text-slate-300 font-semibold">Izin, akta, dan badan usaha berhasil diterbitkan</p>
            <p className="mt-2 text-sm text-slate-500">Dipercaya founder, UMKM, hingga perusahaan impor di seluruh Indonesia.</p>
          </motion.div>

          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                data-testid={`why-us-card-${i + 1}`}
                {...reveal}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.08 }}
                className="md:col-span-4 lg:col-span-3 glass rounded-2xl p-6 hover:border-cyan-400/30 hover:-translate-y-1 transition-all duration-300"
              >
                <Icon className="w-7 h-7 text-cyan-400" />
                <h3 className="mt-4 font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{c.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
