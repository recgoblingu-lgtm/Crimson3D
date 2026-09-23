# Crimson3D

Minimal storefront for Crimson3D 3D assets. The first product is the **Crimson Blade**, using the GLB sword asset in `assets/` and the rendered preview image.

## Run locally

```bash
cp .env.example .env
# add your Discord webhook URL to .env
export $(grep -v '^#' .env | xargs)
npm start
```

Open `http://localhost:3000`.

## Discord purchase requests

The browser posts form data to `POST /api/order`. `server.js` validates the request and sends a formatted message to Discord using `DISCORD_WEBHOOK_URL`. Keep the webhook URL server-side; do not paste it into `buy.js` or any public HTML file. On a host such as Render, Railway, Fly.io, or another Node host, set the environment variable there and run `npm start`.

The checkout page is an inquiry form, not a payment processor. Add a payment provider only after deciding on your business and refund workflow.

## Customize

- Replace `contact@crimson3d.dev` in `index.html` and `buy.html` with the real contact address.
- Edit the product price and copy in `index.html`.
- Add more product cards and detail pages as the library grows.
