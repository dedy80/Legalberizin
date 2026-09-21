import { useEffect, useState } from "react";
import Lenis from "lenis";
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
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

function App() {
    const [presetService, setPresetService] = useState(null);

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
            <Navbar />
            <main>
                <Hero />
                <Marquee />
                <Services onSelect={setPresetService} />
                <Manifesto />
                <Estimator />
                <ConsultationForm presetService={presetService} />
                <Testimonials />
            </main>
            <Footer />
            <FloatingWhatsApp />
            <Toaster position="top-center" richColors theme="dark" />
        </div>
    );
}

export default App;
