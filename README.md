# Educación a Bordo, landing

Marketing site for [Educación a Bordo](https://educacionabordo.com), the boat-licence exam prep platform. Next.js static export, Tailwind CSS, deployed to GitHub Pages at `educacionabordo.com`.

## Develop

```bash
bun install
bun run dev        # http://localhost:3000
bun run lint
```

Do not run `bun run build` while `bun run dev` is up: both write `.next/` and the dev server starts serving 404 chunks. Stop dev, build, then start dev again.

## Build and deploy

```bash
bun run build      # next build + writes out/CNAME (educacionabordo.com) and out/.nojekyll
bun run deploy     # pushes out/ to the gh-pages branch of origin
```

GitHub Pages for `noelruault/forms-landing` serves the `gh-pages` branch root; the `CNAME` file in `out/` sets the custom domain, so change it in the `postbuild` script, never by hand in the Pages UI.

## DNS (Cloudflare zone `educacionabordo.com`)

GitHub Pages needs these records (values from GitHub's custom-domain docs). Leave them DNS-only (grey cloud) at least until GitHub has issued the certificate, then turn on "Enforce HTTPS" in the repo's Pages settings.

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `noelruault.github.io` |

`app.educacionabordo.com` (the app) and `demo.educacionabordo.com` (the demo) are separate deployments; their hostnames live in `src/lib/site.js` and nowhere else.

## Assets

- All raster images are WebP under `src/images/`; the hero video is `public/media/tour.mp4` (H.264, 480x848, 30 fps, ~3.4 MB) with a WebP poster.
- `public/brand/logo-simplified.png` is the lossless print master for the simplified mark; the favicon set (`src/app/favicon.ico`, `icon.png`, `apple-icon.png`) is derived from it.
- `src/images/logo.webp` is the full-colour illustration (footer), `src/images/logo-nav.webp` the white monoline mark (navbar).

## Known placeholders

- The three Pricing buttons point to Stripe **test-mode** payment links.
- Testimonials, FAQs and secondary features still carry template copy.
