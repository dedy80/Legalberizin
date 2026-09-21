import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { waLink } from "@/data/content";

const PROMPTS = [
    "Halo Legalberizin.id, saya ingin mendirikan PT / badan usaha baru.",
    "Halo Legalberizin.id, saya butuh bantuan izin BPOM / alkes impor.",
    "Halo Legalberizin.id, saya ingin konsultasi kebutuhan perizinan usaha saya.",
];

export const FloatingWhatsApp = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-3">
            <AnimatePresence>
                {open && (
                    <motion.div
                        data-testid="whatsapp-quick-modal"
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="card-lux rounded-2xl p-5 w-72 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-slate-100">Mulai percakapan</p>
                            <button
                                data-testid="whatsapp-modal-close"
                                onClick={() => setOpen(false)}
                                className="text-slate-500 hover:text-slate-200"
                                aria-label="Tutup"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {PROMPTS.map((p, i) => (
                                <a
                                    key={i}
                                    data-testid={`whatsapp-prompt-${i + 1}`}
                                    href={waLink(p)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-xs text-slate-300 border border-[#262D3D] rounded-xl px-3.5 py-3 hover:border-[#25D366]/60 hover:text-[#25D366] transition-colors leading-relaxed"
                                >
                                    {p}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                data-testid="whatsapp-floating-btn"
                onClick={() => setOpen(!open)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.6, type: "spring", stiffness: 200, damping: 16 }}
                className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-105 transition-transform"
                aria-label="Chat WhatsApp"
            >
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold border-2 border-obsidian">
                    <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-60" />
                </span>
                <MessageCircle className="w-6 h-6 text-obsidian" />
            </motion.button>
        </div>
    );
};
