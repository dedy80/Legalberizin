import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SERVICES, SERVICE_IMAGES } from "@/data/services";

export default function Services() {
  const navigate = useNavigate();
  return (
    <section id="layanan" data-testid="services-manifesto-section" className="relative py-28 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="font-mono-alt text-xs uppercase tracking-[0.3em] text-sky-600 mb-6">Manifesto Layanan</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
              Sembilan Bab Menuju <span className="text-gradient">Bisnis yang Sah.</span>
            </h2>
            <p className="mt-6 text-slate-600 text-sm sm:text-base leading-relaxed">
              Setiap layanan ditangani konsultan berpengalaman dengan alur jelas, estimasi waktu transparan, dan update progres berkala. Klik layanan untuk detail lengkap.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                role="link"
                tabIndex={0}
                data-testid={`service-chapter-${i + 1}`}
                onClick={() => navigate(`/layanan/${s.slug}`)}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/layanan/${s.slug}`)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="group relative grid grid-cols-12 gap-4 sm:gap-6 items-start py-8 sm:py-10 border-t border-sky-200 hover:bg-sky-50 transition-colors duration-500 cursor-pointer"
              >
                <span className="col-span-2 sm:col-span-1 font-mono-alt text-sm text-cyan-500/80 pt-1">
                  0{i + 1}
                </span>
                <div className="col-span-10 sm:col-span-8">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-sky-600 shrink-0" />
                    <h3 className="text-lg sm:text-xl font-semibold group-hover:text-sky-700 transition-colors duration-300">{s.title}</h3>
                  </div>
                  <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">{s.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span key={t} className="rounded-full border border-sky-200 px-3 py-1 text-xs text-slate-500 group-hover:text-sky-700/80 group-hover:border-sky-400 transition-colors duration-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <img
                  src={SERVICE_IMAGES[s.slug]}
                  alt={s.title}
                  loading="lazy"
                  className="hidden sm:block col-span-2 w-full h-24 rounded-xl object-cover border border-sky-200 group-hover:scale-[1.03] transition-transform duration-500"
                />
                <ArrowUpRight className="hidden sm:block col-span-1 w-6 h-6 text-slate-600 group-hover:text-sky-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 justify-self-end" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
