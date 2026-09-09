import type { ReactNode } from 'react'
import VisitForm from './visit-form'

const SITE_URL = 'https://inno100.ai'

const DESCRIPTION =
  'Plan your visit to INNO100, the Global Innovation Flagship Store in Shenzhen. 100+ global innovations, hands-on demos, and new arrivals every week. Open daily 10 AM – 10 PM at Shenzhen Bay Culture Square.'

// Coordinates match the Store entry in components/StructuredData.tsx
const LAT = 22.51497
const LNG = 113.94034

// Google Maps for international visitors, Amap for anyone already on a
// China mobile network. Amap takes longitude before latitude.
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`
// Apple Maps opens natively on iOS and is backed by Amap data inside
// mainland China, so it resolves for visitors on either network.
const APPLE_MAPS_URL = `https://maps.apple.com/?ll=${LAT},${LNG}&q=INNO100`
const AMAP_URL = `https://uri.amap.com/marker?position=${LNG},${LAT}&name=INNO100`

/* ── Payment ─────────────────────────────────────────────────── */
const PAYMENT_MOBILE = [
  'WeChat Pay 微信支付',
  'WeChat Pay HK',
  'Alipay 支付宝',
  'UnionPay App 云闪付',
]

const PAYMENT_CARD = [
  'UnionPay cards issued anywhere in the world 中国银联',
  'Mastercard, Visa and American Express issued overseas',
]

/* ── Getting here ────────────────────────────────────────────── */
type Route = {
  name: string
  nameCn: string
  badges?: string[]
  distance?: string
  metro?: string
  metroCn?: string
  taxi?: string
}

type TransitSection = {
  id: string
  title: string
  titleCn: string
  defaultOpen?: boolean
  routes: Route[]
  others?: { items: string[]; note: string }
}

const TRANSIT: TransitSection[] = [
  {
    id: 'metro',
    title: 'Getting to INNO100 by Metro',
    titleCn: '搭乘地铁 → INNO100',
    defaultOpen: true,
    routes: [
      {
        name: 'Line 13 · Talent Park Station',
        nameCn: '13号线 人才公园站',
        badges: ['Top Choice', 'Closest'],
        metro: 'Exit B1 → approx. 5-min walk to INNO100',
        metroCn: 'B1口 → 步行约5分钟到店',
      },
      {
        name: 'Line 11 · Houhai Station',
        nameCn: '11号线 后海站',
        metro: 'Exit K2 → approx. 10-min walk to INNO100',
        metroCn: 'K2口 → 步行约10分钟到店',
      },
    ],
  },
  {
    id: 'ports',
    title: 'From Shenzhen Ports',
    titleCn: '深圳口岸 → INNO100',
    routes: [
      {
        name: 'Shenzhen Bay Port',
        nameCn: '深圳湾口岸',
        badges: ['Closest to INNO100', 'Recommended'],
        distance: 'Approx. 2.6 km from INNO100',
        metro:
          'Line 13, Shenzhen Bay Port Station → Talent Park Station, Exit B1 → approx. 5-min walk',
        metroCn: '13号线深圳湾口岸站 → 人才公园站B1口 → 步行约5分钟到店',
        taxi: 'Approx. 10 min',
      },
      {
        name: 'Huanggang Port',
        nameCn: '皇岗口岸',
        badges: ['Open 24 Hours'],
        distance: 'Approx. 17 km from INNO100',
        metro:
          'Line 7, Huanggang Port Station → transfer to Line 11 at Chegongmiao → Houhai Station, Exit K → approx. 10-min walk',
        metroCn: '7号线皇岗口岸站 → 车公庙换乘11号线 → 后海站K口 → 步行约10分钟到店',
        taxi: 'Approx. 25–30 min',
      },
    ],
    others: {
      items: [
        'Futian Port 福田口岸',
        'Luohu Port 罗湖口岸',
        'Liantang Port 莲塘口岸',
        'Wenjindu Port 文锦渡口岸',
        'Shekou Cruise Homeport 蛇口邮轮母港',
      ],
      note: 'Multiple passenger entry ports are available in Shenzhen. 深圳设有多个旅客入境口岸，可按行程选择。',
    },
  },
  {
    id: 'airport',
    title: 'Getting to INNO100 from the Airport',
    titleCn: '飞机抵达 → INNO100',
    routes: [
      {
        name: "Shenzhen Bao'an International Airport",
        nameCn: '深圳宝安国际机场',
        distance: 'Approx. 20 km from INNO100',
        metro:
          'Line 11 from Airport Station → Houhai Station, Exit K2 → approx. 10-min walk',
        metroCn: '机场站乘11号线 → 后海站K2口 → 步行约10分钟到店',
        taxi: 'Approx. 25–30 min',
      },
    ],
  },
  {
    id: 'rail',
    title: 'Getting to INNO100 from Railway Stations',
    titleCn: '高铁抵达 → INNO100',
    routes: [
      {
        name: 'Futian Railway Station',
        nameCn: '福田站',
        badges: ['Direct Metro'],
        metro: 'Line 11 → Houhai Station, Exit K2 → approx. 10-min walk',
        metroCn: '11号线福田站 → 后海站K2口 → 步行约10分钟到店',
        taxi: 'Approx. 20–25 min',
      },
      {
        name: 'Shenzhen North Railway Station',
        nameCn: '深圳北站',
        metro:
          'Line 4 → transfer to Line 2 at Civic Center → Houhai Station, Exit K2 → approx. 10-min walk',
        metroCn: '4号线深圳北站 → 市民中心站换乘2号线 → 后海站K2口 → 步行约10分钟到店',
        taxi: 'Approx. 30–40 min',
      },
    ],
    others: {
      items: [
        'Shenzhen Railway Station 深圳站',
        'Shenzhen East Railway Station 深圳东站',
        'Shenzhen Pingshan Railway Station 深圳坪山站',
        'Guangmingcheng Railway Station 光明城站',
      ],
      note: 'Shenzhen has several railway stations. Choose your route based on your arrival station. 深圳有多个铁路客运站，可根据实际到达车站选择路线。',
    },
  },
]

