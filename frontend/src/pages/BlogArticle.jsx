import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowLeft, Clock3, MessageCircle, Newspaper } from "lucide-react";
import { API, WA_DEFAULT, categoryGradient, formatDate } from "@/lib/contact";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
    setPost(null);
    setNotFound(false);
    axios
      .get(`${API}/blog/${slug}`)
      .then((r) => {
        setPost(r.data);
        document.title = `${r.data.title} | Legalberizin.id`;
        document.querySelector('meta[name="description"]')?.setAttribute("content", r.data.excerpt);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  return (
    <>
      <Navbar />
      <main data-testid="blog-article-page" className="pt-32 lg:pt-40 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            data-testid="blog-back-button"
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Semua Artikel
          </button>

          {notFound && (
            <div className="mt-16 text-center" data-testid="blog-not-found">
              <h1 className="text-2xl font-bold">Artikel tidak ditemukan</h1>
            </div>
          )}

          {post && (
            <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <div className={`mt-8 h-44 rounded-2xl bg-gradient-to-br ${categoryGradient(post.category)} relative flex items-end p-6`}>
                <Newspaper className="absolute top-6 right-6 w-8 h-8 text-white/50" />
                <span className="font-mono-alt text-[11px] uppercase tracking-[0.25em] text-white/85 bg-white/15 rounded-full px-3 py-1 backdrop-blur">
                  {post.category}
                </span>
              </div>
              <h1 data-testid="blog-article-title" className="mt-8 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                {post.title}
              </h1>
              <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                {formatDate(post.published_at)} · <Clock3 className="w-3.5 h-3.5" /> {post.read_time}
              </p>
              <div className="prose-blog mt-8 text-base" dangerouslySetInnerHTML={{ __html: post.content }} />
              <div className="mt-14 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 p-8 text-center text-white" data-testid="blog-cta">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Butuh Bantuan Mengurus Izin Anda?</h2>
                <p className="mt-2 text-sky-100 text-sm">Konsultasi awal gratis — tim Legalberizin.id siap membantu.</p>
                <a
                  data-testid="blog-whatsapp-cta"
                  href={WA_DEFAULT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-bold text-blue-700 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4" /> Chat WhatsApp Sekarang
                </a>
              </div>
            </motion.article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
