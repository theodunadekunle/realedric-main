const archiveTiles = [...document.querySelectorAll(".archive-photo")];
const archiveViewer = document.querySelector(".archive-viewer");
if (archiveViewer) {
  let archivePhotos = [];
  const archiveStage = archiveViewer.querySelector(".archive-stage");
  const archiveImage = archiveStage.querySelector("img");
  const archiveCount = archiveViewer.querySelector(".archive-count");
  const albumTag = archiveViewer.querySelector(".photo-album-tag");
  const thumbnails = archiveViewer.querySelector(".gallery-preview-thumbnails");
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
    if (archiveCount) archiveCount.textContent = `${archiveIndex + 1} / ${archivePhotos.length}`;
    if (albumTag) {
      const category = photo.closest(".archive-photo").dataset.category ?? archiveViewer.dataset.category;
      albumTag.href = `${category}.html`;
      albumTag.textContent = category[0].toUpperCase() + category.slice(1);
    }
    if (thumbnails) {
      thumbnails.querySelector("[aria-current]")?.removeAttribute("aria-current");
      const current = thumbnails.children[archiveIndex];
      current.setAttribute("aria-current", "true");
      current.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
    archiveZoom.value = archiveZoom.min;
    updateArchiveZoom();
  }

  archiveTiles.forEach(tile => {
    tile.addEventListener("click", () => {
      const photo = tile.querySelector("img");
      archivePhotos = archiveTiles.filter(item => !item.hidden).map(item => item.querySelector("img"));
      if (thumbnails) {
        thumbnails.replaceChildren(...archivePhotos.map((image, index) => {
          const button = document.createElement("button");
          const thumbnail = document.createElement("img");
          button.type = "button";
          button.setAttribute("aria-label", `Preview: ${image.alt}`);
          thumbnail.src = image.src;
          thumbnail.alt = "";
          button.append(thumbnail);
          button.addEventListener("click", () => showArchivePhoto(index));
          return button;
        }));
      }
      archiveViewer.showModal();
      showArchivePhoto(archivePhotos.indexOf(photo));
    });
  });

  archiveZoom.addEventListener("input", () => {
    const x = (archiveStage.scrollLeft + archiveStage.clientWidth / 2) / archiveStage.scrollWidth;
    const y = (archiveStage.scrollTop + archiveStage.clientHeight / 2) / archiveStage.scrollHeight;
    updateArchiveZoom();
    archiveStage.scrollTo(x * archiveStage.scrollWidth - archiveStage.clientWidth / 2,
      y * archiveStage.scrollHeight - archiveStage.clientHeight / 2);
  });

  archiveViewer.querySelector(".archive-previous")?.addEventListener("click", () => showArchivePhoto(archiveIndex - 1));
  archiveViewer.querySelector(".archive-next")?.addEventListener("click", () => showArchivePhoto(archiveIndex + 1));
  archiveViewer.addEventListener("keydown", event => {
    if (archivePhotos.length < 2 || event.target === archiveZoom || event.target === archiveStage) return;
    if (event.key === "ArrowLeft") showArchivePhoto(archiveIndex - 1);
    if (event.key === "ArrowRight") showArchivePhoto(archiveIndex + 1);
  });
  updateArchiveZoom();
}

const galleryZoom = document.querySelector("#archive-gallery-zoom");
const archiveGallery = document.querySelector("#archive-gallery");
const adaptiveGallery = archiveGallery.hasAttribute("data-adaptive-gallery");

function galleryRows(photos, width) {
  const rows = [];
  let start = 0;

  while (start < photos.length) {
    const remaining = photos.length - start;
    let pattern;
    if (width < 560) {
      pattern = [Math.min(2, remaining)];
    } else if (remaining >= 7) {
      const last = photos[start + 6];
      pattern = width >= 1100 && last.ratio >= 1.4 ? [2, 4, 1] : [2, 3, 2];
    } else {
      const endings = [[1], [2], [3], [2, 2], [2, 3], [3, 3]];
      pattern = endings[remaining - 1];
    }

    for (const count of pattern) {
      rows.push(photos.slice(start, start + count));
      start += count;
    }
  }

  return rows;
}

function layoutAdaptiveGallery() {
  if (!adaptiveGallery || !archiveGallery.clientWidth) return;

  const width = archiveGallery.clientWidth;
  const gap = parseFloat(getComputedStyle(archiveGallery).columnGap);
  const scale = 1 + Number(galleryZoom?.value ?? 0) * .2;
  const photos = archiveTiles.filter(tile => !tile.hidden).map(tile => {
    const photo = tile.querySelector("img");
    return { tile, ratio: Number(photo.getAttribute("width")) / Number(photo.getAttribute("height")) };
  });

  galleryRows(photos, width).forEach((row, rowIndex) => {
    const proportions = row.map(({ ratio }) => Math.min(1.8, Math.max(.75, ratio)));
    const total = proportions.reduce((sum, ratio) => sum + ratio, 0);
    const height = Math.round(Math.min(640, Math.max(120, (width - gap * (row.length - 1)) / total)) * scale);
    let spans = row.map(() => 12 / row.length);

    if (row.length === 2 && width >= 560) {
      const firstWide = Math.abs(proportions[0] - proportions[1]) >= .15
        ? proportions[0] > proportions[1]
        : rowIndex % 2 === 0;
      spans = firstWide ? [7, 5] : [5, 7];
    }

    row.forEach(({ tile }, index) => {
      tile.style.setProperty("--gallery-span", spans[index]);
      tile.style.setProperty("--gallery-height", `${height}px`);
    });
  });
}

if (adaptiveGallery) {
  let lastWidth;
  new ResizeObserver(([entry]) => {
    const width = entry.contentRect.width;
    if (lastWidth === width) return;
    lastWidth = width;
    layoutAdaptiveGallery();
  }).observe(archiveGallery);
}
if (galleryZoom) {
  const gallerySize = document.querySelector(".archive-gallery-size");
  const gallerySizes = ["Small", "Medium", "Large"];

  function updateGallerySize() {
    const size = Number(galleryZoom.value);
    const label = gallerySizes[size + 1];
    archiveGallery.style.setProperty("--archive-column-offset", -size);
    gallerySize.textContent = label;
    galleryZoom.setAttribute("aria-valuetext", label);
    layoutAdaptiveGallery();
  }

  galleryZoom.addEventListener("input", updateGallerySize);
  updateGallerySize();
}

const archiveCategory = document.querySelector("#archive-category");
if (archiveCategory) {
  function filterArchive() {
    const category = archiveCategory.value;
    archiveTiles.forEach(tile => {
      tile.hidden = category !== "all" && tile.dataset.category !== category;
    });
    layoutAdaptiveGallery();
  }

  archiveCategory.addEventListener("change", filterArchive);
  filterArchive();
}

const archiveAlbum = document.querySelector("#archive-album");
if (archiveAlbum) {
  archiveAlbum.addEventListener("change", () => location.assign(archiveAlbum.value));
  window.addEventListener("pageshow", () => {
    archiveAlbum.value = archiveAlbum.querySelector("option[selected]").value;
  });
}
