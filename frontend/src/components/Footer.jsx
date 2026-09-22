import { Mail, MapPin, MessageCircle } from "lucide-react";
import { EMAIL, LOCATION, WA_DEFAULT, WA_DISPLAY, scrollToId } from "@/lib/contact";

export default function Footer() {
  return (
    <footer id="kontak" data-testid="contact-footer-section" className="border-t border-cyan-400/10 bg-[#0E141F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-sky-700 flex items-center justify-center font-extrabold text-[#0B0F17] text-lg">L</span>
            <span className="font-extrabold tracking-tight text-lg">
              LEGAL<span className="text-gradient">BERIZIN</span><span className="text-cyan-400">.id</span>
            </span>
          </div>
          <p className="mt-5 text-sm text-slate-400 leading-relaxed max-w-sm">
            Konsultan legalitas & perizinan usaha. Pendirian badan usaha, virtual office, izin BPOM, dan alkes impor — beres sampai dokumen terbit.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="font-mono-alt text-xs uppercase tracking-[0.25em] text-cyan-400 mb-5">Navigasi</p>
          <ul className="space-y-3 text-sm">
            {[["Layanan", "#layanan"], ["Keunggulan", "#keunggulan"], ["Testimoni", "#testimoni"], ["FAQ", "#faq"], ["Konsultasi", "#konsultasi"]].map(([label, href]) => (
              <li key={href}>
                <button data-testid={`footer-link-${label.toLowerCase()}`} onClick={() => scrollToId(href)} className="text-slate-400 hover:text-cyan-300 transition-colors">
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="font-mono-alt text-xs uppercase tracking-[0.25em] text-cyan-400 mb-5">Hubungi Kami</p>
          <ul className="space-y-4 text-sm">
            <li>
              <a data-testid="footer-whatsapp-link" href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-cyan-300 transition-colors">
                <MessageCircle className="w-4 h-4 text-cyan-400" /> {WA_DISPLAY}
              </a>
            </li>
            <li>
              <a data-testid="footer-email-link" href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-slate-300 hover:text-cyan-300 transition-colors">
                <Mail className="w-4 h-4 text-cyan-400" /> {EMAIL}
              </a>
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <MapPin className="w-4 h-4 text-cyan-400" /> {LOCATION}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cyan-400/10 py-6">
        <p className="text-center text-xs text-slate-600">© 2026 Legalberizin.id — Semua hak dilindungi.</p>
      </div>
    </footer>
  );
}