const DRIVING = {
  taxi: {
    label: 'Taxi 打车',
    destination: 'INNO100 Global Innovation Flagship Store',
    destinationCn: 'INNO100全球创新旗舰店',
  },
  car: {
    label: 'Driving 自驾',
    destination: 'Shenzhen Bay Culture Square Parking',
    destinationCn: '深圳湾文化广场停车场',
  },
  note: 'The taxi drop-off point and the parking entrance are at the same location. 打车下客点与停车场入口位于同一位置。',
}

const FAQS = [
  {
    q: 'Where exactly is INNO100?',
    a: 'INNO100 is on Level 1 of the North Hall at Shenzhen Bay Culture Square, Nanshan District, Shenzhen. Come in through the northeast entrance, right next to Talent Park.',
  },
  {
    q: 'Which metro station is closest?',
    a: 'Talent Park Station on Line 13, Exit B1 — about a 5-minute walk. Houhai Station on Line 11, Exit K2, is about a 10-minute walk. If you are coming from Hong Kong, Shenzhen Bay Port is only 2.6 km away.',
  },
  {
    q: 'When are you open?',
    a: 'Every day from 10:00 AM to 10:00 PM, weekends and public holidays included.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'RMB cash, plus WeChat Pay (including WeChat Pay HK), Alipay and UnionPay App. For cards we accept UnionPay issued anywhere in the world, and Mastercard, Visa and American Express issued overseas.',
  },
  {
    q: 'Is there an admission fee?',
    a: 'No. Admission to INNO100 is free.',
  },
  {
    q: 'Do I need to book in advance?',
    a: 'No booking required — you can walk straight in during opening hours. If you do fill in the Book Your Visit form above, we will email you a visitor guide before you arrive.',
  },
  {
    q: 'How long should I plan for a visit?',
    a: 'Plan for at least an hour. More than 60 percent of our visitors stay longer than an hour once they start trying things out.',
  },
  {
    q: 'What can I actually try in the store?',
    a: 'Over 112 global brands across 1,100 square metres, including hands-on innovations like a string-less guitar, robot dogs and an AI tennis robot. New arrivals land every week, so the floor looks different month to month.',
  },
  {
    q: 'Is there English-language help in the store?',
    a: 'Yes. We have English-speaking staff on the floor, and every product label and price tag is bilingual. If you would like dedicated English assistance for your visit, add a note in the Book Your Visit form above and someone will get in touch.',
  },
  {
    q: 'Is INNO100 a good stop for international visitors?',
    a: 'Yes. We welcome more than 100 international guests a day, and INNO100 is the first officially authorised Kickstarter store in China.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
}

export const metadata = {
  title: 'Plan Your China Tech Visit | INNO100',
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/visit`,
  },
  openGraph: {
    title: 'Plan Your China Tech Visit | INNO100',
    description: DESCRIPTION,
    type: 'website',
    url: `${SITE_URL}/visit`,
    siteName: 'INNO100',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plan Your China Tech Visit | INNO100',
    description: DESCRIPTION,
  },
}

/* ── Local components ────────────────────────────────────────── */
// Native <details> keeps every route in the HTML even while collapsed, so
// search engines and AI assistants can read it without running JavaScript.
function Accordion({
  title,
  titleCn,
  defaultOpen,
  children,
}: {
  title: string
  titleCn: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  return (
    <details
      open={defaultOpen}
      className="group border border-gray-200 rounded-lg bg-white"
    >
      <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-semibold text-lg">{title}</span>
          <span className="block text-sm text-gray-500 mt-0.5">{titleCn}</span>
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 text-2xl text-gray-400 transition-transform duration-200 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="px-6 pb-6 pt-1">{children}</div>
    </details>
  )
}

function RouteCard({ route }: { route: Route }) {
  return (
    <div className="py-5 border-t border-gray-100 first:border-t-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h4 className="font-semibold">{route.name}</h4>
        <span className="text-sm text-gray-500">{route.nameCn}</span>
      </div>

      {route.badges && (
        <div className="flex flex-wrap gap-2 mt-2">
          {route.badges.map((badge) => (
            <span
              key={badge}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700"
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      {route.distance && (
        <p className="text-sm text-gray-500 mt-2">{route.distance}</p>
      )}

      {route.metro && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-900">Metro 地铁</p>
          <p className="text-sm text-gray-600 mt-0.5">{route.metro}</p>
          {route.metroCn && (
            <p className="text-sm text-gray-500 mt-0.5">{route.metroCn}</p>
          )}
        </div>
      )}

      {route.taxi && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-900">Taxi 打车</p>
          <p className="text-sm text-gray-600 mt-0.5">{route.taxi}</p>
        </div>
      )}
    </div>
  )
}

export default function Visit() {
  return (
    <div className="pt-16">
      <section className="py-12 bg-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Plan Your China Tech Visit
          </h1>
          <p className="text-lg text-gray-600">
            Come experience the future of consumer technology, hands-on in Shenzhen.
            100+ global innovations. Real demos. New arrivals every week.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Visitor Information</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Location</h3>
                  <p className="text-gray-600">
                    Level 1, North Hall<br />
                    Shenzhen Bay Culture Square<br />
                    Nanshan District, Shenzhen, China<br />
                    <span className="text-sm">Northeast entrance, next to Talent Park</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-3">
                    Show this to a taxi driver:<br />
                    <span className="text-gray-700">
                      深圳市南山区深圳湾文化广场北馆 L1 层（东北门，近人才公园）
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <a
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm px-4 py-2 border border-gray-300 rounded hover:border-black transition"
                    >
                      Open in Google Maps
                    </a>
                    <a
                      href={APPLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm px-4 py-2 border border-gray-300 rounded hover:border-black transition"
                    >
                      Open in Apple Maps
                    </a>
                    <a
                      href={AMAP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm px-4 py-2 border border-gray-300 rounded hover:border-black transition"
                    >
                      Open in Amap (高德)
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Hours</h3>
                  <p className="text-gray-600">
                    Monday - Sunday: 10:00 AM - 10:00 PM<br />
                    <span className="text-sm">Open every day, holidays included</span>
                  </p>
                </div>
              </div>
            </div>

            <VisitForm />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Getting Here</h2>
          <p className="text-gray-600 mb-10">
            INNO100 is in Nanshan, right next to Talent Park. Pick the route
            that matches how you are arriving in Shenzhen.
          </p>

          <div className="space-y-4">
            {TRANSIT.map((section) => (
              <Accordion
                key={section.id}
                title={section.title}
                titleCn={section.titleCn}
                defaultOpen={section.defaultOpen}
              >
                {section.routes.map((route) => (
                  <RouteCard key={route.name} route={route} />
                ))}

                {section.others && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      {section.others.note}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                      {section.others.items.map((item) => (
                        <li key={item} className="text-sm text-gray-500">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Accordion>
            ))}
            <Accordion
              title="Getting to INNO100 by Taxi or Car"
              titleCn="打车 / 自驾 → INNO100"
            >
              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div>
                  <p className="font-semibold">{DRIVING.taxi.label}</p>
                  <p className="text-sm text-gray-500 mt-2">Destination 导航至</p>
                  <p className="text-sm text-gray-700">
                    {DRIVING.taxi.destination}
                  </p>
                  <p className="text-sm text-gray-500">
                    {DRIVING.taxi.destinationCn}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">{DRIVING.car.label}</p>
                  <p className="text-sm text-gray-500 mt-2">Destination 导航至</p>
                  <p className="text-sm text-gray-700">
                    {DRIVING.car.destination}
                  </p>
                  <p className="text-sm text-gray-500">
                    {DRIVING.car.destinationCn}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-5 pt-5 border-t border-gray-100">
                {DRIVING.note}
              </p>
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Payment</h2>
          <p className="text-gray-600 mb-10">
            INNO100 accepts RMB cash and the cashless methods below, online and
            in-store.
            <span className="block text-sm text-gray-500 mt-1">
              INNO100支持人民币现金及以下非现金支付方式，线上及线下渠道均支持。
            </span>
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg">Mobile Payment</h3>
              <p className="text-sm text-gray-500 mb-4">移动支付</p>
              <ul className="space-y-2">
                {PAYMENT_MOBILE.map((method) => (
                  <li key={method} className="text-gray-700 text-sm">
                    {method}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg">Card Payment</h3>
              <p className="text-sm text-gray-500 mb-4">刷卡支付</p>
              <ul className="space-y-2">
                {PAYMENT_CARD.map((method) => (
                  <li key={method} className="text-gray-700 text-sm">
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Some promotions may require a specific payment method. Final
            eligibility is subject to campaign rules and payment verification.
            <span className="block mt-1">
              部分优惠需使用指定支付方式，具体以活动规则及支付核验结果为准。
            </span>
          </p>
        </div>
      </section>

      <section className="py-16 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Before You Come</h2>
          <div className="space-y-8">
            {FAQS.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  )
}
