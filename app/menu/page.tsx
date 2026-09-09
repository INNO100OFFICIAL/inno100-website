import MenuTabs from './menu-tabs'
import {
  getFeaturedProducts,
  getProductsByCategory,
  PRODUCT_COUNT,
  type Product,
} from '@/lib/products'

const SITE_URL = 'https://inno100.ai'

/**
 * Featured Products is hidden until its one-line value propositions are
 * approved — 18 of the 20 cards have no copy yet, so the grid reads as empty.
 * The section is still built below; flip this to true to bring it back.
 * Hiding it does not affect the ItemList structured data, which is built from
 * the full catalogue.
 */
const SHOW_FEATURED = false

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

function FeaturedCard({ product }: { product: Product }) {
  return (
    <div className="rounded-2xl p-6 flex flex-col" style={CARD_STYLE}>
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {product.categoryLabel}
      </p>

      <h3 className="mt-2 font-semibold text-lg text-gray-900">
        {product.nameEn}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{product.name}</p>

      {product.valueLine && (
        <p className="mt-3 text-sm text-gray-700">{product.valueLine}</p>
      )}

      {product.demo && (
        <div className="mt-4 pt-3 border-t border-gray-200/70">
          <DemoBadge />
        </div>
      )}
    </div>
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

/* ── Page ────────────────────────────────────────────────────── */
export default function MenuPage() {
  const featured = getFeaturedProducts()
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

  const featuredSection = (
    <div className="px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-light text-gray-900">
          Featured Products
        </h2>
        <p className="mt-3 max-w-3xl text-gray-600">
          A selection of what visitors come to see — AI hardware, desktop
          robots, AR and VR glasses, music tech and the maker workshop. New
          arrivals land every week, so the floor changes month to month.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <FeaturedCard key={product.id} product={product} />
          ))}
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
        featured={SHOW_FEATURED ? featuredSection : null}
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
