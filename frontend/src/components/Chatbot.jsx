import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, Send, X } from "lucide-react";
import { API } from "@/lib/contact";

const GREETING = {
  role: "assistant",
  content: "Halo! Saya LegalAI, asisten virtual Legalberizin.id. Ada yang bisa saya bantu seputar pendirian PT/CV, virtual office, izin BPOM, atau perizinan alkes (IDAK/CDAKB/AKL)?",
};

export default function Chatbot() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef(null);
  const sessionRef = useRef(null);

  if (!sessionRef.current) {
    sessionRef.current = localStorage.getItem("legalai_session") || (() => {
      const id = crypto.randomUUID();
      localStorage.setItem("legalai_session", id);
      return id;
    })();
  }

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "user", content: text }, { role: "assistant", content: "" }]);
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionRef.current, message: text }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop();
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
          try {
            const { delta } = JSON.parse(line.slice(6));
            if (delta) {
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + delta };
                return copy;
              });
            }
          } catch { /* partial chunk */ }
        }
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "Maaf, koneksi terputus. Silakan coba lagi atau hubungi WhatsApp 0851-7111-4889." };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  };

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <div data-testid="ai-legal-chatbot" className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-[calc(100vw-40px)] sm:w-[380px] h-[520px] max-h-[70vh] glass rounded-2xl overflow-hidden flex flex-col glow-cyan"
            data-testid="chatbot-panel"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-sky-200 bg-white/80">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </span>
                <div>
                  <p className="font-bold text-sm">LegalAI Assistant</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <button data-testid="chatbot-close-button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4" data-testid="chatbot-messages">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-br-sm"
                        : "bg-sky-50 text-slate-700 rounded-bl-sm"
                    }`}
                  >
                    {m.content || (busy && i === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin text-sky-600" /> : "")}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-sky-200 bg-white/80 flex items-center gap-2">
              <input
                data-testid="chatbot-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Tanya seputar legalitas & izin..."
                className="flex-1 bg-white border border-sky-200 rounded-full px-4 py-2.5 text-sm text-[#0C2D48] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
              />
              <button
                data-testid="chatbot-send-button"
                onClick={send}
                disabled={busy || !input.trim()}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white disabled:opacity-50 hover:scale-105 transition-transform"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        data-testid="chatbot-toggle-button"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white glow-cyan"
        aria-label="Buka LegalAI Assistant"
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
      </motion.button>
    </div>
  );
}
