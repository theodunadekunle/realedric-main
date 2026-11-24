const menu = document.querySelector(".portfolio-menu");
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

if (document.querySelector("#lightbox")) {
  const gallery = document.querySelector("#lightbox");
  const photos = [...document.querySelectorAll(".photo img")];
  const activePhoto = document.querySelector("#active-photo");
  let photoIndex = 0;

  function showPhoto(index) {
    photoIndex = (index + photos.length) % photos.length;
    activePhoto.src = photos[photoIndex].src;
    activePhoto.alt = photos[photoIndex].alt;
  }

  function openGallery(index) {
    showPhoto(index);
    gallery.showModal();
  }

  photos.forEach((photo, index) => {
    photo.closest("button").addEventListener("click", () => openGallery(index));
  });
  document.querySelector("#view-work").addEventListener("click", () => openGallery(0));
  gallery.querySelector(".previous").addEventListener("click", () => showPhoto(photoIndex - 1));
  gallery.querySelector(".next").addEventListener("click", () => showPhoto(photoIndex + 1));
  gallery.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") showPhoto(photoIndex - 1);
    if (event.key === "ArrowRight") showPhoto(photoIndex + 1);
  });
  gallery.addEventListener("click", event => {
    if (event.target === gallery) gallery.close();
  });
}

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
