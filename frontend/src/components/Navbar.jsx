import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Scale, Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, scrollToId } from "@/data/content";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const go = (href) => {
        setOpen(false);
        scrollToId(href);
    };

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
                scrolled
                    ? "bg-[#0B0D12]/85 backdrop-blur-xl border-b border-[#262D3D]"
                    : "bg-transparent border-b border-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between">
                <button
                    data-testid="header-logo"
                    onClick={() => window.__lenis?.scrollTo(0, { duration: 1.4 })}
                    className="flex items-center gap-3 group"
                >
                    <span className="w-9 h-9 rounded-full border border-gold/50 flex items-center justify-center bg-gold/10 group-hover:bg-gold/20 transition-colors">
                        <Scale className="w-4 h-4 text-gold" />
                    </span>
                    <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-slate-50">
                        Legalberizin<span className="text-gold">.id</span>
                    </span>
                </button>

                <nav className="hidden lg:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <button
                            key={link.href}
                            data-testid={link.testid}
                            onClick={() => go(link.href)}
                            className="text-sm text-slate-400 hover:text-gold transition-colors tracking-wide"
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <span className="hidden md:inline-flex items-center gap-2 text-[11px] font-mono2 tracking-wider text-slate-400 border border-[#262D3D] rounded-full px-3 py-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Konsultan Online
                    </span>
                    <button
                        data-testid="nav-consultation-btn"
                        onClick={() => go("#konsultasi")}
                        className="hidden sm:inline-flex items-center gap-1.5 bg-gold text-obsidian text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gold-light transition-colors"
                    >
                        Konsultasi Gratis
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                        data-testid="nav-mobile-menu-btn"
                        onClick={() => setOpen(!open)}
                        className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-200"
                        aria-label="Menu"
                    >
                        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:hidden overflow-hidden bg-[#0B0D12]/95 backdrop-blur-xl border-b border-[#262D3D]"
                    >
                        <div className="px-6 py-6 flex flex-col gap-5">
                            {NAV_LINKS.map((link) => (
                                <button
                                    key={link.href}
                                    data-testid={`${link.testid}-mobile`}
                                    onClick={() => go(link.href)}
                                    className="text-left font-display text-2xl text-slate-200 hover:text-gold transition-colors"
                                >
                                    {link.label}
                                </button>
                            ))}
                            <button
                                data-testid="nav-consultation-btn-mobile"
                                onClick={() => go("#konsultasi")}
                                className="mt-2 inline-flex items-center justify-center gap-2 bg-gold text-obsidian font-semibold px-5 py-3 rounded-full"
                            >
                                Konsultasi Gratis
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
};
