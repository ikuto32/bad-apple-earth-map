// Bad Apple!! / Real Earth — place map. No build step; MapLibre GL JS is vendored.
'use strict';
const INITIAL_HASH = location.hash; // read before MapLibre adds its own map= parameter

const STRINGS = {
  en: {
    lede: 'Every frame of “Bad Apple!! but every frame is a real place on Earth”, placed where it really is.',
    tabOverview: 'Overview', tabCountries: 'Countries', tabFrames: 'Frames', tabAbout: 'About',
    byContinent: 'By continent', continentHint: 'Click a continent to show or hide it on the map.',
    nearMe: 'Frames near me', clickHint: 'or click anywhere on the map',
    searchCountry: 'Search countries & territories', searchFrame: 'Frame number or country', downloadCsv: 'CSV',
    colCountry: 'Country / territory', colFrames: 'Frames', colPlaces: 'Places', colViews: 'Views', colFrame: 'Frame', colTime: 'Time',
    tMatched: 'matched frames', tViews: 'distinct views', tPlaces: 'places', tCountries: 'countries & territories', tContinents: 'continents', tArea: 'million km² covered',
    fSmallest: 'Smallest view', fMedian: 'Median view', fLargest: 'Largest view', fMirrored: 'Mirrored views', fWater: 'Open-water views', fArea: 'Area covered (overlaps removed)',
    kmWide: 'km wide', of: 'of', frames: 'frames', frame: 'frame', places: 'places', views: 'views',
    showingCountry: 'Country', showingPlace: 'Place', clear: 'Clear filter',
    continent: 'Continent', country: 'Country / territory', territory: 'Territory', nearest: 'Nearest mapped place', centre: 'Centre',
    width: 'View width', rotation: 'Rotation', mirrored: 'Mirrored', matchScore: 'Match score (mIoU)', photo: 'Photo', place: 'Place',
    area: 'Area', assignment: 'Assignment', framesShown: 'Frames shown', yes: 'yes', no: 'no',
    methodLand: 'largest land overlap', methodNearest: 'open water · nearest country ≤ 200 nmi', methodOcean: 'open ocean',
    disputedNote: 'Disputed area', original: 'original', matched: 'matched land / water',
    openOsm: 'OpenStreetMap', watchAt: 'Watch on YouTube', nearestHere: 'Nearest views to this point', nearestYou: 'Nearest views to you',
    kmAway: 'km', geoError: 'Your location is not available in this browser.', creditsRow: 'Ending credits · fixed view', creditsShort: 'credits',
    creditsNote: 'Ending credits: the video holds this one view (no match score). Not counted in the statistics.', na: 'n/a',
    timeAll: 'all frames', timeUpTo: 'up to frame', resultCount: (n, t) => `${n.toLocaleString()} of ${t.toLocaleString()} frames`,
    shareInPlace: (n) => `${n} views in this place`, showPlace: 'Show place',
  },
  ja: {
    lede: '「Bad Apple!! 全フレームを地球上の実在する場所で再現」の全フレームを、実際の場所に配置したマップです。',
    tabOverview: '概要', tabCountries: '国・地域', tabFrames: 'フレーム', tabAbout: '説明',
    byContinent: '大陸別', continentHint: '大陸をクリックすると地図上の表示を切り替えます。',
    nearMe: '現在地の近くのフレーム', clickHint: '地図をクリックしても探せます',
    searchCountry: '国・地域を検索', searchFrame: 'フレーム番号または国名', downloadCsv: 'CSV',
    colCountry: '国・地域', colFrames: 'フレーム', colPlaces: '地点', colViews: 'ビュー', colFrame: 'フレーム', colTime: '時刻',
    tMatched: 'マッチしたフレーム', tViews: '異なるビュー', tPlaces: '地点', tCountries: '国・地域', tContinents: '大陸', tArea: '百万km²（重複を除く）',
    fSmallest: '最小の範囲', fMedian: '範囲の中央値', fLargest: '最大の範囲', fMirrored: '鏡像のビュー', fWater: '水域のビュー', fArea: '表示した範囲（重複を除く）',
    kmWide: 'km幅', of: '/', frames: 'フレーム', frame: 'フレーム', places: '地点', views: 'ビュー',
    showingCountry: '国・地域', showingPlace: '地点', clear: '解除',
    continent: '大陸', country: '国・地域', territory: '地域', nearest: '最寄りの集落', centre: '中心',
    width: '範囲の幅', rotation: '回転', mirrored: '鏡像', matchScore: '一致度 (mIoU)', photo: '衛星写真', place: '地点',
    area: '面積', assignment: '判定方法', framesShown: '表示フレーム', yes: 'はい', no: 'いいえ',
    methodLand: '陸地の重なりが最大', methodNearest: '水域・200海里以内の最寄りの国', methodOcean: '外洋',
    disputedNote: '係争地', original: '元の影絵', matched: 'マッチした陸と水',
    openOsm: 'OpenStreetMap', watchAt: 'YouTubeで見る', nearestHere: 'この地点に近いビュー', nearestYou: '現在地に近いビュー',
    kmAway: 'km', geoError: 'このブラウザでは現在地を取得できません。', creditsRow: 'エンディング・固定ビュー', creditsShort: 'エンディング',
    creditsNote: 'エンディング: 動画はこの1つのビューを表示し続けます（一致度なし）。統計には含めていません。', na: '—',
    timeAll: '全フレーム', timeUpTo: 'フレーム', resultCount: (n, t) => `${t.toLocaleString()} フレーム中 ${n.toLocaleString()}`,
    shareInPlace: (n) => `この地点のビュー ${n}`, showPlace: '地点を表示',
  },
};

