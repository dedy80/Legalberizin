import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WA_DEFAULT, scrollToId } from "@/lib/contact";

const LINKS = [
  { label: "Layanan", href: "#layanan" },
  { label: "Keunggulan", href: "#keunggulan" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontak", href: "#kontak" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const goTo = (href) => {
    if (location.pathname === "/") {
      scrollToId(href);
    } else {
      navigate("/" + href);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      data-testid="main-header-nav"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? "glass border-b border-sky-200" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <button
          data-testid="nav-logo"
          onClick={() => (location.pathname === "/" ? window.__lenis?.scrollTo(0, { duration: 1.4 }) : navigate("/"))}
          className="flex items-center gap-2.5 group"
        >
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center font-extrabold text-white text-lg glow-cyan group-hover:scale-105 transition-transform duration-300">
            L
          </span>
          <span className="font-extrabold tracking-tight text-lg">
            LEGAL<span className="text-gradient">BERIZIN</span>
            <span className="text-sky-600">.id</span>
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => (
            <button
              key={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              onClick={() => goTo(l.href)}
              className="text-sm text-slate-600 hover:text-sky-600 transition-colors duration-300"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <a
          data-testid="nav-whatsapp-button"
          href={WA_DEFAULT}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:shadow-[0_0_30px_-5px_rgba(2,132,199,0.5)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <MessageCircle className="w-4 h-4" />
          Konsultasi Gratis
        </a>
      </div>
    </motion.header>
  );
}
