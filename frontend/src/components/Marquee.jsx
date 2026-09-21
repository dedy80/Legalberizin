import { Sparkle } from "lucide-react";
import { MARQUEE_ITEMS } from "@/data/content";

export const Marquee = () => {
    const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
    return (
        <div
            data-testid="editorial-marquee"
            className="relative border-y border-[#262D3D] bg-[#0E1118] py-5 overflow-hidden"
        >
            <div className="marquee-track flex whitespace-nowrap w-max">
                {items.map((item, i) => (
                    <span
                        key={i}
                        className="flex items-center gap-6 px-6 font-display text-xl sm:text-2xl text-slate-500 italic"
                    >
                        {item}
                        <Sparkle className="w-4 h-4 text-gold/60 shrink-0" />
                    </span>
                ))}
            </div>
        </div>
    );
};