const state = { lang: 'en', data: null, views: [], continents: new Set(), country: null, place: null, upTo: Infinity,
  selected: null, frameRows: [], frameFilter: '', countrySort: { key: 'frames', dir: -1 }, playing: false };
const $ = (s) => document.querySelector(s);
const T = (k) => STRINGS[state.lang][k];
const fmt = (n, d = 0) => Number(n).toLocaleString(state.lang === 'ja' ? 'ja-JP' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: d });
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function countryName(k) { return state.lang === 'ja' ? state.data.countries_ja[k] : state.data.countries[k]; }
function continentName(k) { return state.lang === 'ja' ? state.data.continents_ja[k] : state.data.continents[k]; }
function colorOf(k) { return state.meta.continent_colors[state.data.continents[k]]; }
function timeOf(frame) { const s = frame / state.meta.fps; return `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, '0')}`; }
function youtube(frame) { return `https://www.youtube.com/watch?v=${state.meta.youtube_id}&t=${Math.floor(frame / state.meta.fps)}s`; }

function unwrap(c) {
  const ring = [];
  for (let i = 0; i < 4; i++) {
    let lon = c[2 * i]; const lat = c[2 * i + 1];
    if (i) { const prev = ring[i - 1][0]; while (lon - prev > 180) lon -= 360; while (lon - prev < -180) lon += 360; }
    ring.push([lon, lat]);
  }
  ring.push(ring[0]); return ring;
}

async function load() {
  const [views, frames, stats, meta] = await Promise.all(['views', 'frames', 'stats', 'meta'].map((n) => fetch(`data/${n}.json`).then((r) => r.json())));
  state.data = views; state.stats = stats; state.meta = meta;
  const col = Object.fromEntries(views.columns.map((c, i) => [c, i]));
  state.views = views.rows.map((r) => {
    const v = {}; for (const [k, i] of Object.entries(col)) v[k] = r[i];
    v.frames = v.frame_ranges.reduce((n, [a, b]) => n + b - a + 1, 0); v.first = v.frame_ranges[0][0]; v.ring = unwrap(v.corners); v.credits = !!v.credits; return v;
  });
  state.frameView = frames.rows.map((r) => r[0]); state.frameScore = frames.rows.map((r) => r[1]);
  state.continents = new Set(views.continents.map((_, k) => k));
  state.byPlace = new Map(); for (const v of state.views) { if (v.credits) continue; if (!state.byPlace.has(v.place)) state.byPlace.set(v.place, []); state.byPlace.get(v.place).push(v); }
  const agg = new Map();
  for (const v of state.views) {
    if (v.credits) continue;  // ending credits: shown, not counted
    const a = agg.get(v.country) || { k: v.country, frames: 0, views: 0, places: new Set(), continent: new Map() };
    a.frames += v.frames; a.views++; a.places.add(v.place); a.continent.set(v.continent, (a.continent.get(v.continent) || 0) + v.frames); agg.set(v.country, a);
  }
  state.countries = [...agg.values()].map((a) => ({ k: a.k, frames: a.frames, views: a.views, places: a.places.size,
    continent: [...a.continent.entries()].sort((x, y) => y[1] - x[1])[0][0] }));
}

