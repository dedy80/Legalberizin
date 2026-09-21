import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/content";
import { Reveal, SectionHeading } from "@/components/Reveal";

export const Testimonials = () => (
    <section id="testimoni" className="relative py-24 sm:py-32" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <SectionHeading
                eyebrow="Kata Mereka"
                title="Dipercaya para pendiri dan importir"
                description="Cerita dari klien yang kini menjalankan bisnisnya dengan legalitas penuh."
                align="center"
            />

            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
                {TESTIMONIALS.map((t, i) => (
                    <Reveal key={t.name} delay={i * 0.12}>
                        <figure
                            data-testid={`testimonial-card-${i + 1}`}
                            className="card-lux rounded-3xl p-8 h-full flex flex-col"
                        >
                            <Quote className="w-7 h-7 text-gold/50" />
                            <blockquote className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed font-light flex-1">
                                “{t.quote}”
                            </blockquote>
                            <figcaption className="mt-7 pt-5 border-t border-[#262D3D]">
                                <p className="font-display text-lg font-semibold text-slate-100">{t.name}</p>
                                <p className="mt-0.5 text-xs text-slate-500">{t.role}</p>
                            </figcaption>
                        </figure>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);
