import { Scale, MapPin, Clock, Mail, Phone, MessageCircle } from "lucide-react";
import { CONTACT, SERVICES, NAV_LINKS, scrollToId, waLink } from "@/data/content";

export const Footer = () => (
    <footer id="kontak" className="relative bg-[#080A0E] border-t border-[#262D3D]" data-testid="footer">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
                <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full border border-gold/50 flex items-center justify-center bg-gold/10">
                        <Scale className="w-4 h-4 text-gold" />
                    </span>
                    <span className="font-display text-2xl font-semibold text-slate-50">
                        Legalberizin<span className="text-gold">.id</span>
                    </span>
                </div>
                <p className="mt-5 text-sm text-slate-400 leading-relaxed font-light">
                    Konsultan perizinan dan legalitas usaha — mendampingi bisnis Indonesia
                    berdiri, patuh, dan bertumbuh dengan fondasi hukum yang kuat.
                </p>
                <a
                    data-testid="footer-whatsapp-link"
                    href={waLink("Halo Legalberizin.id, saya ingin bertanya mengenai layanan perizinan.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm text-[#25D366] hover:brightness-110 transition"
                >
                    <MessageCircle className="w-4 h-4" />
                    Chat via WhatsApp
                </a>
            </div>

            <div>
                <h4 className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Layanan</h4>
                <ul className="mt-5 space-y-3">
                    {SERVICES.map((s) => (
                        <li key={s.id}>
                            <button
                                data-testid={`footer-service-${s.id}`}
                                onClick={() => scrollToId("#layanan")}
                                className="text-sm text-slate-400 hover:text-gold transition-colors text-left"
                            >
                                {s.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Navigasi</h4>
                <ul className="mt-5 space-y-3">
                    {NAV_LINKS.map((l) => (
                        <li key={l.href}>
                            <button
                                data-testid={`footer-${l.testid}`}
                                onClick={() => scrollToId(l.href)}
                                className="text-sm text-slate-400 hover:text-gold transition-colors"
                            >
                                {l.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Kontak</h4>
                <ul className="mt-5 space-y-4 text-sm text-slate-400">
                    <li className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <span data-testid="footer-address">{CONTACT.address}</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        {CONTACT.hours}
                    </li>
                    <li className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <a data-testid="footer-email" href={`mailto:${CONTACT.email}`} className="hover:text-gold transition-colors">
                            {CONTACT.email}
                        </a>
                    </li>
                    <li className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        {CONTACT.phone}
                    </li>
                </ul>
            </div>
        </div>

        <div className="border-t border-[#1A202C]">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-600">
                    © 2026 Legalberizin.id — Seluruh hak cipta dilindungi.
                </p>
                <p className="text-[11px] text-slate-700 max-w-md text-center sm:text-right">
                    Konten situs ini bersifat informatif dan bukan merupakan nasihat hukum resmi.
                </p>
            </div>
        </div>
    </footer>
);
