export const WHATSAPP_NUMBER = "6281234567890";

export const waLink = (msg) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

export const scrollToId = (id) => {
    const el = document.querySelector(id);
    if (!el) return;
    if (window.__lenis) {
        window.__lenis.scrollTo(el, { offset: -72, duration: 1.4 });
    } else {
        el.scrollIntoView({ behavior: "smooth" });
    }
};

export const NAV_LINKS = [
    { label: "Layanan", href: "#layanan", testid: "nav-layanan-link" },
    { label: "Manifesto", href: "#manifesto", testid: "nav-manifesto-link" },
    { label: "Estimasi", href: "#estimasi", testid: "nav-estimasi-link" },
    { label: "Testimoni", href: "#testimoni", testid: "nav-testimoni-link" },
    { label: "Kontak", href: "#kontak", testid: "nav-kontak-link" },
];

export const MARQUEE_ITEMS = [
    "PENDIRIAN PT & PT PMA",
    "VIRTUAL OFFICE JAKARTA",
    "SERTIFIKAT STANDAR KBLI 46441",
    "IZIN BPOM KOSMETIK IMPOR",
    "NOTIFIKASI IZIN EDAR",
    "IZIN ALKES IMPOR",
    "CV & YAYASAN",
    "LAYANAN DIGITAL LEGAL",
];

export const SERVICES = [
    {
        id: "badan-usaha",
        number: "01",
        icon: "Building2",
        title: "Badan Usaha",
        subtitle: "PT, PT PMDN/PMA, PT Perorangan, CV & Yayasan",
        description:
            "Pendirian badan usaha lengkap: akta notaris, SK Kemenkumham, NIB melalui OSS RBA, hingga NPWP badan. Satu paket, tanpa bolak-balik.",
        scopes: ["PT & PT Perorangan", "PT PMDN / PMA", "CV & Firma", "Yayasan & Perkumpulan"],
        duration: "3–7 hari kerja",
        docs: ["KTP & KK para pendiri", "3 opsi nama badan usaha", "Struktur modal & kepemilikan saham", "Alamat domisili usaha"],
    },
    {
        id: "virtual-office",
        number: "02",
        icon: "MapPin",
        title: "Virtual Office",
        subtitle: "Domisili komersial zona Jakarta",
        description:
            "Alamat bisnis prestisius di zona komersial Jakarta — sah untuk domisili PT/CV, lengkap dengan surat domisili, resepsionis, dan ruang meeting.",
        scopes: ["Zonasi komersial resmi", "Surat domisili & PKP-ready", "Layanan resepsionis", "Ruang meeting sesuai kebutuhan"],
        duration: "1–3 hari kerja",
        docs: ["Akta / NIB perusahaan (bila sudah ada)", "KTP direksi", "Nama badan usaha"],
    },
    {
        id: "kbli-46441",
        number: "03",
        icon: "Stamp",
        title: "Sertifikat Standar KBLI 46441",
        subtitle: "Perdagangan besar farmasi & kosmetik",
        description:
            "Penerbitan sertifikat standar terverifikasi untuk KBLI 46441 melalui OSS RBA — syarat utama perdagangan besar bahan obat, farmasi, dan kosmetik.",
        scopes: ["Pendaftaran OSS RBA", "Verifikasi sertifikat standar", "Pemenuhan komitmen", "Pendampingan hingga terbit"],
        duration: "7–14 hari kerja",
        docs: ["NIB & akta perusahaan", "Data penanggung jawab teknis", "Surat sewa/kepemilikan gudang", "Dokumen standar mutu"],
    },
    {
        id: "bpom-import",
        number: "04",
        icon: "FlaskConical",
        title: "Izin BPOM Kosmetik Impor",
        subtitle: "Registrasi importir kosmetik resmi",
        description:
            "Pembukaan akses importir kosmetik ke BPOM: registrasi akun, verifikasi gudang, penyusunan PIF, hingga status importir resmi terbit.",
        scopes: ["Registrasi akun BPOM", "Verifikasi fasilitas gudang", "Penyusunan PIF", "Konsultasi kategori produk"],
        duration: "14–21 hari kerja",
        docs: ["NIB & KBLI terkait kosmetik", "Surat penunjukan dari principal", "Dokumen gudang (sewa/milik)", "KTP penanggung jawab"],
    },
    {
        id: "bpom-notification",
        number: "05",
        icon: "FileBadge",
        title: "Notifikasi Izin Edar Kosmetik Impor",
        subtitle: "Nomor notifikasi (NA) per produk",
        description:
            "Pengurusan nomor notifikasi edar per SKU agar setiap produk kosmetik impor Anda legal dipasarkan di marketplace, ritel, dan klinik.",
        scopes: ["Notifikasi per SKU", "Review formula & klaim label", "Koreksi dokumen cepat", "Monitoring status terbit"],
        duration: "7–14 hari kerja",
        docs: ["Akun notifikasi BPOM aktif", "Formula & spesifikasi produk", "LoA dari principal", "Desain label & kemasan"],
    },
    {
        id: "alkes-import",
        number: "06",
        icon: "Stethoscope",
        title: "Izin Alkes Impor",
        subtitle: "IPAK & izin edar alat kesehatan",
        description:
            "Izin Penyalur Alat Kesehatan (IPAK) dari Kemenkes beserta registrasi izin edar AKL untuk produk alkes impor — dari audit hingga terbit.",
        scopes: ["Penerbitan IPAK", "Registrasi izin edar AKL", "Penyiapan CDAKB", "Pendampingan audit Kemenkes"],
        duration: "21–45 hari kerja",
        docs: ["NIB & akta perusahaan", "Tenaga teknis (ATK/TTG)", "Sertifikat ISO/CE produk", "LoA dari prinsipal luar negeri"],
    },
    {
        id: "layanan-digital",
        number: "07",
        icon: "MonitorSmartphone",
        title: "Layanan Digital",
        subtitle: "OSS RBA, merek HAKI & digitalisasi legal",
        description:
            "Dukungan digital menyeluruh: pendampingan akun OSS RBA, pendaftaran merek HAKI, e-faktur, dan digitalisasi dokumen legal perusahaan Anda.",
        scopes: ["Pendampingan OSS RBA", "Pendaftaran merek HAKI", "Perubahan akta & data NIB", "Konsultasi compliance berkala"],
        duration: "Fleksibel",
        docs: ["Akses akun OSS perusahaan", "Dokumen legal eksisting", "Data perubahan (bila ada)"],
    },
];