// ---------------------------------------------------------------- map
let map;
function geojson() {
  return {
    views: { type: 'FeatureCollection', features: state.views.map((v) => ({ type: 'Feature', id: v.id,
      properties: { id: v.id, c: v.continent, k: v.country, p: v.place, f0: v.first, n: v.frames }, geometry: { type: 'Polygon', coordinates: [v.ring] } })) },
    centres: { type: 'FeatureCollection', features: state.views.map((v) => ({ type: 'Feature', id: v.id,
      properties: { id: v.id, c: v.continent, k: v.country, p: v.place, f0: v.first, n: v.frames }, geometry: { type: 'Point', coordinates: v.centre } })) },
  };
}
function colorExpression() {
  return ['match', ['get', 'c'], ...state.data.continents.flatMap((name, k) => [k, state.meta.continent_colors[name]]), '#888'];
}
function filterExpression() {
  const f = ['all', ['in', ['get', 'c'], ['literal', [...state.continents]]]];
  if (state.country !== null) f.push(['==', ['get', 'k'], state.country]);
  if (state.place !== null) f.push(['==', ['get', 'p'], state.place]);
  if (Number.isFinite(state.upTo)) f.push(['<=', ['get', 'f0'], state.upTo]);
  return f;
}
function applyFilters() {
  if (!map || !map.getLayer('views-fill')) return;
  const f = filterExpression();
  for (const id of ['views-fill', 'views-line', 'centres']) map.setFilter(id, f);
  renderFilters();
}

function initMap() {
  map = new maplibregl.Map({ container: 'map', style: 'https://tiles.openfreemap.org/styles/dark', center: [20, 25], zoom: 1.4,
    attributionControl: { compact: true }, hash: 'map', dragRotate: false, pitchWithRotate: false });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'top-left');
  map.touchZoomRotate.disableRotation();
  map.on('load', () => {
    const g = geojson();
    map.addSource('views', { type: 'geojson', data: g.views, attribution: 'Land/water: G. E. Kindermann (2025), CC BY 4.0 · Boundaries: Natural Earth' });
    map.addSource('centres', { type: 'geojson', data: g.centres });
    map.addSource('selected', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.addLayer({ id: 'views-fill', type: 'fill', source: 'views', paint: { 'fill-color': colorExpression(),
      'fill-opacity': ['interpolate', ['linear'], ['zoom'], 3, .05, 7, ['case', ['boolean', ['feature-state', 'hover'], false], .34, .035]] } });
    map.addLayer({ id: 'views-line', type: 'line', source: 'views', paint: { 'line-color': colorExpression(),
      'line-width': ['interpolate', ['linear'], ['zoom'], 3, .4, 8, 1.6], 'line-opacity': ['interpolate', ['linear'], ['zoom'], 3, .3, 6, .9] } });
    map.addLayer({ id: 'centres', type: 'circle', source: 'centres', paint: { 'circle-color': colorExpression(),
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 3, 3, 6, 4.5],
      'circle-opacity': ['interpolate', ['linear'], ['zoom'], 5, .95, 7.5, 0], 'circle-stroke-color': '#080f17', 'circle-stroke-width': .6,
      'circle-stroke-opacity': ['interpolate', ['linear'], ['zoom'], 5, .8, 7.5, 0] } });
    map.addLayer({ id: 'selected-fill', type: 'fill', source: 'selected', paint: { 'fill-color': '#ffffff', 'fill-opacity': .16 } });
    map.addLayer({ id: 'selected-casing', type: 'line', source: 'selected', paint: { 'line-color': '#080f17', 'line-width': 7 } });
    map.addLayer({ id: 'selected-line', type: 'line', source: 'selected', paint: { 'line-color': '#ffffff', 'line-width': 3 } });
    map.addLayer({ id: 'selected-dot', type: 'circle', source: 'selected', filter: ['==', ['geometry-type'], 'Point'],
      paint: { 'circle-radius': 9, 'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 3,
        'circle-stroke-opacity': ['interpolate', ['linear'], ['zoom'], 6, 1, 8, 0] } });
    applyFilters();
    const fromHash = new URLSearchParams(INITIAL_HASH.slice(1).split('&').filter((p) => !p.startsWith('map=')).join('&'));
    if (fromHash.has('view')) select(+fromHash.get('view'), { fly: !INITIAL_HASH.includes('map=') });
  });
  let hovered = null; const tip = $('#tooltip');
  const hover = (e) => {
    const f = e.features[0]; if (!f) return;
    if (hovered !== null) map.setFeatureState({ source: 'views', id: hovered }, { hover: false });
    hovered = f.id; map.setFeatureState({ source: 'views', id: hovered }, { hover: true });
    map.getCanvas().style.cursor = 'pointer';
    const v = state.views[f.id];
    tip.innerHTML = `<b>${esc(countryName(v.country))}</b> · ${esc(continentName(v.continent))}<br>${T('frame')} ${fmt(v.first + 1)} · ${fmt(v.frames)} ${T('frames')}`;
    tip.style.left = e.point.x + 'px'; tip.style.top = e.point.y + 'px'; tip.hidden = false;
  };
  const leave = () => { if (hovered !== null) map.setFeatureState({ source: 'views', id: hovered }, { hover: false }); hovered = null; map.getCanvas().style.cursor = ''; tip.hidden = true; };
  for (const id of ['views-fill', 'centres']) { map.on('mousemove', id, hover); map.on('mouseleave', id, leave); }
  map.on('click', (e) => {
    const hit = map.queryRenderedFeatures([[e.point.x - 4, e.point.y - 4], [e.point.x + 4, e.point.y + 4]], { layers: ['centres', 'views-fill'] });
    if (hit.length) {
      // Smallest view under the cursor wins, so nested small views stay clickable.
      const best = hit.map((f) => state.views[f.properties.id]).sort((a, b) => a.area_km2 - b.area_km2)[0];
      select(best.id, { fly: false });
    } else showNearest(e.lngLat.lng, e.lngLat.lat, T('nearestHere'));
  });
}

