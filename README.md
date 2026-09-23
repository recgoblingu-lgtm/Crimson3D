# Crimson3D

A very small static website. No npm, build command, or server is required.

## Edit the site

Open `index.html` and search for `CHANGE` to find the main editable areas:

- Site name and intro text
- Model names and descriptions
- Download file paths
- About text
- Contact email
- Footer text

To add a model, copy one complete `<article class="model-card">...</article>` block in `index.html`, then change its text, image, and download links.

Put model files inside `assets/`. Example:

```html
<a href="assets/my-model.glb" download>GLB ↓</a>
```

The two starter cards are placeholders. Replace them or delete them.

## Cloudflare Pages

Connect this repository to Cloudflare Pages with:

- Build command: blank
- Build output directory: `.`
- Root directory: `/`