export const MANIFESTO = [
    {
        number: "01",
        title: "Kepastian hukum, tanpa birokrasi berbelit",
        body: "Setiap berkas kami petakan sejak hari pertama. Setiap risiko regulasi kami antisipasi sebelum sempat menjadi masalah — agar Anda tidak pernah menebak-nebak status perizinan sendiri.",
    },
    {
        number: "02",
        title: "Transparansi biaya, bebas biaya tersembunyi",
        body: "Satu penawaran tertulis di awal. Tidak ada pungutan liar, tidak ada kejutan di tengah proses. Yang Anda setujui, itulah yang Anda bayar.",
    },
    {
        number: "03",
        title: "Akselerasi sesuai regulasi terkini",
        body: "Kami mengikuti setiap pembaruan OSS RBA, BPOM, dan Kemenkes. Saat aturan berubah, strategi perizinan Anda ikut menyesuaikan — selalu selangkah di depan.",
    },
    {
        number: "04",
        title: "Pendampingan end-to-end sampai tuntas",
        body: "Dari akta pendirian hingga sertifikat standar terbit di tangan, satu tim yang sama mendampingi Anda. Tidak ada estafet yang terputus, tidak ada berkas yang hilang.",
    },
];

export const ESTIMATOR_OPTIONS = [
    {
        id: "pt",
        label: "Pendirian PT / CV",
        headline: "Badan usaha resmi dalam hitungan hari",
        licenses: ["Akta Notaris & SK Kemenkumham", "NIB via OSS RBA", "NPWP Badan", "Sertifikat Standar (sesuai risiko KBLI)"],
        docs: ["KTP & KK pendiri", "3 opsi nama usaha", "Struktur modal", "Alamat domisili"],
        duration: "3–7 hari kerja",
    },
    {
        id: "kosmetik",
        label: "Impor Kosmetik",
        headline: "Jalur lengkap importir kosmetik legal",
        licenses: ["NIB + KBLI kosmetik", "Izin Importir BPOM", "Notifikasi Edar (NA) per SKU", "Sertifikat Standar KBLI terkait"],
        docs: ["Akta & NIB", "LoA dari principal", "Formula & label produk", "Dokumen gudang"],
        duration: "21–35 hari kerja",
    },
    {
        id: "alkes",
        label: "Impor Alat Kesehatan",
        headline: "Distribusi alkes impor yang patuh Kemenkes",
        licenses: ["NIB + KBLI alkes", "IPAK (Izin Penyalur Alkes)", "Izin Edar AKL per produk", "CDAKB bila disyaratkan"],
        docs: ["Akta & NIB", "Tenaga penanggung jawab teknis", "Sertifikat ISO/CE produk", "LoA dari prinsipal"],
        duration: "30–45 hari kerja",
    },
    {
        id: "kbli",
        label: "Perdagangan Besar Farmasi (KBLI 46441)",
        headline: "Sertifikat standar terverifikasi OSS RBA",
        licenses: ["NIB KBLI 46441", "Sertifikat Standar Terverifikasi", "Pemenuhan komitmen gudang & PJT", "CDOB bila mendistribusikan obat"],
        docs: ["Akta & NIB", "Data penanggung jawab teknis", "Dokumen gudang", "SOP standar mutu"],
        duration: "14–30 hari kerja",
    },
];

export const TESTIMONIALS = [
    {
        quote: "Pendirian PT dan notifikasi BPOM untuk lima SKU skincare kami beres tanpa saya pernah ke kantor mereka sekali pun. Semua progres dilaporkan rapi per minggu.",
        name: "Andini Prasetyo",
        role: "Founder Brand Skincare, Jakarta",
    },
    {
        quote: "Sebagai importir alkes, audit CDAKB adalah momok kami. Tim Legalberizin menyiapkan seluruh dokumen sampai IPAK dan izin edar AKL kami terbit sesuai jadwal.",
        name: "Rangga Wijaya",
        role: "Direktur Distributor Alkes, Tangerang",
    },
    {
        quote: "Dari virtual office, pendirian CV, sampai sertifikat standar KBLI 46441 — semua dikerjakan satu tim. Biayanya persis seperti penawaran awal, tanpa tambahan sepeser pun.",
        name: "Sinta Maharani",
        role: "Owner Perusahaan Distribusi Farmasi, Bekasi",
    },
];

export const CONTACT = {
    address: "District 8, SCBD Lot 28, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan 12190",
    hours: "Senin–Jumat, 08.30–18.00 WIB",
    email: "halo@legalberizin.id",
    phone: "+62 812-3456-7890",
};

export const LEGAL_STATUS_OPTIONS = [
    "Belum memiliki badan usaha",
    "Sudah punya badan usaha, butuh izin tambahan",
    "Proses perizinan sedang berjalan / terkendala",
    "Butuh konsultasi awal dulu",
];

export const TIMELINE_OPTIONS = [
    "Segera (< 2 minggu)",
    "Dalam 1 bulan ke depan",
    "1–3 bulan ke depan",
    "Masih fleksibel",
];
