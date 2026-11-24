# Realedric website asset checklist

Figma designs checked on 24 November 2026.

- [Home](https://www.figma.com/design/jp3oK8dSWk3WcUY6MDhEen/Realedric-Brand?node-id=129-782)
- [About](https://www.figma.com/design/jp3oK8dSWk3WcUY6MDhEen/Realedric-Brand?node-id=178-1097)
- [Portfolio](https://www.figma.com/design/jp3oK8dSWk3WcUY6MDhEen/Realedric-Brand?node-id=192-2063&t=iTYdGnGPJhZUoXz6-11)
- [Homepage hero component](https://www.figma.com/design/jp3oK8dSWk3WcUY6MDhEen/Realedric-Brand?node-id=148-631)

Paths are relative to the `website` folder. To replace a photo, export the original image fill from the corresponding Figma design and use the listed filename and capitalization.

## Website file structure

```text
website/
├── index.html
├── ASSETS.md
├── pages/
│   ├── about.html
│   └── portfolio.html
└── assets/
    ├── images/
    │   ├── realedric-logo.svg
    │   ├── Home, Portfolio and slideshow exports listed below
    │   └── about/
    │       └── About exports listed below
    ├── fonts/
    │   ├── Inter.woff2
    │   ├── Inter-OFL.txt
    │   ├── InstrumentSerif-Italic.woff2
    │   └── InstrumentSerif-OFL.txt
    ├── scripts/
    │   ├── home.js
    │   └── hero.js
    └── styles/
        ├── home.css
        ├── about.css
        └── portfolio.css
```

- [x] `assets/images/realedric-logo.svg` · Shared header and footer logo on all three pages.

## About

The four About photos are linked from the files below.

| Photo placement | Local file |
| --- | --- |
| Large portrait | `assets/images/1201a932-ae16-47a2-929f-8adc3e7e3e3f.jpeg` |
| Small portrait · left | `assets/images/about/edric-self-portrait.jpg` |
| White T-shirt portrait · center | `assets/images/2d60190f-c1f3-4f78-8b5a-da4cc2155d61.jpeg` |
| Sunglasses portrait · right | `assets/images/54ed5779-d3d7-4aaf-b8a7-8a5570cd755d.jpeg` |

## Homepage and Portfolio photos

These supplied photos are linked from `assets/images/`. Home and Portfolio share the gallery photos.

| Photo placement | Filename |
| --- | --- |
| Hero 1 · couple in red | `_MG_0186.jpg` |
| Hero 2 · singer in blue | `_MG_0292.jpg` |
| Hero 3 · horseback portrait | `_MG_0309.jpg` |
| Hero 4 · performer in front of a crowd | `_MG_1120.jpg` |
| Hero 5 · portrait in orange | `_MG_0086copy.jpg` |
| Hero 6 · portrait in front of Sharp Logistics signage | `_MG_0199.jpg` |
| Gallery · wedding dance | `_MG_1493.jpg` |
| Gallery · woman in white | `_MG_0160copy.jpg` |
| Gallery · graduation portrait | `_MG_1541.jpg` |
| Gallery · woman in a gold headwrap | `6283aea9-b383-449c-9c9a-f46984bba6fa.jpeg` |
| Gallery · outdoor mirror portrait | `_MG_0028copy.jpg` |
| Gallery · man holding a phone | `_MG_1494.jpg` |
| Gallery · singer with microphone | `84c7fb7b-7039-4310-b5d4-9ef598276eff.jpeg` |
| Behind the Lens · Edric’s reflection | `1201a932-ae16-47a2-929f-8adc3e7e3e3f.jpeg` |

## Webfonts

- [x] `assets/fonts/Inter.woff2` · Inter variable webfont
- [x] `assets/fonts/InstrumentSerif-Italic.woff2` · Instrument Serif Italic webfont


Icons use CSS or text symbols. The sample testimonial uses initials until an approved client photo is available.

## Before publishing

- [ ] Confirm all files load locally and check photo crops on mobile, tablet, and desktop.
- [ ] Test the slideshow, gallery viewer, navigation, and FAQ controls.
- [ ] Replace the sample testimonials and retail-return text with approved photography content.
- [ ] Push the website assets and code to GitHub, then verify the deployed pages.