function fitViews(views, padding = 60) {
  if (!views.length) return;
  let w = 180, s = 90, e = -180, n = -90;
  for (const v of views) for (const [x, y] of v.ring) { w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y); }
  const wide = window.innerWidth > 820;  // leave room for the floating details card
  const pad = wide ? { top: padding, bottom: padding + 50, left: padding, right: padding + 400 } : { top: 70, bottom: padding, left: padding / 2, right: padding / 2 };
  map.fitBounds([[w, s], [e, n]], { padding: pad, maxZoom: 11, duration: 900 });
}

// ---------------------------------------------------------------- selection & details
function select(id, { fly = true } = {}) {
  const v = state.views[id]; if (!v) return;
  state.selected = id;
  map.getSource('selected')?.setData({ type: 'FeatureCollection', features: [
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [v.ring] }, properties: {} },
    { type: 'Feature', geometry: { type: 'Point', coordinates: v.centre }, properties: {} }] });
  if (fly) fitViews([v], 120);
  const params = new URLSearchParams(location.hash.slice(1)); params.set('view', id);
  history.replaceState(null, '', '#' + [...params].map(([k, val]) => k === 'map' ? `map=${val}` : `${k}=${val}`).join('&'));
  renderDetails(); renderFrameList(true);
}

function methodText(v) { return v.method === 'land-overlap' ? T('methodLand') : v.method === 'open-ocean' ? T('methodOcean') : T('methodNearest'); }

