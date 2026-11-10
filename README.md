# Bad Apple!! / Real Earth — place map

[日本語](README.ja.md)

Live site: https://bad-apple-earth-map.ikutotest.xyz/ · Video: https://youtu.be/kB3fzm_Un2g

A map of every frame of *Bad Apple!! but every frame is real land & water on Earth*. Each frame of the animation was matched to a real piece of the Earth's land and water. This site draws the exact area (drawn extent) of every one of those views and gives its country or territory, continent and frames.

- **Map:** the outline of every view, colored by continent. Click one for its frames (with YouTube timestamp links), country, continent, nearest mapped place, width, rotation, mirroring, match score and photo date, and a thumbnail of the original frame beside the matched land/water.
- **Countries:** all 138 countries and territories, sortable and searchable, in English or Japanese.
- **Frames:** all 6,955 frames of the video in one scrollable, searchable list, also as [`web/data/frames.csv`](web/data/frames.csv).
- Continent filters, a timeline replay of the video order, "frames near me" (uses your location only in the browser), nearest views to any clicked point, and shareable `#view=` links.

The site is static: no build step, no server code and no tracking. MapLibre GL JS is vendored; the basemap comes from OpenFreeMap.

## Numbers

| | |
|---|---|
| Matched frames | 6,562 (the ending credits, frames 6,563–6,955, show the statistics) |
| Distinct views | 6,355 |
| Places (views joined when they overlap by IoU > 0.5) | 1,680 |
| Countries and territories | 138 |
| Continents | 7 |

## How countries and continents are assigned

Each view's quadrilateral is intersected with Natural Earth 1:10m Admin 0 map units. The country or territory with the largest geodesic land overlap is used; all shares are kept. Views with less than 2 % land take the nearest country within 200 nautical miles. Russia (one map unit, "Europe" in Natural Earth) is split at the Urals (60° E). Natural Earth's "Seven seas" remote islands (Azores, Maldives, Mauritius) use their UN M49 region. Where most of a view's land lies in a Natural Earth disputed area, the area is named. Boundaries are Natural Earth's de facto view; no position on sovereignty is implied.

## Files

| Path | Contents |
|---|---|
| `web/index.html`, `web/app.js`, `web/style.css` | the site |
| `web/data/views.json` | every view: corners, frame ranges, country, continent, territory, place, width, rotation, mirroring, mIoU, nearest place, photo date, disputed note, country shares |
| `web/data/frames.json`, `web/data/frames.csv` | the view of every frame; the CSV has every column for all 6,955 frames |
| `web/data/stats.json` | totals by continent and country |
| `web/data/thumbs/` | one 324×120 thumbnail per view: the original frame and the matched land/water |
| `web/vendor/maplibre-gl-5.24.0/` | MapLibre GL JS with its licence |
| `tools/serve-web.mjs` | local server: `node tools/serve-web.mjs 8125` |
| `tools/publish-cloudflare.ps1` | deploy to Cloudflare |

The data files are exported from the video project's pipeline (`badapple_coastline.landwater_web`), which is not part of this repository.

## Deploy

The site is published as a Cloudflare Worker with static assets only, on a custom domain (the `workers.dev` and preview URLs are disabled). The domain must be a zone in the same Cloudflare account. Log in once with `npx wrangler@4.151.2 login`, then:

```powershell
.\tools\publish-cloudflare.ps1 -Domain bad-apple-earth-map.ikutotest.xyz
```

## Licences and credits

The code (`web/*.html`, `web/*.js`, `web/*.css`, `tools/`) is under the MIT License (see [LICENSE](LICENSE)). The data keeps its sources' terms:

- Land/water: G. E. Kindermann (2025), *Global Land / Water Mask Map with 0.3 arc sec. (10 m) Resolution*, v1, [doi:10.5281/zenodo.14899246](https://doi.org/10.5281/zenodo.14899246), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Thumbnails are cropped, resampled, rotated and reflected where marked.
- Boundaries, places and continents: Made with [Natural Earth](https://www.naturalearthdata.com/) (public domain).
- Basemap (loaded at runtime): [OpenFreeMap](https://openfreemap.org) © [OpenMapTiles](https://openmaptiles.org/), data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) (ODbL).
- [MapLibre GL JS](https://maplibre.org/) 5.24.0, BSD-3-Clause (`web/vendor/maplibre-gl-5.24.0/LICENSE.txt`).
- The original-frame thumbnails are from the *Bad Apple!!* shadow-art PV by Anira (あにら) ("Bad Apple!! feat. nomico", Alstroemeria Records; original composition ZUN / Touhou Project). They belong to their creators and are not covered by the MIT License.

AI assistance (Claude by Anthropic) was used for parts of the code.
