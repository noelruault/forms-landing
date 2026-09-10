# Educación a Bordo, landing

Marketing site for [Educación a Bordo](https://educacionabordo.com), the boat-licence exam prep platform. Next.js static export, Tailwind CSS, served from Cloudflare Workers Static Assets at `educacionabordo.com` and `www.educacionabordo.com`.

Source of truth: `github.com/blackbaostudio/nautica-web` (private). `noelruault/forms-landing` only remains as the GitHub Pages fallback described below.

## Develop

```bash
bun install
bun run dev        # http://localhost:3000
bun run lint
```

Do not run `bun run build` while `bun run dev` is up: both write `.next/` and the dev server starts serving 404 chunks. Stop dev, build, then start dev again.

## Deploy

```bash
bunx wrangler login   # once per machine
bun run deploy        # next build, then wrangler deploy of ./out
```

`wrangler.toml` declares the worker (`educacionabordo-landing`) and its two custom domains. Custom domains create the DNS records and TLS certificates themselves, so there is nothing to add in the Cloudflare DNS UI. The zone `educacionabordo.com` lives in the same Cloudflare account as the app workers.

In `wrangler.toml`, top-level keys such as `routes` must stay above the `[assets]` table: TOML assigns anything after a table header to that table, and wrangler silently ignores `assets.routes`.

### Fallback: GitHub Pages

`bun run deploy:gh-pages` publishes `out/` to the `gh-pages` branch of `noelruault/forms-landing` with a `CNAME` for `educacionabordo.com`. Pages only becomes reachable if the apex and `www` records are pointed at GitHub instead of the worker (A `185.199.108.153` to `.111.153`, AAAA `2606:50c0:8000::153` to `8003::153`, `www` CNAME `noelruault.github.io`). Not needed while the worker is the deployment.

## Hosts

`src/lib/site.js` is the only place that knows the product hostnames: `app.educacionabordo.com` (the app, "Accede") and `demo.educacionabordo.com` (the demo, "Prueba" buttons). Both are separate deployments.

## Assets

- All raster images are WebP under `src/images/`, sized to their largest render; the hero video is `public/media/tour.mp4` (H.264, 480x848, 30 fps, ~3.4 MB) with a WebP poster, attached 1.5 s after load and skipped for reduced motion, Save-Data and 2g/3g.
- `public/brand/logo-simplified.png` is the lossless print master for the simplified mark; the favicon set (`src/app/favicon.ico`, `icon.png`, `apple-icon.png`) is derived from it.
- `src/images/logo.webp` is the full-colour illustration (footer), `src/images/logo-nav.webp` the white monoline mark (navbar).

## Known placeholders

- The three Pricing buttons point to Stripe **test-mode** payment links.
- Testimonials, FAQs and secondary features still carry template copy.