function renderDetails() {
  const box = $('#details'); const v = state.views[state.selected];
  if (!v) { box.hidden = true; return; }
  const ranges = v.frame_ranges.map(([a, b]) => `<a href="${youtube(a)}" target="_blank" rel="noopener">#${fmt(a + 1)}${b > a ? '–' + fmt(b + 1) : ''}</a> <span class="muted">${timeOf(a)}</span>`).join(' · ');
  const shares = v.country_shares.length > 1 ? v.country_shares.map(([c, s]) => `${esc(state.lang === 'ja' ? state.data.countries_ja[state.data.countries.indexOf(c)] ?? c : c)} ${fmt(s * 100)}%`).join(', ') : null;
  const [lon, lat] = v.centre; const placeViews = state.byPlace.get(v.place) || [];
  const zoom = Math.max(4, Math.min(14, Math.round(Math.log2(40075 * Math.cos(lat * Math.PI / 180) / v.width_km) - 1)));
  const thumb = state.meta.thumbnails ? `<img src="data/thumbs/${String(v.id).padStart(5, '0')}.png" alt="" loading="lazy" width="324" height="120">
    <div class="caption"><span>${T('original')} · ${T('frame')} ${fmt(v.first + 1)}</span><span>${T('matched')}</span></div>` : '';
  box.innerHTML = `<div class="head"><div><h3>${esc(countryName(v.country))}${v.territory ? ` <span class="muted">· ${esc(v.territory)}</span>` : ''}</h3>
      <span class="muted">${esc(continentName(v.continent))}${v.sea ? ' · ' + esc(v.sea) : ''}</span></div>
      <button class="close" aria-label="Close">×</button></div>${thumb}
    <dl>
      <dt>${T('framesShown')}</dt><dd class="frames">${ranges}</dd>
      ${v.credits ? `<dt></dt><dd class="muted">${T('creditsNote')}</dd>` : ''}
      ${v.disputed ? `<dt>${T('disputedNote')}</dt><dd>${esc(v.disputed)} <span class="muted">(${esc(v.disputed_note || '')})</span></dd>` : ''}
      ${shares ? `<dt>${T('country')}</dt><dd>${shares}</dd>` : ''}
      <dt>${T('assignment')}</dt><dd>${methodText(v)}</dd>
      <dt>${T('nearest')}</dt><dd>${esc(v.nearest[0])}, ${esc(v.nearest[1])} · ${fmt(v.nearest[2])} km</dd>
      <dt>${T('centre')}</dt><dd>${Math.abs(lat).toFixed(5)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(5)}° ${lon >= 0 ? 'E' : 'W'}</dd>
      <dt>${T('width')}</dt><dd>${fmt(v.width_km, v.width_km < 10 ? 2 : 1)} km · ${T('area')} ${fmt(v.area_km2)} km²</dd>
      <dt>${T('rotation')}</dt><dd>${fmt(v.rotation, 1)}°${v.mirrored ? ` · <span class="mirror">${T('mirrored')}</span>` : ''}</dd>
      <dt>${T('matchScore')}</dt><dd>${v.miou === null ? T('na') : v.miou.toFixed(3)}</dd>
      <dt>${T('photo')}</dt><dd>${esc(v.imagery)} · ${esc(v.photo_date || '')}</dd>
      ${v.credits ? '' : `<dt>${T('place')}</dt><dd>#${v.place} · ${T('shareInPlace')(placeViews.length)} ${placeViews.length > 1 ? `<a href="#" data-place="${v.place}">${T('showPlace')}</a>` : ''}</dd>`}
    </dl>
    <div class="links"><a href="${youtube(v.first)}" target="_blank" rel="noopener">${T('watchAt')}</a>
      <a href="https://www.openstreetmap.org/?mlat=${lat.toFixed(5)}&mlon=${lon.toFixed(5)}#map=${zoom}/${lat.toFixed(5)}/${lon.toFixed(5)}" target="_blank" rel="noopener">${T('openOsm')}</a></div>`;
  box.hidden = false;
  box.querySelector('.close').onclick = () => { state.selected = null; map.getSource('selected').setData({ type: 'FeatureCollection', features: [] }); box.hidden = true; renderFrameList(); };
  box.querySelector('[data-place]')?.addEventListener('click', (e) => { e.preventDefault(); state.place = v.place; applyFilters(); fitViews(placeViews); });
}

function haversine(lon1, lat1, lon2, lat2) {
  const r = Math.PI / 180, a = Math.sin((lat2 - lat1) * r / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin((lon2 - lon1) * r / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(a));
}
function showNearest(lon, lat, title) {
  const list = state.views.filter((v) => state.continents.has(v.continent)).map((v) => [haversine(lon, lat, v.centre[0], v.centre[1]), v])
    .sort((a, b) => a[0] - b[0]).slice(0, 8);
  const box = $('#details'); state.selected = null; map.getSource('selected').setData({ type: 'FeatureCollection', features: [
    { type: 'Feature', geometry: { type: 'Point', coordinates: [lon, lat] }, properties: {} }] });
  box.innerHTML = `<div class="head"><h3>${title}</h3><button class="close" aria-label="Close">×</button></div><ul class="nearest">${list.map(([d, v]) =>
    `<li><a href="#" data-view="${v.id}">${esc(countryName(v.country))} · ${T('frame')} ${fmt(v.first + 1)}</a><span class="muted">${fmt(d, d < 10 ? 1 : 0)} ${T('kmAway')}</span></li>`).join('')}</ul>`;
  box.hidden = false;
  box.querySelector('.close').onclick = () => { box.hidden = true; map.getSource('selected').setData({ type: 'FeatureCollection', features: [] }); };
  box.querySelectorAll('[data-view]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); select(+a.dataset.view); }));
}

// ---------------------------------------------------------------- panels
function renderTiles() {
  const s = state.stats;
  $('#tiles').innerHTML = [[s.matched_frames, 'tMatched'], [s.views, 'tViews'], [s.places, 'tPlaces'], [s.countries, 'tCountries'], [s.continents, 'tContinents'],
    [s.area_union_km2 / 1e6, 'tArea', 1]].map(([n, k, d]) => `<div class="tile"><b>${fmt(n, d || 0)}</b><span>${T(k)}</span></div>`).join('');
}
function renderContinents() {
  const rows = state.stats.by_continent.slice().sort((a, b) => (a.continent === 'Open ocean') - (b.continent === 'Open ocean') || b.frames - a.frames);
  const peak = Math.max(...rows.map((r) => r.frames));
  $('#continents').innerHTML = rows.map((r) => { const k = state.data.continents.indexOf(r.continent);
    return `<button class="bar" data-continent="${k}" aria-pressed="${state.continents.has(k)}"><span class="name"><span class="dot" style="background:${colorOf(k)}"></span>${esc(continentName(k))}</span>
      <span class="track"><span class="fill" style="display:block;width:${(r.frames / peak * 100).toFixed(1)}%;background:${colorOf(k)}"></span></span>
      <span class="num">${fmt(r.frames)}</span><span class="num muted">${fmt(r.places)}</span></button>`; }).join('');
  $('#continents').querySelectorAll('[data-continent]').forEach((b) => b.onclick = () => {
    const k = +b.dataset.continent; state.continents.has(k) ? state.continents.delete(k) : state.continents.add(k);
    if (!state.continents.size) state.data.continents.forEach((_, i) => state.continents.add(i));
    renderContinents(); applyFilters(); renderCountries(); });
  const s = state.stats;
  $('#facts').innerHTML = [[T('fSmallest'), `${fmt(s.width_km_min, 1)} ${T('kmWide')}`], [T('fLargest'), `${fmt(s.width_km_max)} ${T('kmWide')}`],
    [T('fMedian'), `${fmt(s.width_km_median, 1)} ${T('kmWide')}`], [T('fArea'), state.lang === 'ja' ? `${fmt(s.area_union_km2 / 1e6, 1)} 百万km²・地球の表面積の${fmt(s.area_union_share_of_earth * 100, 1)}%`
      : `${fmt(s.area_union_km2 / 1e6, 1)} million km² · ${fmt(s.area_union_share_of_earth * 100, 1)} % of Earth`],
    [T('fMirrored'), `${fmt(s.mirrored_views)} ${T('of')} ${fmt(s.views)}`], [T('fWater'), fmt(s.water_assigned_views)]]
    .map(([a, b]) => `<div><span>${a}</span>${b}</div>`).join('');
}
function renderCountries() {
  const q = $('#country-search').value.trim().toLowerCase(); const { key, dir } = state.countrySort;
  const rows = state.countries.filter((c) => state.continents.has(c.continent))
    .filter((c) => !q || state.data.countries[c.k].toLowerCase().includes(q) || state.data.countries_ja[c.k].includes(q))
    .sort((a, b) => key === 'name' ? dir * countryName(a.k).localeCompare(countryName(b.k), state.lang) : dir * (a[key] - b[key]) || b.frames - a.frames);
  document.querySelectorAll('.country-row [data-sort]').forEach((b) => b.toggleAttribute('data-active', b.dataset.sort === key));
  $('#country-list').innerHTML = rows.map((c) => `<button class="row country-row" data-country="${c.k}" aria-current="${state.country === c.k}">
    <span class="name"><span class="dot" style="background:${colorOf(c.continent)}"></span>${esc(countryName(c.k))}</span>
    <span class="num">${fmt(c.frames)}</span><span class="num muted">${fmt(c.places)}</span><span class="num muted">${fmt(c.views)}</span></button>`).join('');
  $('#country-list').querySelectorAll('[data-country]').forEach((b) => b.onclick = () => {
    const k = +b.dataset.country; state.country = state.country === k ? null : k; state.place = null;
    applyFilters(); renderCountries(); renderFrameList(true);
    if (state.country !== null) fitViews(state.views.filter((v) => v.country === k));
  });
}
function renderFilters() {
  const box = $('#filters'); const chips = [];
  if (state.country !== null) chips.push(`<span class="chip">${T('showingCountry')}: ${esc(countryName(state.country))}<button data-clear="country" aria-label="${T('clear')}">×</button></span>`);
  if (state.place !== null) chips.push(`<span class="chip">${T('showingPlace')} #${state.place}<button data-clear="place" aria-label="${T('clear')}">×</button></span>`);
  box.innerHTML = chips.join(''); box.hidden = !chips.length;
  box.querySelectorAll('[data-clear]').forEach((b) => b.onclick = () => { state[b.dataset.clear] = null; applyFilters(); renderCountries(); renderFrameList(true); });
}

