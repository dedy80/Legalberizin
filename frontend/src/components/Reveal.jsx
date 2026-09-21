import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", y = 40 }) => (
    <motion.div
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
        {children}
    </motion.div>
);

export const SectionHeading = ({ eyebrow, title, description, align = "left" }) => (
    <div className={align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-3xl"}>
        <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold font-mono2">
                {eyebrow}
            </p>
        </Reveal>
        <Reveal delay={0.1}>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] text-slate-50">
                {title}
            </h2>
        </Reveal>
        {description && (
            <Reveal delay={0.2}>
                <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed font-light">
                    {description}
                </p>
            </Reveal>
        )}
    </div>
);
