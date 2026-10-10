import Image from 'next/image'
import Link from 'next/link'
import MenuTabs from './menu-tabs'
import {
  getProductsByCategory,
  PRODUCT_COUNT,
  type Product,
} from '@/lib/products'

const SITE_URL = 'https://inno100.ai'

/**
 * Full Catalogue is hidden for review. The ItemList structured data is gated
 * behind the same flag on purpose: marking up 151 products that no visitor can
 * see is exactly what Google's structured data guidelines prohibit, and risks
 * a manual action against the site. Restoring the section restores the schema.
 */
const SHOW_CATALOGUE = false

const TITLE = 'Explore Products | INNO100'

const DESCRIPTION =
  `Browse the ${PRODUCT_COUNT} global innovations on the floor at INNO100 in Shenzhen — ` +
  'AI hardware, desktop robots, AR and VR glasses, music tech and the maker workshop. ' +
  'Free to visit, open daily 10:00–22:00.'

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/menu`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: `${SITE_URL}/menu`,
    siteName: 'INNO100',
    // Points at app/opengraph-image.tsx. Needed explicitly: declaring an
    // openGraph object here replaces the file convention rather than extending
    // it, so without this line the page shares as a bare link.
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
}

/* ── Local components ────────────────────────────────────────── */

const CARD_STYLE = {
  background: 'rgba(255, 255, 255, 0.72)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
}

function DemoBadge() {
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-900 text-white">
      Try it in store
    </span>
  )
}

function CatalogueRow({ product }: { product: Product }) {
  return (
    <li className="py-4 border-t border-gray-200/70 first:border-t-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h4 className="font-medium text-gray-900">{product.nameEn}</h4>
        <span className="text-sm text-gray-500">{product.name}</span>
        {product.demo && <DemoBadge />}
      </div>
      {product.valueLine && (
        <p className="mt-1.5 text-sm text-gray-600">{product.valueLine}</p>
      )}
    </li>
  )
}

/**
 * Hover (desktop) or tap (touch, via :focus-within on the wrapping label-less
 * button) reveals specs, use cases, and the endorsement — collapsed state
 * only shows image, brand/name, and the value line, matching the brief's
 * "preview first, details on interaction" pattern rather than a click-through
 * to a separate page.
 */
function PickCard({ pick }: { pick: Pick }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-300" style={CARD_STYLE} tabIndex={0}>
      <div className="aspect-[4/3] relative bg-gray-100">
        {pick.image ? (
          <Image
            src={pick.image}
            alt={`${pick.brand} ${pick.name}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Image coming soon
          </div>
        )}
        <span
          className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${
            pick.availability === 'in-store'
              ? 'bg-gray-900 text-white'
              : 'bg-white/90 text-gray-700'
          }`}
        >
          {pick.availability === 'in-store' ? 'In-Store Now' : 'Coming Soon'}
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs uppercase tracking-wide text-gray-500">{pick.brand}</p>
        <h3 className="mt-1 font-semibold text-lg text-gray-900">{pick.name}</h3>
        <p className="mt-2 text-sm text-gray-700">{pick.valueLine}</p>

        {/* Revealed on hover/focus — collapsed by default so the grid reads as
            a scannable preview, not a wall of specs. */}
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] transition-all duration-300 ease-out">
          <div className="overflow-hidden">
            <div className="mt-4 pt-4 border-t border-gray-200/70 space-y-3">
              <ul className="space-y-1">
                {pick.specs.map((spec, i) => (
                  <li key={i} className="text-xs text-gray-600 flex gap-2">
                    <span className="text-gray-400">•</span>
                    {spec}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-700">Best for:</span> {pick.useCases}
              </p>
              {pick.endorsement && (
                <p className="text-xs text-gray-600 italic">{pick.endorsement}</p>
              )}
              {pick.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {pick.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── INNO100 Picks ───────────────────────────────────────────── */

interface Pick {
  id: string
  brand: string
  name: string
  valueLine: string
  specs: string[]
  useCases: string
  endorsement?: string
  tags: string[]
  availability: 'in-store' | 'coming-soon'
  image: string | null
}

const picks: Pick[] = [
  {
    id: 'strutt-ev1',
    brand: 'Strutt',
    name: 'ev¹',
    valueLine: 'A self-driving personal scooter that navigates tight spaces on its own — mobility that drives itself.',
    specs: [
      'Autonomous navigation in confined spaces',
      '360° situational awareness',
      'CES Innovation Award + Red Dot Design Award winner',
    ],
    useCases: 'Daily commuting, campus and office navigation, hands-free personal transport',
    endorsement: '"This self-driving scooter could transform personal mobility." — CNET',
    tags: ['CES Award', 'Red Dot Design Award'],
    availability: 'in-store',
    image: '/images/picks/strutt-ev1.png',
  },
  {
    id: 'eight-sleep-pod6',
    brand: 'Eight Sleep',
    name: 'Pod 6',
    valueLine: 'A smart mattress system that heats or cools each side of the bed independently while tracking your sleep.',
    specs: [
      'Temperature range 12°C–43°C per side',
      '20% faster thermal response',
      'Up to 45% snoring reduction with the Base add-on',
    ],
    useCases: 'Couples with mismatched temperature needs, athletic recovery, pregnancy and menopause, snoring, jet lag',
    endorsement: '"Really dialed in my sleep with Eight Sleep and Oura." — Mark Zuckerberg',
    tags: ['12+ PhD research team', '50+ clinical studies'],
    availability: 'in-store',
    image: '/images/picks/eight-sleep-pod6.png',
  },
  {
    id: 'soundcore-nebula-x1-pro',
    brand: 'soundcore',
    name: 'Nebula X1 Pro',
    valueLine: 'A portable 4K laser projector with built-in surround sound and wheels — a mobile theater you can roll anywhere.',
    specs: [
      '3,500 ANSI lumens, true 4K triple laser engine',
      '400W Dolby Atmos 7.1.4 surround sound',
      '5,000:1 native contrast ratio',
    ],
    useCases: 'Outdoor movie nights, backyard parties, karaoke, group gatherings',
    endorsement: '"The picture quality is great... everything is automated." — verified buyer',
    tags: ['ISF & Dolby Vision certified'],
    availability: 'in-store',
    image: '/images/picks/soundcore-nebula-x1-pro.png',
  },
  {
    id: 'hypershell',
    brand: 'Hypershell',
    name: 'Exoskeleton',
    valueLine: '[Placeholder — copy pending final product selection.]',
    specs: ['[Placeholder]', '[Placeholder]', '[Placeholder]'],
    useCases: '[Placeholder]',
    tags: [],
    availability: 'coming-soon',
    image: null,
  },
  {
    id: 'pick-5',
    brand: '[Brand]',
    name: '[Placeholder]',
    valueLine: '[Placeholder — content coming soon.]',
    specs: ['[Placeholder]', '[Placeholder]', '[Placeholder]'],
    useCases: '[Placeholder]',
    tags: [],
    availability: 'coming-soon',
    image: null,
  },
  {
    id: 'pick-6',
    brand: '[Brand]',
    name: '[Placeholder]',
    valueLine: '[Placeholder — content coming soon.]',
    specs: ['[Placeholder]', '[Placeholder]', '[Placeholder]'],
    useCases: '[Placeholder]',
    tags: [],
    availability: 'coming-soon',
    image: null,
  },
]

/* ── Page ────────────────────────────────────────────────────── */
export default function MenuPage() {
  const groups = getProductsByCategory()

  /* An ItemList of Product entities, so assistants answering "what can I try
     at INNO100" get named products rather than a wall of images. Prices are
     deliberately left out: the export carries at least one placeholder value
     and the figures are not confirmed current. */
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Products at INNO100 Shenzhen',
    description: DESCRIPTION,
    url: `${SITE_URL}/menu`,
    numberOfItems: PRODUCT_COUNT,
    itemListElement: groups
      .flatMap((group) => group.products)
      .map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.nameEn,
          alternateName: product.name,
          category: product.categoryLabel,
          ...(product.valueLine ? { description: product.valueLine } : {}),
        },
      })),
  }

  const picksSection = (
    <div className="px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-light text-gray-900">
          INNO100 Picks
        </h2>
        <p className="mt-3 max-w-3xl text-gray-600">
          The innovations worth trying in real life — a monthly selection of
          global products worth experiencing hands-on.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((pick) => (
            <PickCard key={pick.id} pick={pick} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700">
            See it. Try it. Take the future home.
          </p>
          <Link
            href="/visit"
            className="mt-4 inline-block px-6 py-2.5 rounded-lg font-medium text-white bg-gray-900 hover:bg-gray-700 transition"
          >
            Plan Your Visit
          </Link>
        </div>
      </div>
    </div>
  )

  const catalogueSection = (
    <div className="px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-light text-gray-900">
          Full Catalogue
        </h2>
        <p className="mt-3 max-w-3xl text-gray-600">
          All {PRODUCT_COUNT} products currently listed, grouped by category.
          Stock changes week to week — message us if you want to check a
          specific product before you travel.
        </p>

        <div className="mt-12 space-y-10">
          {groups.map((group) => (
            <section key={group.key} className="rounded-2xl p-6" style={CARD_STYLE}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {group.label}
                </h3>
                <span className="text-sm text-gray-500">{group.labelCn}</span>
                <span className="text-sm text-gray-400">
                  {group.products.length}
                </span>
              </div>

              <ul className="mt-4">
                {group.products.map((product) => (
                  <CatalogueRow key={product.id} product={product} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <MenuTabs
        picks={picksSection}
        catalogue={SHOW_CATALOGUE ? catalogueSection : null}
      />
      {SHOW_CATALOGUE && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
    </>
  )
}
