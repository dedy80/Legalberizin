import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { API } from "@/lib/contact";
import { BlogCard } from "@/components/BlogSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Blog & Artikel Legalitas Bisnis | Legalberizin.id";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", "Artikel dan tips seputar legalitas usaha, perizinan BPOM, alkes impor, virtual office, dan pendirian badan usaha dari Legalberizin.id.");
    window.__lenis?.scrollTo(0, { immediate: true });
    axios.get(`${API}/blog`).then((r) => setPosts(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main data-testid="blog-list-page" className="pt-32 lg:pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-mono-alt text-xs uppercase tracking-[0.3em] text-sky-600 mb-6">
            Blog & Artikel
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl">
            Wawasan Legalitas untuk <span className="text-gradient">Bisnis yang Bertumbuh.</span>
          </motion.h1>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p, i) => (
              <BlogCard key={p.slug} post={p} i={i} onOpen={(slug) => navigate(`/blog/${slug}`)} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
