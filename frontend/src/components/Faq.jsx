import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Berapa lama proses pendirian PT atau CV?",
    a: "Rata-rata 3–7 hari kerja sejak dokumen lengkap, termasuk akta notaris, SK Kemenkumham, NPWP, dan NIB melalui OSS-RBA. Kami akan memberikan timeline pasti setelah konsultasi awal.",
  },
  {
    q: "Apa itu Sertifikat Standar KBLI 46441 dan siapa yang wajib memilikinya?",
    a: "Ini adalah sertifikat standar terverifikasi untuk usaha perdagangan besar farmasi (obat untuk manusia). Wajib dimiliki perusahaan yang mendistribusikan produk farmasi sebelum beroperasi, sebagai pengganti izin pada sistem OSS-RBA.",
  },
  {
    q: "Apakah kosmetik impor wajib punya notifikasi BPOM?",
    a: "Ya. Setiap produk kosmetik impor wajib memiliki nomor notifikasi (NA) dari BPOM sebelum diedarkan. Kami mendampingi dari penyiapan dokumen (LoA, CFS, GMP) hingga nomor izin edar terbit.",
  },
  {
    q: "Virtual office di Jakarta Utara bisa dipakai untuk pendirian PT?",
    a: "Bisa. Alamat virtual office kami berada di zonasi komersial sehingga sah digunakan sebagai domisili pendirian PT/CV, pengurusan NIB, dan NPWP perusahaan.",
  },
  {
    q: "Bagaimana cara mulai konsultasi?",
    a: "Klik tombol Konsultasi Gratis, isi form singkat, atau langsung chat WhatsApp 0851-7111-4889. Konsultasi awal tidak dipungut biaya.",
  },
];

export default function Faq() {
  return (
    <section id="faq" data-testid="faq-accordion-section" className="py-28 lg:py-36 bg-[#E9F2F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5"
        >
          <p className="font-mono-alt text-xs uppercase tracking-[0.3em] text-sky-600 mb-6">FAQ</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Pertanyaan yang <span className="text-gradient">Sering Diajukan.</span>
          </h2>
          <p className="mt-6 text-slate-600 text-sm sm:text-base leading-relaxed">
            Tidak menemukan jawaban? Tanya langsung ke LegalAI Assistant di pojok kanan bawah, atau hubungi tim kami via WhatsApp.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="lg:col-span-7"
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-sky-200" data-testid={`faq-item-${i + 1}`}>
                <AccordionTrigger className="text-left font-semibold hover:text-sky-700 hover:no-underline py-6" data-testid={`faq-trigger-${i + 1}`}>
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed" data-testid={`faq-content-${i + 1}`}>
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
