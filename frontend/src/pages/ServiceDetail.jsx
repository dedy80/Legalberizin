import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ListChecks, MessageCircle } from "lucide-react";
import { SERVICES, SERVICE_IMAGES } from "@/data/services";
import { waLink } from "@/lib/contact";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = SERVICES.find((s) => s.slug === slug);

  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
    if (service) {
      document.title = service.metaTitle;
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", service.metaDesc);
    }
  }, [service]);

  if (!service) {
    return (
      <>
        <Navbar />
        <main data-testid="service-not-found" className="pt-40 pb-32 text-center">
          <h1 className="text-2xl font-bold">Layanan tidak ditemukan</h1>
          <button
            data-testid="service-not-found-back-button"
            onClick={() => navigate("/")}
            className="mt-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-bold text-white"
          >
            Kembali ke Beranda
          </button>
        </main>
        <Footer />
      </>
    );
  }

  const Icon = service.icon;
  const wa = waLink(`Halo Legalberizin.id, saya ingin konsultasi layanan: ${service.title}`);

  return (
    <>
      <Navbar />
      <main data-testid="service-detail-page" className="pt-32 lg:pt-40 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            {...fadeUp(0)}
            data-testid="service-back-button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </motion.button>

          <motion.p {...fadeUp(0.1)} className="mt-8 font-mono-alt text-xs uppercase tracking-[0.3em] text-sky-600">
            Layanan / {service.title}
          </motion.p>

          <motion.h1
            {...fadeUp(0.2)}
            data-testid="service-title"
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
          >
            {service.h1}
          </motion.h1>

          <motion.p {...fadeUp(0.3)} className="mt-6 max-w-3xl text-slate-600 text-base sm:text-lg leading-relaxed">
            {service.intro}
          </motion.p>

          <motion.div {...fadeUp(0.35)} className="mt-10 rounded-2xl overflow-hidden border border-sky-200 shadow-lg">
            <img
              src={SERVICE_IMAGES[service.slug]}
              alt={service.title}
              className="w-full h-56 sm:h-72 object-cover"
            />
          </motion.div>

          <motion.div {...fadeUp(0.4)} className="mt-8 flex flex-wrap gap-4">
            <a
              data-testid="service-whatsapp-cta"
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 font-bold text-white hover:shadow-[0_0_30px_-5px_rgba(2,132,199,0.5)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              Konsultasi via WhatsApp
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </a>
            <button
              data-testid="service-form-cta"
              onClick={() => navigate("/#konsultasi")}
              className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 font-semibold text-sky-700 hover:border-sky-400 transition-all duration-300"
            >
              Isi Form Konsultasi
            </button>
          </motion.div>

          <motion.section {...fadeUp(0.5)} className="mt-16" data-testid="service-benefits">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Apa yang Anda Dapatkan</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.benefits.map((b, i) => (
                <div key={i} data-testid={`service-benefit-${i + 1}`} className="glass rounded-2xl p-5 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section {...fadeUp(0.6)} className="mt-16" data-testid="service-process">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Alur Prosesnya</h2>
            <div className="mt-6">
              {service.process.map((p, i) => (
                <div key={i} data-testid={`service-step-${i + 1}`} className="grid grid-cols-12 gap-4 py-5 border-t border-sky-200">
                  <span className="col-span-2 sm:col-span-1 font-mono-alt text-sm text-sky-600 pt-0.5">0{i + 1}</span>
                  <div className="col-span-10 sm:col-span-11">
                    <h3 className="font-semibold">{p.t}</h3>
                    <p className="mt-1 text-sm text-slate-600">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section {...fadeUp(0.7)} className="mt-16" data-testid="service-requirements">
            <div className="glass rounded-2xl p-6 sm:p-8 glow-cyan">
              <div className="flex items-center gap-3">
                <ListChecks className="w-6 h-6 text-sky-600" />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Dokumen yang Perlu Disiapkan</h2>
              </div>
              <ul className="mt-5 space-y-3">
                {service.requirements.map((r, i) => (
                  <li key={i} data-testid={`service-requirement-${i + 1}`} className="flex items-start gap-3 text-sm sm:text-base text-slate-600">
                    <span className="mt-2 inline-block w-1.5 h-1.5 rotate-45 bg-sky-500 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          <motion.section {...fadeUp(0.8)} className="mt-16" data-testid="service-faq">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Pertanyaan Seputar Layanan Ini</h2>
            <Accordion type="single" collapsible className="mt-4 w-full">
              {service.faqs.map((f, i) => (
                <AccordionItem key={i} value={`sfaq-${i}`} className="border-sky-200" data-testid={`service-faq-item-${i + 1}`}>
                  <AccordionTrigger className="text-left font-semibold hover:text-sky-700 hover:no-underline py-5" data-testid={`service-faq-trigger-${i + 1}`}>
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.section>

          <motion.section
            {...fadeUp(0.9)}
            data-testid="service-bottom-cta"
            className="mt-20 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 p-8 sm:p-12 text-center text-white"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Siap Mengurus {service.title}?</h2>
            <p className="mt-3 text-sky-100 max-w-xl mx-auto text-sm sm:text-base">
              Konsultasi awal gratis. Ceritakan kebutuhan Anda, kami berikan gambaran proses dan estimasi biayanya.
            </p>
            <a
              data-testid="service-bottom-whatsapp-button"
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-bold text-blue-700 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              Chat WhatsApp Sekarang
            </a>
          </motion.section>
        </div>
      </main>
      <Footer />
    </>
  );
}
