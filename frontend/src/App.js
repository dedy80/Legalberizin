import { useEffect } from "react";
import Lenis from "lenis";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "@/App.css";
import Landing from "@/pages/Landing";
import ServiceDetail from "@/pages/ServiceDetail";
import BlogList from "@/pages/BlogList";
import BlogArticle from "@/pages/BlogArticle";
import Chatbot from "@/components/Chatbot";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
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
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="noise bg-[#F4F8FB] text-[#0C2D48] min-h-screen antialiased overflow-x-clip" data-testid="app-root">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/layanan/:slug" element={<ServiceDetail />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
        </Routes>
        <Chatbot />
        <Toaster theme="light" position="top-center" richColors />
      </div>
    </BrowserRouter>
  );
}
