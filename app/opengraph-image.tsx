import { ImageResponse } from 'next/og'

/*
 * Sitewide share image. Next.js applies this file to every route that does not
 * set openGraph.images itself, so the eight static pages stop sharing as a bare
 * link while /news/[slug] keeps its own article photo — an explicit setting in
 * page metadata wins over this convention.
 *
 * Drawn rather than photographed on purpose. The photos in public/images are
 * 2–11 MB and 3800–6200 px wide; a share image wants 1200×630 and a small file,
 * and generating it here means there is no second asset to keep in sync when
 * the wording changes. No webfont is fetched, so a build never depends on a
 * font CDN being reachable.
 */

export const alt = 'INNO100 — Kickstarter\'s first authorized offline retail experience in China'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/* Edge, not the default Node runtime. The Node build of @vercel/og resolves its
   wasm module with fileURLToPath, which throws "Invalid URL" on a Windows path,
   so a build on this machine fails while the same code builds fine on Vercel's
   Linux runners. The edge bundle loads that module differently and builds on
   both, which keeps local builds usable as a check before pushing. */
export const runtime = 'edge'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 90px',
          background: '#000',
          color: '#fff',
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 10,
            textTransform: 'uppercase',
            color: '#5FC8DE',
          }}
        >
          INNO100
        </div>

        <div
          style={{
            fontSize: 68,
            lineHeight: 1.15,
            marginTop: 28,
            maxWidth: 900,
          }}
        >
          Global Innovation Flagship Store
        </div>

        <div
          style={{
            fontSize: 32,
            lineHeight: 1.4,
            marginTop: 28,
            color: '#B8B8B8',
            maxWidth: 860,
          }}
        >
          Kickstarter&apos;s first authorized offline retail experience in China
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 26,
            marginTop: 44,
            color: '#8A8A8A',
          }}
        >
          <span>Shenzhen</span>
          <span style={{ margin: '0 14px' }}>·</span>
          <span>Open daily 10:00–22:00</span>
          <span style={{ margin: '0 14px' }}>·</span>
          <span>inno100.ai</span>
        </div>
      </div>
    ),
    size,
  )
}
