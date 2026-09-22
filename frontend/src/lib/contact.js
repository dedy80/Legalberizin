export const BRAND = "Legalberizin.id";
export const WA_NUMBER = "6285171114889";
export const WA_DISPLAY = "0851-7111-4889";
export const EMAIL = "hredu.pusat@gmail.com";
export const LOCATION = "Jakarta Utara, Indonesia";

export const waLink = (text) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const WA_DEFAULT = waLink(
  "Halo Legalberizin.id, saya ingin konsultasi gratis mengenai legalitas & perizinan usaha."
);

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const scrollToId = (id) => {
  const el = document.querySelector(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -72, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
};
