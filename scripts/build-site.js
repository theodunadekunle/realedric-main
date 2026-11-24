const { cp, mkdir, readFile, writeFile } = require("node:fs/promises");
const { join } = require("node:path");

const root = join(__dirname, "..");
const output = join(root, "dist");
const categories = ["weddings", "portraits", "events", "archive"];
const query = '*[_type == "photoAlbum" && _id in $albums]{_id, photos[defined(asset)]{alt,"url":asset->url,"width":asset->metadata.dimensions.width,"height":asset->metadata.dimensions.height}}';

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function photoTile(photo, category) {
  if (typeof photo.url !== "string" ||
      !/^https:\/\/cdn\.sanity\.io\/images\/4tbr7wml\/production\/[\w.-]+$/.test(photo.url) ||
      !Number.isSafeInteger(photo.width) || photo.width <= 0 ||
      !Number.isSafeInteger(photo.height) || photo.height <= 0) return "";

  const alt = escapeHtml(typeof photo.alt === "string" ? photo.alt : "");
  const source = `${photo.url}?w=${Math.min(photo.width, 1600)}&amp;auto=format`;
  return `      <button class="archive-photo" data-category="${category}" type="button"><img src="${source}" data-download="${photo.url}" alt="${alt}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async"></button>`;
}

async function buildSite() {
  const url = new URL("https://4tbr7wml.api.sanity.io/v2025-02-19/data/query/production");
  url.search = new URLSearchParams({
    query,
    $albums: JSON.stringify(categories),
    perspective: "published",
  });
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Sanity query failed with HTTP ${response.status}`);
  const { result } = await response.json();
  const albums = Object.fromEntries(result.map(album => [album._id, album.photos ?? []]));

  await mkdir(output, { recursive: true });
  await Promise.all(["index.html", "assets", "pages"].map(path => (
    cp(join(root, path), join(output, path), { recursive: true })
  )));

  for (const page of [...categories, "portfolio"]) {
    const groups = page === "portfolio" ? categories.slice(0, 3) : [page];
    const cmsTiles = Object.fromEntries(groups.map(category => [
      category, (albums[category] ?? []).map(photo => photoTile(photo, category)).filter(Boolean),
    ]));
    if (!Object.values(cmsTiles).some(tiles => tiles.length)) continue;
    const path = join(output, "pages", `${page}.html`);
    const html = await readFile(path, "utf8");
    const grid = /(<div class="archive-grid" id="archive-gallery"[^>]*>)([\s\S]*?)(\n +<\/div>)/;
    if (!grid.test(html)) throw new Error(`Missing gallery on ${page}`);
    await writeFile(path, html.replace(grid, (match, open, existing, close) => {
      const tiles = groups.flatMap(category => cmsTiles[category].length
        ? cmsTiles[category]
        : existing.split("\n").filter(line => line.includes(`data-category="${category}"`)));
      return open + "\n" + tiles.join("\n") + close;
    }));
  }
}

buildSite().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
