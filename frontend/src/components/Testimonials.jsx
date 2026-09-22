import { motion } from "framer-motion";
import { Quote, BadgeCheck } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Rendra Wijaya",
    role: "Founder, Skincare Brand Impor",
    text: "Notifikasi BPOM kosmetik impor kami beres tanpa bolak-balik. Tim Legalberizin menjelaskan setiap tahap dengan bahasa yang mudah dipahami.",
  },
  {
    name: "Sinta Maharani",
    role: "Owner, CV Trading Jakarta",
    text: "Dari pendirian CV sampai NIB dan PKP semua satu pintu. Prosesnya cepat dan setiap progres selalu diinfokan lewat WhatsApp.",
  },
  {
    name: "Andi Prasetyo",
    role: "Direktur, Distributor Alkes",
    text: "IPAK dan sertifikat standar KBLI 46441 kami terbit sesuai timeline yang dijanjikan. Sangat direkomendasikan untuk bisnis alkes.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimoni" data-testid="testimonials-section" className="py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-mono-alt text-xs uppercase tracking-[0.3em] text-sky-600 mb-6">Kata Mereka</p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight max-w-2xl">
          Dipercaya Para <span className="text-gradient">Penggerak Bisnis.</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              data-testid={`testimonial-card-${i + 1}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-2xl p-8 flex flex-col hover:border-sky-400 hover:-translate-y-1 transition-all duration-300"
            >
              <Quote className="w-6 h-6 text-sky-600" />
              <blockquote className="mt-5 text-slate-700 text-sm sm:text-base leading-relaxed flex-1">“{t.text}”</blockquote>
              <figcaption className="mt-6 pt-5 border-t border-sky-200">
                <p className="font-semibold flex items-center gap-1.5">
                  {t.name}
                  <BadgeCheck className="w-4 h-4 text-sky-600" />
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{t.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
