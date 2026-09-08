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

const FAQS = [
  {
    q: 'Where exactly is INNO100?',
    a: 'INNO100 is on Level 1 of the North Hall at Shenzhen Bay Culture Square, Nanshan District, Shenzhen. Come in through the northeast entrance, right next to Talent Park.',
  },
  {
    q: 'When are you open?',
    a: 'Every day from 10:00 AM to 10:00 PM, weekends and public holidays included.',
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
