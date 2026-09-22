const ITEMS = [
  "Pendirian PT & CV",
  "Virtual Office Jakarta Utara",
  "Sertifikat Standar KBLI 46441",
  "Izin BPOM Kosmetik Impor",
  "Notifikasi Izin Edar",
  "IDAK Penyalur Alkes",
  "Sertifikat CDAKB",
  "Izin Edar AKL Impor",
  "Layanan Digital & OSS",
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div data-testid="editorial-marquee" className="relative border-y border-sky-200 bg-[#E9F2F8] py-5 overflow-hidden">
      <div className="marquee-track flex whitespace-nowrap w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {row.map((item, i) => (
              <span key={`${half}-${i}`} className="flex items-center gap-8 pr-8 text-sm sm:text-base font-medium tracking-wide text-slate-600">
                {item}
                <span className="inline-block w-1.5 h-1.5 rotate-45 bg-sky-500" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
