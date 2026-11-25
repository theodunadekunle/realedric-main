const showcase = document.querySelector("#showcase-photos");
if (showcase?.content.childElementCount) {
  for (const group of ["portraits", "events"]) {
    const selector = `a[data-showcase-group="${group}"]`;
    const photos = Array.from(showcase.content.querySelectorAll(selector));
    const slots = document.querySelectorAll(`#gallery ${selector}`);
    for (let index = 0; index < slots.length; index++) {
      const pick = index + Math.floor(Math.random() * (photos.length - index));
      [photos[index], photos[pick]] = [photos[pick], photos[index]];
    }
    const selection = photos.slice(0, slots.length);
    if (group === "portraits" && selection.length > 1 && selection.every(photo => photo.href === selection[0].href)) {
      const alternatives = photos.filter(photo => photo.href !== selection[0].href);
      if (alternatives.length) {
        selection[Math.floor(Math.random() * selection.length)] = alternatives[Math.floor(Math.random() * alternatives.length)];
      }
    }
    slots.forEach((slot, index) => {
      const photo = selection[index].cloneNode(true);
      photo.className = slot.className;
      slot.replaceWith(photo);
    });
  }
}

const header = document.querySelector(".site-header");
const nav = document.querySelector("#main-navigation");
const navToggle = document.querySelector(".nav-toggle");
const compactNav = matchMedia("(max-width: 700px)");

function setNavigation(open) {
  navToggle.setAttribute("aria-expanded", String(open));
}

navToggle.addEventListener("click", () => {
  setNavigation(navToggle.getAttribute("aria-expanded") === "false");
});
nav.addEventListener("click", event => {
  if (!event.target.closest("a")) return;
  if (compactNav.matches) setNavigation(false);
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

const revealMotion = matchMedia("(prefers-reduced-motion: reduce)");
if (!revealMotion.matches && "IntersectionObserver" in window && "animate" in Element.prototype) {
  const reveals = document.querySelectorAll([
    "h1, h2, h3, p:not(.faq-answer p), blockquote, summary, label, figcaption",
    ".nav-button, .pill, .footer-links a, .footer-links li:not(:has(a)), .footer-socials a",
    "img:not(.hero-slide img), video, .hero-slides",
  ].join(", "));
  const running = new Set();
  const observer = new IntersectionObserver(entries => {
    let stagger = 0;
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target);
      if (revealMotion.matches || target.matches(":focus-within")) continue;
      const isMedia = target.matches("img, video, .hero-slides");
      const animation = target.animate(
        [{ opacity: 0, translate: isMedia ? "none" : "0 10px" }, {}],
        { duration: isMedia ? 720 : 560, delay: Math.min(stagger++ * 36, 180),
          easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" },
      );
      running.add(animation);
      animation.finished.then(() => running.delete(animation), () => running.delete(animation));
      target.addEventListener("focusin", () => animation.finish(), { once: true });
    }
  });
  reveals.forEach(element => observer.observe(element));
  revealMotion.addEventListener("change", ({ matches }) => {
    if (matches) running.forEach(animation => animation.cancel());
  });
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
