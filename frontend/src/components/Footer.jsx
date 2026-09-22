import { Mail, MapPin, MessageCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { EMAIL, LOCATION, WA_DEFAULT, WA_DISPLAY, scrollToId } from "@/lib/contact";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const goTo = (href) => {
    if (href.startsWith("/")) {
      navigate(href);
    } else if (location.pathname === "/") {
      scrollToId(href);
    } else {
      navigate("/" + href);
    }
  };
  return (
    <footer id="kontak" data-testid="contact-footer-section" className="border-t border-white/10 bg-[#0C2D48]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <span className="inline-flex bg-white rounded-xl px-4 py-2.5 shadow-lg">
            <img src="/logo.png" alt="Legalberizin.id" className="h-10 w-auto" />
          </span>
          <p className="mt-5 text-sm text-sky-100/70 leading-relaxed max-w-sm">
            Konsultan legalitas & perizinan usaha. Pendirian badan usaha, virtual office, izin BPOM, dan alkes impor — beres sampai dokumen terbit.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="font-mono-alt text-xs uppercase tracking-[0.25em] text-sky-300 mb-5">Navigasi</p>
          <ul className="space-y-3 text-sm">
            {[["Layanan", "#layanan"], ["Keunggulan", "#keunggulan"], ["Testimoni", "#testimoni"], ["Blog", "/blog"], ["FAQ", "#faq"], ["Konsultasi", "#konsultasi"]].map(([label, href]) => (
              <li key={href}>
                <button data-testid={`footer-link-${label.toLowerCase()}`} onClick={() => scrollToId(href)} className="text-sky-100/70 hover:text-sky-200 transition-colors">
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="font-mono-alt text-xs uppercase tracking-[0.25em] text-sky-300 mb-5">Hubungi Kami</p>
          <ul className="space-y-4 text-sm">
            <li>
              <a data-testid="footer-whatsapp-link" href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sky-100/80 hover:text-sky-200 transition-colors">
                <MessageCircle className="w-4 h-4 text-sky-300" /> {WA_DISPLAY}
              </a>
            </li>
            <li>
              <a data-testid="footer-email-link" href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-sky-100/80 hover:text-sky-200 transition-colors">
                <Mail className="w-4 h-4 text-sky-300" /> {EMAIL}
              </a>
            </li>
            <li className="flex items-center gap-3 text-sky-100/80">
              <MapPin className="w-4 h-4 text-sky-300" /> {LOCATION}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6">
        <p className="text-center text-xs text-sky-200/60">© 2026 Legalberizin.id — Semua hak dilindungi.</p>
      </div>
    </footer>
  );
}
