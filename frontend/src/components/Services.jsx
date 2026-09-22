import { motion } from "framer-motion";
import { ArrowUpRight, Building2, MapPin, FlaskConical, ShieldCheck, FileCheck2, Pill, MonitorSmartphone } from "lucide-react";
import { waLink } from "@/lib/contact";

const SERVICES = [
  {
    icon: Building2,
    title: "Pendirian Badan Usaha",
    desc: "PT, PT PMDN/PMA, PT Perorangan, CV, hingga Yayasan — lengkap dengan akta notaris, SK Kemenkumham, NPWP, dan NIB melalui OSS-RBA.",
    tags: ["PT", "PT PMA", "CV", "Yayasan"],
  },
  {
    icon: MapPin,
    title: "Virtual Office",
    desc: "Alamat bisnis legal dan prestisius di Jakarta Utara dengan zonasi komersial, surat domisili resmi, dan dukungan operasional kantor.",
    tags: ["Jakarta Utara", "Domisili Resmi", "Zonasi Komersial"],
  },
  {
    icon: FlaskConical,
    title: "Sertifikat Standar KBLI 46441",
    desc: "Pengurusan sertifikat standar terverifikasi untuk perdagangan besar farmasi — syarat wajib distribusi produk obat dan kesehatan.",
    tags: ["KBLI 46441", "Farmasi", "OSS-RBA"],
  },
  {
    icon: ShieldCheck,
    title: "Izin BPOM Kosmetik Impor",
    desc: "Pendampingan registrasi BPOM untuk kosmetik impor: penyiapan dokumen legalitas, Letter of Appointment, CFS, hingga persyaratan GMP.",
    tags: ["BPOM", "Kosmetik Impor", "Registrasi"],
  },
  {
    icon: FileCheck2,
    title: "Notifikasi Izin Edar Kosmetik Impor",
    desc: "Pengajuan notifikasi kosmetik impor hingga terbit nomor izin edar (NA) sehingga produk Anda sah dan aman dipasarkan di Indonesia.",
    tags: ["Notifikasi NA", "Izin Edar", "Kosmetik"],
  },
  {
    icon: Pill,
    title: "Izin Alkes Impor",
    desc: "Izin Penyalur Alat Kesehatan (IPAK) dan registrasi izin edar alat kesehatan impor dari Kemenkes — dari nol sampai terbit.",
    tags: ["IPAK", "Kemenkes", "Alkes Impor"],
  },
  {
    icon: MonitorSmartphone,
    title: "Layanan Digital",
    desc: "Percepatan NIB/OSS, perubahan akta & anggaran dasar, PKP, serta dukungan digital untuk operasional bisnis modern Anda.",
    tags: ["NIB / OSS", "PKP", "Perubahan Akta"],
  },
];

export default function Services() {
  return (
    <section id="layanan" data-testid="services-manifesto-section" className="relative py-28 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="font-mono-alt text-xs uppercase tracking-[0.3em] text-sky-600 mb-6">Manifesto Layanan</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
              Tujuh Bab Menuju <span className="text-gradient">Bisnis yang Sah.</span>
            </h2>
            <p className="mt-6 text-slate-600 text-sm sm:text-base leading-relaxed">
              Setiap layanan ditangani konsultan berpengalaman dengan alur jelas, estimasi waktu transparan, dan update progres berkala.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.a
                key={s.title}
                data-testid={`service-chapter-${i + 1}`}
                href={waLink(`Halo Legalberizin.id, saya ingin konsultasi layanan: ${s.title}`)}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="group relative grid grid-cols-12 gap-4 sm:gap-6 items-start py-8 sm:py-10 border-t border-sky-200 hover:bg-sky-50 transition-colors duration-500"
              >
                <span className="col-span-2 sm:col-span-1 font-mono-alt text-sm text-cyan-500/80 pt-1">
                  0{i + 1}
                </span>
                <div className="col-span-10 sm:col-span-10">
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
                <ArrowUpRight className="hidden sm:block col-span-1 w-6 h-6 text-slate-600 group-hover:text-sky-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 justify-self-end" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
