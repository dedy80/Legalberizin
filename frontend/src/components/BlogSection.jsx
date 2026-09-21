import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, BookOpen } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const BlogSection = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        axios.get(`${API}/articles`).then((r) => setArticles(r.data)).catch(() => {});
    }, []);

    if (!articles.length) return null;

    return (
        <section id="artikel" className="relative py-24 sm:py-32 bg-[#0E1118] border-y border-[#262D3D]" data-testid="blog-section">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <SectionHeading
                        eyebrow="Edukasi Perizinan"
                        title="Pahami aturannya sebelum memulai"
                        description="Panduan praktis seputar izin BPOM, pendirian PT, dan kepatuhan usaha — ditulis oleh tim yang mengurusnya setiap hari."
                    />
                    <Reveal delay={0.25}>
                        <p className="font-mono2 text-xs text-slate-500 uppercase tracking-[0.3em] lg:text-right">
                            ( {String(articles.length).padStart(2, "0")} artikel )
                        </p>
                    </Reveal>
                </div>

                <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {articles.map((a, i) => (
                        <Reveal key={a.slug} delay={(i % 2) * 0.12}>
                            <Link
                                to={`/artikel/${a.slug}`}
                                data-testid={`article-card-${a.slug}`}
                                className="card-lux rounded-3xl p-8 sm:p-10 h-full flex flex-col group block"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold border border-gold/40 rounded-full px-3.5 py-1.5 font-semibold">
                                        <BookOpen className="w-3 h-3" />
                                        {a.category}
                                    </span>
                                    <span className="text-xs text-slate-600">
                                        {new Date(a.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                    </span>
                                </div>
                                <h3 className="mt-6 font-display text-2xl sm:text-3xl font-semibold text-slate-50 leading-snug group-hover:text-gold-light transition-colors">
                                    {a.title}
                                </h3>
                                <p className="mt-4 text-sm text-slate-400 leading-relaxed font-light flex-1">
                                    {a.excerpt}
                                </p>
                                <div className="mt-7 pt-5 border-t border-[#262D3D] flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                                        <Clock className="w-3.5 h-3.5 text-gold" />
                                        {a.read_time}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold uppercase tracking-wider">
                                        Baca artikel
                                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </span>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};
