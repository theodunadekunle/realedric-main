const archivePhotos = [...document.querySelectorAll(".archive-photo img")];
const archiveViewer = document.querySelector(".archive-viewer");
const archiveStage = archiveViewer.querySelector(".archive-stage");
const archiveImage = archiveStage.querySelector("img");
const archiveCount = archiveViewer.querySelector(".archive-count");
const archiveZoom = document.querySelector("#archive-zoom");
const archiveZoomValue = archiveViewer.querySelector(".archive-zoom-value");
let archiveIndex = 0;

function updateArchiveZoom() {
  const zoom = Number(archiveZoom.value);
  archiveStage.style.setProperty("--archive-scale", zoom / 100);
  archiveZoomValue.textContent = `${zoom}%`;
  archiveZoom.setAttribute("aria-valuetext", `${zoom}%`);
}

function showArchivePhoto(index) {
  archiveIndex = (index + archivePhotos.length) % archivePhotos.length;
  const photo = archivePhotos[archiveIndex];
  archiveStage.style.setProperty("--archive-ratio", Number(photo.getAttribute("width")) / Number(photo.getAttribute("height")));
  archiveImage.alt = photo.alt;
  archiveImage.src = photo.src;
  archiveCount.textContent = `${archiveIndex + 1} / ${archivePhotos.length}`;
  archiveZoom.value = archiveZoom.min;
  updateArchiveZoom();
}

archivePhotos.forEach((photo, index) => {
  photo.closest("button").addEventListener("click", () => {
    showArchivePhoto(index);
    archiveViewer.showModal();
  });
});

archiveZoom.addEventListener("input", () => {
  const x = (archiveStage.scrollLeft + archiveStage.clientWidth / 2) / archiveStage.scrollWidth;
  const y = (archiveStage.scrollTop + archiveStage.clientHeight / 2) / archiveStage.scrollHeight;
  updateArchiveZoom();
  archiveStage.scrollTo(x * archiveStage.scrollWidth - archiveStage.clientWidth / 2,
    y * archiveStage.scrollHeight - archiveStage.clientHeight / 2);
});

archiveViewer.querySelector(".archive-previous").addEventListener("click", () => showArchivePhoto(archiveIndex - 1));
archiveViewer.querySelector(".archive-next").addEventListener("click", () => showArchivePhoto(archiveIndex + 1));
archiveViewer.addEventListener("keydown", event => {
  if (event.target === archiveZoom || event.target === archiveStage) return;
  if (event.key === "ArrowLeft") showArchivePhoto(archiveIndex - 1);
  if (event.key === "ArrowRight") showArchivePhoto(archiveIndex + 1);
});
updateArchiveZoom();

const galleryZoom = document.querySelector("#archive-gallery-zoom");
const archiveGallery = document.querySelector("#archive-gallery");
const gallerySize = document.querySelector(".archive-gallery-size");
const gallerySizes = ["Small", "Medium", "Large"];

function updateGallerySize() {
  const size = Number(galleryZoom.value);
  const label = gallerySizes[size + 1];
  archiveGallery.style.setProperty("--archive-column-offset", -size);
  gallerySize.textContent = label;
  galleryZoom.setAttribute("aria-valuetext", label);
}

galleryZoom.addEventListener("input", updateGallerySize);
updateGallerySize();
