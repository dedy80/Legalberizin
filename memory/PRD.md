# PRD — Legalberizin.id

## Problem Statement (asli)
Buatkan website untuk branding Legalberizin.id — usaha konsultan legalitas & perizinan: (1) Badan Usaha (PT, PT PMDN/PMA, PT Perorangan, CV, Yayasan), (2) Virtual Office, (3) Sertifikat Standar KBLI 46441, (4) Izin BPOM Kosmetik Impor, (5) Notifikasi Izin Edar Kosmetik Impor, (6) Izin Alkes Impor, (7) Layanan Digital. Warna mengikuti logo (biru cyan + grafit gelap). Tujuan: informatif & penjualan. Kontak: WA 085171114889, hredu.pusat@gmail.com, Jakarta Utara. Lead: form konsultasi + WA. AI chatbot: ya.

## User Personas
- Founder/UMKM yang ingin mendirikan badan usaha dengan cepat
- Importir kosmetik/alkes yang butuh izin BPOM/Kemenkes
- Pemilik bisnis yang butuh virtual office legal di Jakarta Utara

## Arsitektur
- Frontend: React + Tailwind + framer-motion + lenis (smooth scroll). Komponen di /app/frontend/src/components/
- Backend: FastAPI (/api prefix) — POST/GET /api/consultations (leads), POST /api/chat (SSE streaming, gpt-5.4-mini via EMERGENT_LLM_KEY)
- DB: MongoDB (collections: consultations, chat_messages)
- Konstanta kontak: /app/frontend/src/lib/contact.js

## Yang Sudah Diimplementasikan (22 Sep 2026)
- Hero kinetik dengan reveal baris-per-baris, parallax background, statistik, dual CTA
- Marquee editorial layanan
- 7 bab layanan gaya manifesto (01–07), masing-masing terhubung ke WA pre-filled
- Section Keunggulan (bento grid + foto), Testimoni (3 kartu, data contoh), FAQ accordion
- Form konsultasi → tersimpan ke MongoDB + toast sukses
- LegalAI chatbot widget: streaming AI, riwayat chat tersimpan di DB
- Footer kontak lengkap; dark theme cyan/grafit sesuai logo; font Plus Jakarta Sans + JetBrains Mono

## Update 22 Sep 2026 (iterasi 2)
- Heading WhyUs diganti: "Solusi Legalitas Satu Pintu. Partner Legal Bisnis Anda." (tanpa kata "biro jasa")
- Gambar WhyUs diganti foto gedung pencakar langit Jakarta
- Notifikasi email otomatis ke hredu.pusat@gmail.com setiap ada lead form masuk (Emergent managed Resend, fire-and-forget via asyncio.create_task, terverifikasi 202 Accepted)
- Testimoni asli: MENUNGGU teks dari user

## Update 22 Sep 2026 (iterasi 3)
- Tema diubah total dari gelap ke TERANG profesional (putih/biru muda #F4F8FB, aksen biru logo, teks navy #0C2D48, footer navy #0C2D48) atas permintaan user
- Background hero foto gedung korporat dengan overlay terang

## Update 22 Sep 2026 (iterasi 4)
- 7 halaman detail SEO per layanan: /layanan/{slug} (react-router), masing-masing dengan meta title/description unik, H1, manfaat, alur proses, persyaratan, FAQ, dan CTA WhatsApp
- Data layanan terpusat di src/data/services.js; kartu layanan di beranda sekarang menuju halaman detail
- Navbar/Footer router-aware (dari halaman detail kembali ke section beranda)
- index.html: meta keywords, OG tags, canonical; public/robots.txt + sitemap.xml (domain legalberizin.id)

## Backlog / Next Tasks
- P0: Notifikasi WhatsApp otomatis via Twilio — MENUNGGU Account SID & Auth Token dari user; Testimoni asli dari user (menunggu konten)
- P1: Alamat kantor lengkap + peta Google Maps; daftarkan sitemap ke Google Search Console setelah domain live
- P2: Blog/artikel legalitas, dashboard admin leads

## Catatan
- Tidak ada sistem login/auth — test_credentials.md tidak diperlukan.
