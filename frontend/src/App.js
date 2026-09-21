import { useEffect, useState } from "react";
import Lenis from "lenis";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Services } from "@/components/Services";
import { Manifesto } from "@/components/Manifesto";
import { Estimator } from "@/components/Estimator";
import { ConsultationForm } from "@/components/ConsultationForm";
import { Testimonials } from "@/components/Testimonials";
import { BlogSection } from "@/components/BlogSection";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import ArticlePage from "@/pages/ArticlePage";
import { scrollToId } from "@/data/content";

const ScrollManager = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.__lenis?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const Landing = () => {
    const [presetService, setPresetService] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const target = location.state?.scrollTo;
        if (target) {
            const t = setTimeout(() => scrollToId(target), 400);
            return () => clearTimeout(t);
        }
    }, [location.state]);

    return (
        <main>
            <Hero />
            <Marquee />
            <Services onSelect={setPresetService} />
            <Manifesto />
            <Estimator />
            <ConsultationForm presetService={presetService} />
            <Testimonials />
            <BlogSection />
        </main>
    );
};

function App() {
    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
        window.__lenis = lenis;
        let rafId;
        const raf = (time) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            window.__lenis = null;
        };
    }, []);

    return (
        <div className="min-h-screen bg-obsidian text-slate-100 antialiased selection:bg-gold selection:text-obsidian">
            <div className="grain-overlay" />
            <BrowserRouter>
                <ScrollManager />
                <Navbar />
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/artikel/:slug" element={<ArticlePage />} />
                </Routes>
                <Footer />
                <FloatingWhatsApp />
            </BrowserRouter>
            <Toaster position="top-center" richColors theme="dark" />
        </div>
    );
}

export default App;
