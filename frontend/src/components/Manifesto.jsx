import { Reveal } from "@/components/Reveal";
import { MANIFESTO } from "@/data/content";

export const Manifesto = () => (
    <section id="manifesto" className="relative py-24 sm:py-32 bg-[#0E1118] border-y border-[#262D3D]" data-testid="manifesto-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-28">
                        <Reveal>
                            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold font-mono2">
                                Manifesto Kami
                            </p>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] text-slate-50">
                                Empat janji yang kami pegang
                            </h2>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <p className="mt-5 text-base text-slate-400 leading-relaxed font-light">
                                Perizinan bukan sekadar dokumen. Ia adalah fondasi kepercayaan
                                antara bisnis Anda, negara, dan pelanggan Anda.
                            </p>
                        </Reveal>
                    </div>
                </div>

                <div className="lg:col-span-8 flex flex-col">
                    {MANIFESTO.map((chapter, i) => (
                        <Reveal key={chapter.number} delay={i * 0.08}>
                            <div
                                data-testid={`manifesto-chapter-${i + 1}`}
                                className="group flex gap-6 sm:gap-10 py-10 border-b border-[#262D3D] last:border-b-0"
                            >
                                <span className="font-display text-5xl sm:text-7xl font-semibold text-gold/25 group-hover:text-gold/60 transition-colors duration-500 leading-none shrink-0">
                                    {chapter.number}
                                </span>
                                <div>
                                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-100 leading-snug">
                                        {chapter.title}
                                    </h3>
                                    <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed font-light max-w-xl">
                                        {chapter.body}
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </div>
    </section>
);
