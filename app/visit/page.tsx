import VisitForm from './visit-form'

const SITE_URL = 'https://inno100.ai'

const DESCRIPTION =
  'Plan your visit to INNO100, the Global Innovation Flagship Store in Shenzhen. 100+ global innovations, hands-on demos, and new arrivals every week. Open daily 10 AM – 10 PM at Shenzhen Bay Culture Square.'

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
                    Shenzhen Bay Culture Square<br />
                    Nanshan District<br />
                    Shenzhen, China
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Hours</h3>
                  <p className="text-gray-600">
                    Monday - Sunday: 10:00 AM - 10:00 PM
                  </p>
                </div>
              </div>
            </div>

            <VisitForm />
          </div>
        </div>
      </section>
    </div>
  )
}