// Frames: every one of the video's frames, virtualised (only visible rows exist in the DOM).
function frameRows() {
  const q = state.frameFilter.trim().toLowerCase(); const total = state.meta.total_frames; const rows = [];
  const number = /^#?\d+$/.test(q) ? +q.replace('#', '') : null;
  for (let i = 0; i < total; i++) {
    const vid = state.frameView[i]; const v = vid === undefined ? null : state.views[vid];
    if (state.country !== null && (!v || v.country !== state.country)) continue;
    if (state.place !== null && (!v || v.place !== state.place)) continue;
    if (v && !state.continents.has(v.continent)) continue;
    if (q) {
      if (number !== null) { if (!String(i + 1).startsWith(String(number))) continue; }
      else if (!v || !(state.data.countries[v.country].toLowerCase().includes(q) || state.data.countries_ja[v.country].includes(q)
        || continentName(v.continent).toLowerCase().includes(q) || (v.territory || '').toLowerCase().includes(q))) continue;
    }
    rows.push(i);
  }
  return rows;
}
function renderFrameList(recompute = false) {
  const list = $('#frame-list'); if (!list) return;
  if (recompute || !state.frameRows.length) state.frameRows = frameRows();
  const rows = state.frameRows; const h = 34; list.querySelector('.spacer').style.height = rows.length * h + 'px';
  $('#frame-count').textContent = T('resultCount')(rows.length, state.meta.total_frames);
  const top = list.scrollTop, bottom = top + list.clientHeight; const a = Math.max(0, Math.floor(top / h) - 8), b = Math.min(rows.length, Math.ceil(bottom / h) + 8);
  let html = '';
  for (let n = a; n < b; n++) {
    const i = rows[n]; const vid = state.frameView[i]; const v = vid === undefined ? null : state.views[vid];
    const name = !v ? `<span class="muted">${T('creditsRow')}</span>`
      : `<span class="dot" style="background:${colorOf(v.continent)}"></span>${esc(countryName(v.country))}${v.territory ? ` <span class="muted">· ${esc(v.territory)}</span>` : ''}${v.credits ? ` <span class="muted">· ${T('creditsShort')}</span>` : ''}`;
    html += `<button class="row frame-row" style="top:${n * h}px" data-frame="${i}" aria-current="${v && state.selected === v.id}">
      <span class="num">${fmt(i + 1)}</span><span class="num muted">${timeOf(i)}</span><span class="name">${name}</span><span class="num muted">${v && state.frameScore[i] !== null ? state.frameScore[i].toFixed(3) : T('na')}</span></button>`;
  }
  list.querySelectorAll('.row').forEach((r) => r.remove()); list.insertAdjacentHTML('beforeend', html);
  list.querySelectorAll('[data-frame]').forEach((r) => r.onclick = () => { const vid = state.frameView[+r.dataset.frame]; if (vid !== undefined) select(vid); });
}

