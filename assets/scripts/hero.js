const hero = document.querySelector(".hero");
const slideImages = [...hero.querySelectorAll(".hero-slide img")];
const pauseButton = hero.querySelector(".hero-pause");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const holdTime = 300;
const transitionTime = 2000;
let slideIndex = 0;
let previousSlide = null;
let timer;
let paused = false;

function imageReady(image) {
  return image.complete && image.naturalWidth > 0;
}

function playHero(delay = holdTime) {
  clearTimeout(timer);
  const ready = slideImages.filter(imageReady);
  pauseButton.hidden = reduceMotion.matches || ready.length < 2;
  if (!imageReady(slideImages[slideIndex]) && ready.length) {
    slideImages[slideIndex].parentElement.classList.remove("is-current");
    slideIndex = slideImages.indexOf(ready[0]);
    slideImages[slideIndex].parentElement.classList.add("is-current");
  }
  if (paused || pauseButton.hidden || document.hidden) return;
  timer = setTimeout(advanceHero, delay);
}

function advanceHero() {
  const ordered = [...slideImages.slice(slideIndex + 1), ...slideImages.slice(0, slideIndex)];
  const next = ordered.find(imageReady);
  if (!next) return;
  previousSlide?.classList.remove("is-previous");
  previousSlide = slideImages[slideIndex].parentElement;
  previousSlide.classList.replace("is-current", "is-previous");
  next.parentElement.classList.add("is-current");
  slideIndex = slideImages.indexOf(next);
  playHero(transitionTime + holdTime);
}

pauseButton.addEventListener("click", () => {
  paused = !paused;
  pauseButton.toggleAttribute("data-paused", paused);
  pauseButton.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
  playHero(paused ? holdTime : transitionTime + holdTime);
});

slideImages.forEach(image => image.addEventListener("load", () => {
  if (pauseButton.hidden) playHero();
}));
reduceMotion.addEventListener("change", () => playHero());
document.addEventListener("visibilitychange", () => playHero());
playHero();
