# Crimson3D

Minimal storefront for Crimson3D 3D assets. The first product is the **Crimson Blade**, using the GLB sword asset in `assets/` and the rendered preview image.

## Cloudflare Pages setup — no npm required

This repository is ready for a Cloudflare Pages GitHub deployment. Use these settings in the Cloudflare Pages project:

- **Production branch:** `main`
- **Build command:** leave blank, or use `exit 0`
- **Build output directory:** `/` or `.` (the repository root)
- **Root directory:** `/`

Cloudflare will serve the HTML/CSS/JS directly and will deploy the function in `functions/api/order.js` automatically. Pages Functions are Cloudflare's server-side handlers for form submissions and other dynamic behavior, so there is no Node server to run.

## Discord webhook setup

In the Cloudflare Pages project, open **Settings → Variables and Secrets** and add this encrypted variable for both Production and Preview if desired:

```text
DISCORD_WEBHOOK_URL = your Discord webhook URL
```

Do not put the real webhook URL in `buy.js`, HTML, or any committed file. The browser posts to `/api/order`; the Cloudflare Function validates the form and sends the formatted message to Discord using the encrypted secret.

## Customize

- Replace `contact@crimson3d.dev` in `index.html` and `buy.html` with the real contact address.
- Edit the product price and copy in `index.html`.
- Add more product cards and detail pages as the library grows.

The checkout page is an inquiry form, not a payment processor. Add a payment provider only after deciding on your business and refund workflow.
