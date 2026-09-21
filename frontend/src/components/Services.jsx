import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Building2, MapPin, Stamp, FlaskConical, FileBadge, Stethoscope,
    MonitorSmartphone, Clock, ChevronDown, ArrowUpRight, FileText,
} from "lucide-react";
import { SERVICES, scrollToId } from "@/data/content";
import { Reveal, SectionHeading } from "@/components/Reveal";

const ICONS = { Building2, MapPin, Stamp, FlaskConical, FileBadge, Stethoscope, MonitorSmartphone };

const SPANS = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-3"];

const ServiceCard = ({ service, span, index, onSelect }) => {
    const [expanded, setExpanded] = useState(false);
    const Icon = ICONS[service.icon];

    return (
        <Reveal delay={(index % 3) * 0.1} className={span}>
            <article
                data-testid={`service-card-${service.id}`}
                className="card-lux rounded-3xl p-7 sm:p-9 h-full flex flex-col relative overflow-hidden group"
            >
                <span className="absolute -top-4 right-6 font-display text-[7rem] leading-none text-white/[0.03] select-none pointer-events-none">
                    {service.number}
                </span>
                <div className="flex items-start justify-between">
                    <span className="w-12 h-12 rounded-2xl border border-gold/40 bg-gold/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gold" />
                    </span>
                    <span className="font-mono2 text-xs text-slate-600">{service.number}</span>
                </div>

                <h3 className="mt-6 font-display text-2xl sm:text-3xl font-semibold text-slate-50 leading-tight">
                    {service.title}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
                    {service.subtitle}
                </p>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed font-light flex-1">
                    {service.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                    {service.scopes.map((s) => (
                        <span key={s} className="text-[11px] text-slate-300 border border-[#262D3D] rounded-full px-3 py-1">
                            {s}
                        </span>
                    ))}
                </div>

                <button
                    data-testid={`service-docs-toggle-${service.id}`}
                    onClick={() => setExpanded(!expanded)}
                    className="mt-6 flex items-center justify-between w-full text-left border-t border-[#262D3D] pt-4 text-xs uppercase tracking-wider text-slate-400 hover:text-gold transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" />
                        Dokumen yang dibutuhkan
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                    {expanded && (
                        <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                        >
                            {service.docs.map((d) => (
                                <li key={d} className="flex items-start gap-2 text-sm text-slate-400 mt-3">
                                    <span className="w-1 h-1 rounded-full bg-gold mt-2 shrink-0" />
                                    {d}
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        {service.duration}
                    </span>
                    <button
                        data-testid={`service-inquiry-${service.id}`}
                        onClick={() => onSelect(service.title)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:text-gold-light transition-colors uppercase tracking-wider"
                    >
                        Ajukan layanan ini
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </article>
        </Reveal>
    );
};

export const Services = ({ onSelect }) => {
    const handleSelect = (title) => {
        onSelect(title);
        scrollToId("#konsultasi");
    };

    return (
        <section id="layanan" className="relative py-24 sm:py-32" data-testid="services-section">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <SectionHeading
                        eyebrow="Layanan Kami"
                        title="Tujuh jalur perizinan, satu pintu penyelesaian"
                        description="Setiap layanan dikerjakan tim spesialis dengan estimasi waktu yang jelas dan daftar dokumen yang transparan sejak awal."
                    />
                    <Reveal delay={0.25}>
                        <p className="font-mono2 text-xs text-slate-500 uppercase tracking-[0.3em] lg:text-right">
                            ( 07 layanan unggulan )
                        </p>
                    </Reveal>
                </div>

                <div className="mt-14 grid grid-cols-1 lg:grid-cols-6 gap-5">
                    {SERVICES.map((service, i) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            span={SPANS[i]}
                            index={i}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
