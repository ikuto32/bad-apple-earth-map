# Bad Apple!! / Real Earth — 場所マップ

[English](README.md)

サイト: https://bad-apple-earth-map.ikutotest.xyz/ · 動画: https://youtu.be/kB3fzm_Un2g

動画「Bad Apple!! but every frame is real land & water on Earth」の全フレームの場所を示す地図です。アニメの各フレームは、地球上の実在する陸と水の範囲にマッチしています。このサイトでは、その全ビューの範囲（描画範囲）を地図に描き、国・地域、大陸、フレームを示します。

- **地図:** 全ビューの枠を大陸ごとの色で表示します。クリックすると、フレーム（YouTubeの該当時刻へのリンク付き）、国・地域、大陸、最寄りの集落、幅、回転、鏡像、一致度、撮影日、元のフレームとマッチした陸と水のサムネイルを表示します。
- **国・地域:** 全138の国・地域を一覧にします。並べ替えと検索ができ、英語と日本語の名前を切り替えられます。
- **フレーム:** 動画の全6,955フレームを、スクロールと検索ができる1つの一覧で表示します。同じ内容を [`web/data/frames.csv`](web/data/frames.csv) でも提供しています。
- 大陸での絞り込み、動画順のタイムライン再生、「現在地の近くのフレーム」（位置情報はブラウザ内だけで使います）、地図上の任意の地点に近いビューの表示、`#view=` の共有リンクがあります。

静的サイトです。ビルド処理、サーバー側のコード、トラッキングはありません。MapLibre GL JS は同梱し、背景地図は OpenFreeMap から読み込みます。

## 数値

| | |
|---|---|
| マッチしたフレーム | 6,562（エンディングのフレーム 6,563〜6,955 は統計表示） |
| 異なるビュー | 6,355 |
| 地点（IoU 0.5 超で重なるビューをまとめたもの） | 1,680 |
| 国・地域 | 138 |
| 大陸 | 7 |

## 国と大陸の判定

各ビューの四辺形と Natural Earth 1:10m 行政区分（map units）の重なりを測地線面積で計算し、陸地の重なりが最も大きい国・地域を採用します。すべての国の割合も保持します。陸地が2%未満のビューは、200海里以内で最も近い国とします。ロシア（Natural Earth では1つの単位で「ヨーロッパ」）はウラル山脈（東経60度）で分けます。Natural Earth の「Seven seas」の離島（アゾレス諸島、モルディブ、モーリシャス）は国連 M49 の地域を使います。ビューの陸地の大半が Natural Earth の係争地にある場合は、その地域名を表示します。境界は Natural Earth の事実上の境界であり、主権に関する立場を示すものではありません。

## ファイル

| パス | 内容 |
|---|---|
| `web/index.html`, `web/app.js`, `web/style.css` | サイト本体 |
| `web/data/views.json` | 全ビュー: 四隅、フレーム範囲、国、大陸、地域、地点、幅、回転、鏡像、mIoU、最寄りの集落、撮影日、係争地、国ごとの割合 |
| `web/data/frames.json`, `web/data/frames.csv` | 各フレームのビュー。CSV は全6,955フレームの全項目 |
| `web/data/stats.json` | 大陸別・国別の集計 |
| `web/data/thumbs/` | ビューごとの 324×120 サムネイル（元のフレームとマッチした陸と水） |
| `web/vendor/maplibre-gl-5.24.0/` | MapLibre GL JS とそのライセンス |
| `tools/serve-web.mjs` | ローカル確認用サーバー: `node tools/serve-web.mjs 8125` |
| `tools/publish-cloudflare.ps1` | Cloudflare への公開 |

データファイルは動画プロジェクトの処理（`badapple_coastline.landwater_web`）から書き出しています。この処理はこのリポジトリには含まれません。

## 公開

静的アセットだけの Cloudflare Worker として、独自ドメインで公開します（`workers.dev` とプレビュー用URLは無効）。ドメインは同じ Cloudflare アカウントのゾーンである必要があります。最初に一度 `npx wrangler@4.151.2 login` でログインしてから、次を実行します。

```powershell
.\tools\publish-cloudflare.ps1 -Domain bad-apple-earth-map.ikutotest.xyz
```

## ライセンスとクレジット

コード（`web/*.html`, `web/*.js`, `web/*.css`, `tools/`）は MIT License です（[LICENSE](LICENSE)）。データは各提供元の条件に従います。

- 陸と水: G. E. Kindermann (2025), *Global Land / Water Mask Map with 0.3 arc sec. (10 m) Resolution*, v1, [doi:10.5281/zenodo.14899246](https://doi.org/10.5281/zenodo.14899246), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。サムネイルは切り抜き、リサンプル、回転、表示どおりの鏡像化をしています。
- 境界・地名・大陸: Made with [Natural Earth](https://www.naturalearthdata.com/)（パブリックドメイン）。
- 背景地図（表示時に読み込み）: [OpenFreeMap](https://openfreemap.org) © [OpenMapTiles](https://openmaptiles.org/)、データ © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)（ODbL）。
- [MapLibre GL JS](https://maplibre.org/) 5.24.0、BSD-3-Clause（`web/vendor/maplibre-gl-5.24.0/LICENSE.txt`）。
- 元のフレームのサムネイルは、あにら氏による『Bad Apple!!』影絵PV（「Bad Apple!! feat. nomico」Alstroemeria Records、原曲 ZUN／東方Project）からのものです。権利は各制作者にあり、MIT License の対象ではありません。

コードの一部に AI（Anthropic の Claude）を利用しています。