function renderAbout() {
  const ja = state.lang === 'ja';
  $('#about').className = 'about';
  $('#about').innerHTML = ja ? `
    <h2>このマップについて</h2><p>動画「<a href="https://youtu.be/nw02Enk8o1I">Bad Apple!! 全フレームを地球上の実在する場所で再現（衛星画像）</a>」の全フレームについて、影絵に一致した実在の陸と水の範囲（描画範囲）をすべて表示しています。枠の色は大陸です。フレーム番号と時刻は動画の表示と同じです。</p>
    <h2>国・大陸の判定</h2><p>各ビューの四辺形と Natural Earth 1:10m 行政区分（map units）の陸地の重なりを測地線面積で計算し、最も大きい国・地域を採用しました（事実上の境界。主権に関する立場を示すものではありません）。陸地が2%未満のビューは200海里以内の最も近い国、それより遠い場合は「外洋」です。ロシアはウラル山脈（東経60度）で欧州とアジアに分けています。重なり（IoU）が0.5を超えるビューは同じ「地点」として数えます。エンディング（フレーム 6,563〜6,955、1つの固定ビュー）は数えていません。</p>
    <h2>面積</h2><p>表示した範囲は、全ビューを重ね合わせた和集合の測地線面積です。複数のビューに映る場所も1回だけ数えます。8.3百万km²で、海を含む地球の表面積の約1.6%です。<br>訂正: Land &amp; Water 版の動画の統計では「AREA SHOWN 24.2 million km²」と表示していますが、これは各ビューの面積の合計で、重なりを重複して数えた値でした。正しくは上記の値です。</p>
    <h2>データ</h2><p>陸と水: G. E. Kindermann (2025) 全球 0.3秒角 陸水マスク, <a href="https://doi.org/10.5281/zenodo.14899246">doi:10.5281/zenodo.14899246</a>, CC BY 4.0 ／ 境界・地名: <a href="https://www.naturalearthdata.com/">Natural Earth</a>（パブリックドメイン）／ 背景地図: <a href="https://openfreemap.org">OpenFreeMap</a> © <a href="https://openmaptiles.org/">OpenMapTiles</a>, データ © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> ／ 地図表示: <a href="https://maplibre.org/">MapLibre GL JS</a>（BSD-3）</p>
    <p><a href="data/frames.csv" download>全フレームの一覧 (CSV)</a> · <a href="https://github.com/ikuto32/bad-apple-earth-map">ソースコード (GitHub)</a></p>` : `
    <h2>About this map</h2><p>Every frame of “<a href="https://youtu.be/nw02Enk8o1I">Bad Apple!! but every frame is a real place on Earth (Satellite Imagery)</a>”. Each outline is the exact real-world area (drawn extent) whose land and water matched a frame’s silhouette. Colours show the continent. Frame numbers and times match the video.</p>
    <h2>How countries are assigned</h2><p>Each view’s quadrilateral is intersected with Natural Earth 1:10m admin-0 map units; the country or territory with the largest geodesic land overlap is used (de facto boundaries; no position on sovereignty is implied). Views with under 2 % land take the nearest country within 200 nautical miles, otherwise “Open ocean”. Russia is split at the Urals (60° E). Views overlapping with IoU &gt; 0.5 count as one place. The ending credits (frames 6,563–6,955, one fixed view) are not counted.</p>
    <h2>Area</h2><p>The area covered is the geodesic area of the union of all views: a place shown in many views is counted once. It is 8.3 million km², about 1.6 % of Earth’s surface (oceans included).<br>Correction: the land &amp; water video’s statistics show “AREA SHOWN 24.2 million km²”. That was the sum of every view’s area, counting overlaps repeatedly; the figure above is the correct one.</p>
    <h2>Data</h2><p>Land/water: G. E. Kindermann (2025) global 0.3″ land/water mask, <a href="https://doi.org/10.5281/zenodo.14899246">doi:10.5281/zenodo.14899246</a>, CC BY 4.0 · Boundaries &amp; places: <a href="https://www.naturalearthdata.com/">Natural Earth</a> (public domain) · Basemap: <a href="https://openfreemap.org">OpenFreeMap</a> © <a href="https://openmaptiles.org/">OpenMapTiles</a>, data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> · Map rendering: <a href="https://maplibre.org/">MapLibre GL JS</a> (BSD-3)</p>
    <p><a href="data/frames.csv" download>Every frame as CSV</a> · <a href="https://github.com/ikuto32/bad-apple-earth-map">Source on GitHub</a></p>`;
}

