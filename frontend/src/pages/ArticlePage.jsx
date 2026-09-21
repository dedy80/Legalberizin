import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock, BookOpen, Loader2 } from "lucide-react";
import { waLink } from "@/data/content";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ArticlePage() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [others, setOthers] = useState([]);
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        setStatus("loading");
        setArticle(null);
        axios.get(`${API}/articles/${slug}`)
            .then((r) => {
                setArticle(r.data);
                setStatus("ok");
            })
            .catch(() => setStatus("notfound"));
        axios.get(`${API}/articles`)
            .then((r) => setOthers(r.data.filter((a) => a.slug !== slug).slice(0, 2)))
            .catch(() => {});
    }, [slug]);

    useEffect(() => {
        if (article) {
            document.title = `${article.title} — Legalberizin.id`;
            let meta = document.querySelector('meta[name="description"]');
            if (meta) meta.setAttribute("content", article.excerpt);
        }
        return () => {
            document.title = "Legalberizin.id — Konsultan Perizinan & Legalitas Usaha";
        };
    }, [article]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center" data-testid="article-loading">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
        );
    }

    if (status === "notfound") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center" data-testid="article-notfound">
                <h1 className="font-display text-4xl font-semibold text-slate-50">Artikel tidak ditemukan</h1>
                <Link to="/" data-testid="article-back-home" className="inline-flex items-center gap-2 text-gold hover:text-gold-light text-sm font-semibold">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
                </Link>
            </div>
        );
    }

    return (
        <article className="relative" data-testid="article-page">
            <div className="gold-glow absolute inset-x-0 top-0 h-[60vh] pointer-events-none" />
            <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-36 sm:pt-44 pb-24 relative">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Link
                        to="/"
                        data-testid="article-back-link"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 hover:text-gold transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Semua artikel
                    </Link>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold border border-gold/40 rounded-full px-3.5 py-1.5 font-semibold">
                            <BookOpen className="w-3 h-3" />
                            {article.category}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock className="w-3.5 h-3.5" /> {article.read_time}
                        </span>
                        <span className="text-xs text-slate-600">
                            {new Date(article.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                    </div>

                    <h1 data-testid="article-title" className="mt-6 font-display text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.15] text-slate-50">
                        {article.title}
                    </h1>
                    <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed font-light border-l-2 border-gold/50 pl-5">
                        {article.excerpt}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.25 }}
                    className="mt-14 space-y-12"
                    data-testid="article-body"
                >
                    {article.sections.map((s, i) => (
                        <section key={i}>
                            {s.heading && (
                                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-100 leading-snug">
                                    {s.heading}
                                </h2>
                            )}
                            {s.paragraphs?.map((p, j) => (
                                <p key={j} className="mt-4 text-sm sm:text-base text-slate-400 leading-[1.9] font-light">
                                    {p}
                                </p>
                            ))}
                            {s.list && (
                                <ul className="mt-5 space-y-3">
                                    {s.list.map((item, j) => (
                                        <li key={j} className="flex items-start gap-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-16 card-lux rounded-3xl p-8 sm:p-10 text-center"
                    data-testid="article-cta"
                >
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-50">
                        Butuh izinnya diuruskan sampai terbit?
                    </h3>
                    <p className="mt-3 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                        Konsultasikan kebutuhan perizinan Anda secara gratis — tim kami memetakan
                        dokumen, biaya, dan estimasi waktu sejak percakapan pertama.
                    </p>
                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                        <Link
                            to="/"
                            state={{ scrollTo: "#konsultasi" }}
                            data-testid="article-cta-form"
                            className="group inline-flex items-center gap-2 bg-gold text-obsidian font-semibold px-6 py-3 rounded-full hover:bg-gold-light transition-colors text-sm"
                        >
                            Konsultasi Gratis
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <a
                            data-testid="article-cta-whatsapp"
                            href={waLink(`Halo Legalberizin.id, saya baru membaca artikel "${article.title}" dan ingin konsultasi.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 border border-[#262D3D] text-slate-200 px-6 py-3 rounded-full hover:border-gold/60 hover:text-gold transition-colors text-sm"
                        >
                            Chat WhatsApp
                        </a>
                    </div>
                </motion.div>

                {others.length > 0 && (
                    <div className="mt-16" data-testid="article-related">
                        <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold font-mono2 mb-6">
                            Artikel lainnya
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {others.map((o) => (
                                <Link
                                    key={o.slug}
                                    to={`/artikel/${o.slug}`}
                                    data-testid={`article-related-${o.slug}`}
                                    className="card-lux rounded-2xl p-6 group block"
                                >
                                    <span className="text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">{o.category}</span>
                                    <h4 className="mt-2 font-display text-lg font-semibold text-slate-100 leading-snug group-hover:text-gold-light transition-colors">
                                        {o.title}
                                    </h4>
                                    <span className="mt-3 inline-flex items-center gap-1 text-xs text-slate-500 group-hover:text-gold transition-colors">
                                        Baca <ArrowUpRight className="w-3 h-3" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
