import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import { scrollToId } from "@/lib/contact";

export default function Landing() {
  useEffect(() => {
    document.title = "Legalberizin.id — Jasa Legalitas & Perizinan Usaha";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Legalberizin.id — Konsultan legalitas & perizinan usaha di Jakarta Utara. Pendirian PT/CV/Yayasan, Virtual Office, Izin BPOM Kosmetik Impor, Izin Alkes Impor, dan Layanan Digital."
      );
    if (window.location.hash) {
      const t = setTimeout(() => scrollToId(window.location.hash), 500);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <WhyUs />
        <Testimonials />
        <Faq />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
