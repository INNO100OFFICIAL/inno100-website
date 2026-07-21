'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

/* ─── Constants ─────────────────────────────────────────────── */
const imageFiles = Array.from({ length: 123 }, (_, i) => {
  const num = i + 1
  return num === 118 ? `${num}.jpeg` : `${num}.png`
})

const partners = Array.from({ length: 51 }, (_, i) => {
  const num = i + 1
  return {
    id: num,
    image: `/images/partners/${num}.png`,
  }
})

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
  {
    id: 2,
    title: 'The World\'s First Large-Scale OpenClaw × AI Hardware Lobster Meetup',
    location: 'Shenzhen',
    date: '2026-03-06',
    description: 'Co-hosted by AGI-X, Kickstarter, and INNO100, the event attracted more than 1,000 registrations after only three days of intensive preparation. AMD\'s Vice President for Greater China presented hardware on site, ten AI hardware projects competed on the same stage, and the event received personal recognition from the founder of OpenClaw.',
    source: 'INNO100 Team',
    image: '/images/events/2.png',
  },
  {
    id: 3,
    title: 'BuilderUp Shenzhen Creator Meetup',
    location: 'Shenzhen',
    date: '2026-03-18',
    description: 'Jointly organized with AdventureX, the meetup moved beyond the traditional sign-in wall by creating a collaborative canvas that evolved in real time. The experience highlighted the idea that, in the age of AI, true innovation comes from human connection.',
    source: 'INNO100 Team',
    image: '/images/events/3.png',
  },
  {
    id: 4,
    title: 'INNO100 × Alibaba Cloud \'Create with AI\' Exhibition Zone',
    location: 'Sea World Culture and Arts Center',
    date: '2026-01-08',
    description: 'In collaboration with Alibaba Cloud\'s Tongyi foundation models, INNO100 created the \'Create with AI\' exhibition zone, showcasing maker DIY tools and music creation devices. The zone was selected as one of the exhibition\'s top ten must-visit spots.',
    source: 'INNO100 Team',
    image: '/images/events/4.png',
  },
  {
    id: 5,
    title: 'INNO100 × Xiaohongshu Tech Hackathon Finals',
    location: 'Shanghai Zhangjiang AI Innovation Town',
    date: '2026-04-07',
    description: 'At Xiaohongshu\'s first Hackathon Finals, a total prize pool of RMB 500,000 brought together 200 finalists for 48 hours of intensive development and roadshow competition across software and hardware categories. INNO100 set up a branded exhibition area at the Shanghai venue, and its founder joined as a guest speaker to introduce Shenzhen\'s hardware innovation ecosystem and global crowdfunding resources to a new generation of AI creators.',
    source: 'INNO100 Team',
    image: '/images/events/5.png',
  },
  {
    id: 6,
    title: 'Everything Customization Workstation — Ongoing Experience',
    location: 'Shenzhen',
    date: '2026-01-01',
    description: 'The workstation offers CNC cutting, UV printing, laser engraving, 3D printing, and other equipment, enabling visitors to take part directly in product customization. It has become one of the most popular ongoing public-benefit interactive programs at INNO100.',
    source: 'INNO100 Team',
    image: '/images/events/6.png',
  },
]

/* ─── Main Page ─────────────────────────────────────────────── */
export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'events' | 'reviews'>('products')
  return (
    <>
      {/* ── Global Styles ── */}
      <style jsx global>{`
        @keyframes spring-in {
          0%   { opacity: 0; transform: scale(0.88) translateY(16px); }
          60%  { opacity: 1; transform: scale(1.02) translateY(-4px); }
          80%  { transform: scale(0.99) translateY(1px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .spring-card {
          animation: spring-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .modal-backdrop {
          animation: fade-in 0.2s ease both;
        }
        .btn-spring {
          transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.15s ease;
        }
        .btn-spring:active {
          transform: scale(0.96);
        }
      `}</style>

      {/* ── Page Container ── */}
      <div className="min-h-screen pt-16" style={{
        background: 'linear-gradient(135deg, #f5f5f7 0%, #e8e8eb 100%)'
      }}>
        {/* ── Header with Back Button ── */}
        <div className="sticky top-16 z-40 px-4 py-6 backdrop-blur-md" style={{
          background: 'rgba(255, 255, 255, 0.7)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.5)'
        }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-light text-gray-900">
                {activeTab === 'products' && '100 Products'}
                {activeTab === 'events' && '100 Events'}
                {activeTab === 'reviews' && 'Reviews'}
              </h1>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as 'products' | 'events' | 'reviews')}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium cursor-pointer hover:border-gray-400 transition"
              >
                <option value="products">100 Products</option>
                <option value="events">100 Events</option>
                <option value="reviews">Reviews</option>
              </select>
            </div>
            <Link
              href="/"
              className="px-6 py-2 rounded-lg font-medium text-gray-900 btn-spring"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)'
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* ── Partners Section ── */}
        {activeTab === 'products' && (
        <div className="px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-12">
              Our Partners
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {partners.map((partner, idx) => (
                <div
                  key={partner.id}
                  className="spring-card"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div
                    className="rounded-2xl overflow-hidden aspect-square relative"
                    style={{
                      background: 'rgba(255, 255, 255, 0.72)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    <Image
                      src={partner.image}
                      alt={`Partner ${partner.id}`}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* ── Products Grid ── */}
        {activeTab === 'products' && (
        <div className="px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-12">
              Products
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {imageFiles.map((filename, idx) => (
                <div
                  key={filename}
                  className="spring-card cursor-pointer group"
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  <div
                    className="rounded-2xl overflow-hidden aspect-square relative"
                    style={{
                      background: 'rgba(255, 255, 255, 0.72)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    <Image
                      src={`/images/products_new/${filename}`}
                      alt="Product"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* ── Events Section ── */}
        {activeTab === 'events' && (
        <>
        <div className="px-4 py-12 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              100 Events
            </h2>
            <p className="text-lg text-gray-600">
              INNO100 is committed to creating 100 featured exchange events that connect brands, users, and creators.
            </p>
          </div>
        </div>
        <div className="px-4 py-16">
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
        </div>
        </>
        )}

        {/* ── Reviews Section ── */}
        {activeTab === 'reviews' && (
        <div className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 text-center">Reviews content coming soon...</p>
          </div>
        </div>
        )}
      </div>
    </>
  )
}
