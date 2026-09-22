import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowUpRight, Clock3, Newspaper } from "lucide-react";
import { API, categoryGradient, formatDate } from "@/lib/contact";

export const BlogCard = ({ post, i = 0, onOpen }) => (
  <motion.article
    data-testid={`blog-card-${post.slug}`}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
    onClick={() => onOpen(post.slug)}
    className="group glass rounded-2xl overflow-hidden cursor-pointer hover:border-sky-400 hover:-translate-y-1 transition-all duration-300"
  >
    <div className={`h-40 bg-gradient-to-br ${categoryGradient(post.category)} relative flex items-end p-5`}>
      <Newspaper className="absolute top-5 right-5 w-7 h-7 text-white/50" />
      <span className="font-mono-alt text-[11px] uppercase tracking-[0.25em] text-white/85 bg-white/15 rounded-full px-3 py-1 backdrop-blur">
        {post.category}
      </span>
    </div>
    <div className="p-6">
      <h3 className="font-bold text-base sm:text-lg leading-snug group-hover:text-sky-700 transition-colors duration-300">
        {post.title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">{post.excerpt}</p>
      <div className="mt-5 pt-4 border-t border-sky-200 flex items-center justify-between text-xs text-slate-500">
        <span>{formatDate(post.published_at)}</span>
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="w-3.5 h-3.5" /> {post.read_time}
          <ArrowUpRight className="w-4 h-4 text-sky-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </span>
      </div>
    </div>
  </motion.article>
);

export default function BlogSection() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/blog`).then((r) => setPosts(r.data.slice(0, 3))).catch(() => {});
  }, []);

  if (!posts.length) return null;

  return (
    <section id="blog" data-testid="blog-section" className="py-28 lg:py-36 bg-[#E9F2F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono-alt text-xs uppercase tracking-[0.3em] text-sky-600 mb-6">Blog & Artikel</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Tips Perizinan <span className="text-gradient">& Legalitas.</span>
            </h2>
          </div>
          <button
            data-testid="blog-view-all-button"
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold text-sky-700 hover:border-sky-400 transition-all duration-300"
          >
            Lihat Semua Artikel <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <BlogCard key={p.slug} post={p} i={i} onOpen={(slug) => navigate(`/blog/${slug}`)} />
          ))}
        </div>
      </div>
    </section>
  );
}
