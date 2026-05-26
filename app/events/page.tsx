'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Events() {
  const events = [
    {
      id: 1,
      title: '2025 Kickstarter China Creator Summit',
      location: 'Shenzhen',
      date: '2025-12-06',
      description: 'For the first time, this annual gathering had a physical home, bringing together creators, brand founders, and crowdfunding service providers. Four globally innovative products made their offline debut, while an open-air cinema and a live performance by LAVA STUDIO created a relaxed and vibrant atmosphere.',
      source: 'INNO100 Team',
      image: '/images/events/1.png',
    },
  ]

  return (
    <div className="pt-16">
      <section className="py-12 bg-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            100 Events
          </h1>
          <p className="text-lg text-gray-600">
            INNO100 is committed to creating 100 featured exchange events that connect brands, users, and creators.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {events.map((event) => (
              <article key={event.id} className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
                <div className="relative w-full h-80 bg-gray-200">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <p className="text-sm text-gray-500 mb-2">{event.location}</p>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: '#2B7A8F' }}>
                    {event.title}
                  </h3>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    {event.source}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black text-white px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to our newsletter for the latest events and updates from INNO100.
          </p>
          <form className="flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-black"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