function renderTimeline() {
  const t = $('#time'); t.max = String(state.meta.matched_frames); if (!t.dataset.init) { t.value = t.max; t.dataset.init = '1'; }
  const n = +t.value; $('#time-label').textContent = n >= state.meta.matched_frames ? T('timeAll') : `${T('timeUpTo')} ${fmt(n)} · ${timeOf(n)}`;
}

function applyLanguage() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => el.textContent = T(el.dataset.i18n));
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => el.placeholder = T(el.dataset.i18nPlaceholder));
  document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));
  renderTiles(); renderContinents(); renderCountries(); renderFrameList(); renderAbout(); renderTimeline(); renderDetails(); renderFilters();
}

function bind() {
  document.querySelectorAll('.tabs [data-tab]').forEach((b) => b.onclick = () => {
    document.querySelectorAll('.tabs [data-tab]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    document.querySelectorAll('.tab').forEach((s) => s.hidden = s.id !== 'tab-' + b.dataset.tab);
    if (b.dataset.tab === 'frames') renderFrameList();
  });
  document.querySelectorAll('.lang button').forEach((b) => b.onclick = () => { state.lang = b.dataset.lang; try { localStorage.setItem('lang', state.lang); } catch {} applyLanguage(); });
  $('#country-search').oninput = renderCountries;
  document.querySelectorAll('.country-row [data-sort]').forEach((b) => b.onclick = () => {
    const key = b.dataset.sort; state.countrySort = { key, dir: state.countrySort.key === key ? -state.countrySort.dir : key === 'name' ? 1 : -1 }; renderCountries(); });
  let pending; $('#frame-search').oninput = (e) => { clearTimeout(pending); pending = setTimeout(() => { state.frameFilter = e.target.value; $('#frame-list').scrollTop = 0; renderFrameList(true); }, 120); };
  $('#frame-list').addEventListener('scroll', () => requestAnimationFrame(() => renderFrameList()), { passive: true });
  window.addEventListener('resize', () => renderFrameList());
  const t = $('#time');
  t.oninput = () => { state.upTo = +t.value >= state.meta.matched_frames ? Infinity : +t.value; renderTimeline(); applyFilters(); };
  $('#play').onclick = () => {
    state.playing = !state.playing; $('#play').textContent = state.playing ? '❚❚' : '▶';
    if (state.playing && +t.value >= state.meta.matched_frames) t.value = '0';
    const step = () => { if (!state.playing) return; t.value = String(Math.min(state.meta.matched_frames, +t.value + 30)); t.oninput();
      if (+t.value >= state.meta.matched_frames) { state.playing = false; $('#play').textContent = '▶'; return; } setTimeout(step, 33); };
    step();
  };
  $('#near-me').onclick = () => {
    if (!navigator.geolocation) { alertBox(T('geoError')); return; }
    navigator.geolocation.getCurrentPosition((p) => { map.flyTo({ center: [p.coords.longitude, p.coords.latitude], zoom: 6 });
      showNearest(p.coords.longitude, p.coords.latitude, T('nearestYou')); }, () => alertBox(T('geoError')), { timeout: 10000 });
  };
}
function alertBox(text) { const box = $('#details'); box.innerHTML = `<p class="hint">${esc(text)}</p>`; box.hidden = false; }

(async () => {
  try { const saved = localStorage.getItem('lang'); if (saved && STRINGS[saved]) state.lang = saved; else if ((navigator.language || '').startsWith('ja')) state.lang = 'ja'; } catch {}
  await load(); bind(); initMap(); applyLanguage();
})();
