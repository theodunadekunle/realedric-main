const menu = document.querySelector(".portfolio-menu");
const showcase = document.querySelector("#showcase-photos");
if (showcase?.content.childElementCount) {
  const photos = Array.from(showcase.content.children);
  const slots = document.querySelectorAll("#gallery a.photo");
  slots.forEach((slot, index) => {
    const pick = index + Math.floor(Math.random() * (photos.length - index));
    [photos[index], photos[pick]] = [photos[pick], photos[index]];
    const photo = photos[index].cloneNode(true);
    photo.className = slot.className;
    slot.replaceWith(photo);
  });
}

document.addEventListener("click", event => {
  if (!menu.contains(event.target)) menu.open = false;
});
menu.addEventListener("keydown", event => {
  if (event.key === "Escape" && menu.open) {
    event.preventDefault();
    menu.open = false;
    menu.querySelector("summary").focus();
  }
});

const header = document.querySelector(".site-header");
const nav = document.querySelector("#main-navigation");
const navToggle = document.querySelector(".nav-toggle");
const compactNav = matchMedia("(max-width: 700px)");

function setNavigation(open) {
  navToggle.setAttribute("aria-expanded", String(open));
  if (!open) menu.open = false;
}

navToggle.addEventListener("click", () => {
  setNavigation(navToggle.getAttribute("aria-expanded") === "false");
});
nav.addEventListener("click", event => {
  if (!event.target.closest("a")) return;
  if (compactNav.matches) setNavigation(false);
  else menu.open = false;
});
document.addEventListener("click", event => {
  if (!header.contains(event.target)) setNavigation(false);
});
header.addEventListener("keydown", event => {
  if (event.key !== "Escape" || event.defaultPrevented) return;
  if (navToggle.getAttribute("aria-expanded") === "true") {
    setNavigation(false);
    navToggle.focus();
  }
});
compactNav.addEventListener("change", () => setNavigation(false));

if (document.querySelector(".testimonials")) {
  const cards = document.querySelector(".cards");
  const controls = document.querySelector(".carousel-controls");
  const indicators = controls.querySelector(".indicators");
  function testimonialStep() {
    return cards.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(cards).columnGap);
  }
  function updateTestimonials() {
    const max = cards.scrollWidth - cards.clientWidth;
    const step = testimonialStep();
    const count = max > 1 ? 1 + Math.ceil((max - 1) / step) : 0;
    controls.hidden = count === 0;
    if (indicators.childElementCount !== count) {
      indicators.replaceChildren(...Array.from({ length: count }, () => document.createElement("i")));
    }
    const position = cards.scrollLeft;
    const last = count - 1;
    const lastMidpoint = ((last - 1) * step + max) / 2;
    const active = count > 1 && position >= lastMidpoint ? last : Math.round(position / step);
    Array.from(indicators.children).forEach((dot, index) => dot.classList.toggle("active", index === active));
  }
  function moveTestimonials(direction) {
    cards.scrollBy({
      left: direction * testimonialStep(),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }
  document.querySelector(".carousel-controls .previous").addEventListener("click", () => moveTestimonials(-1));
  document.querySelector(".carousel-controls .next").addEventListener("click", () => moveTestimonials(1));
  cards.addEventListener("scroll", updateTestimonials);
  window.addEventListener("resize", updateTestimonials);
  updateTestimonials();
}

// Vercel serves this script on deployed pages.
if (location.protocol === "https:" && !["localhost", "127.0.0.1", "[::1]"].includes(location.hostname)) {
  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };
  const analyticsScript = document.createElement("script");
  analyticsScript.src = "/_vercel/insights/script.js";
  analyticsScript.async = true;
  document.head.append(analyticsScript);
}
