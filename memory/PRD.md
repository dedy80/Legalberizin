# PRD — Legalberizin.id

## Problem Statement (asli)
"butakan saya website untuk nama branding Legalberizin.id..usaha ini bergerak di bidang 1. Badan Usaha.PT,PT PMD/PMA Perorangan,CV,Yayasan 2.Virtual Office 3.Sertifikat Standart KBLI 46441 4.Izin BPOM Kosmetik Import 5.Notifikasi izin Edar Kosmetik Import 5.Izin Alkes Import 7.Layanan Digital"

## Pilihan User
- Tujuan: penukaran & informasi (company profile + lead generation)
- Bahasa: Indonesia
- Halaman: umum (satu landing page lengkap)
- Kontak: isi form + chat WhatsApp
- Warna brand: sesuai logo (logo tidak tersedia → palet obsidian gelap + emas metalik, korporat-legal premium)
- Fitur tambahan: beberapa pertanyaan untuk konsultasi (form terpandu)

## Personas
- Founder/CEO yang ingin mendirikan PT/CV/Yayasan dengan cepat
- Importir kosmetik yang butuh izin BPOM & notifikasi edar
- Distributor alkes yang butuh IPAK & izin edar Kemenkes
- Pelaku usaha farmasi yang butuh Sertifikat Standar KBLI 46441

## Arsitektur
- Frontend: React + Tailwind + framer-motion + lenis (smooth scroll) — landing page satu halaman
- Backend: FastAPI, endpoint `/api/consultations` (POST create, GET list)
- Database: MongoDB (koleksi `consultations`) via MONGO_URL

## Yang Sudah Diimplementasikan (21 Sep 2026)
- Hero kinetik: reveal teks baris-per-baris bermask, parallax skyline Jakarta, counter statistik animasi
- Marquee editorial lambat berisi layanan
- Grid bento 7 layanan lengkap (Badan Usaha, Virtual Office, KBLI 46441, BPOM Kosmetik Impor, Notifikasi Edar, Alkes Impor, Layanan Digital) dengan cakupan, estimasi waktu, accordion dokumen, CTA pra-isi ke form
- Manifesto 4 bab bernomor
- Alat "Cek Kebutuhan Izin" interaktif (4 model bisnis → izin wajib, dokumen, estimasi)
- Form konsultasi terpandu dengan pertanyaan (layanan, status legalitas, target waktu, domisili) → tersimpan ke MongoDB → panel sukses + tombol lanjut WhatsApp
- Testimoni 3 klien (DATA CONTOH)
- Tombol WhatsApp melayang dengan modal pesan cepat
- Footer kontak lengkap + disclaimer

## Catatan / Handoff
- NOMOR WHATSAPP MASIH PLACEHOLDER: 6281234567890 di `src/data/content.js` (WHATSAPP_NUMBER) — perlu nomor asli
- Testimoni & statistik hero bersifat contoh — perlu data asli
- Alamat kantor di footer bersifat contoh (SCBD Jakarta)

## Backlog
- P0: Ganti nomor WhatsApp placeholder dengan nomor asli
- P1: Dashboard admin untuk melihat lead konsultasi masuk
- P1: Notifikasi email/WA otomatis saat lead baru masuk
- P2: Blog/artikel edukasi perizinan (SEO)
- P2: Versi bahasa Inggris
- P2: Halaman detail per layanan
