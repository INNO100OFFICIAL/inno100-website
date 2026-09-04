'use client'

import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen pt-16" style={{
      background: 'linear-gradient(135deg, #f5f5f7 0%, #e8e8eb 100%)'
    }}>
      <style jsx global>{`
        @keyframes spring-in {
          0% {
            opacity: 0;
            transform: scale(0.88) translateY(16px);
          }
          60% {
            opacity: 1;
            transform: scale(1.02) translateY(-4px);
          }
          80% {
            transform: scale(0.99) translateY(1px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes float-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-content {
          animation: spring-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .section-content {
          animation: spring-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .glass-card:hover {
          background: rgba(255, 255, 255, 0.82);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          transform: translateY(-4px);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .image-card {
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .image-card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .button-primary {
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 12px 32px;
          border-radius: 12px;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(0, 0, 0, 0.8);
        }

        .button-primary:hover {
          background: rgba(0, 0, 0, 0.95);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .button-secondary {
          background: rgba(255, 255, 255, 0.8);
          color: rgba(0, 0, 0, 0.8);
          padding: 12px 32px;
          border-radius: 12px;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }

        .button-secondary:hover {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="/images/hero.jpg"
            alt="INNO100 Store"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="hero-content" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col items-center gap-0 mb-8">
              <Image
                src="/images/logo.png"
                alt="INNO100 Logo"
                width={500}
                height={200}
                className="h-40 md:h-48 w-auto"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-gray-900 mb-6">
              Global Innovation<br />Flagship Store
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-4 max-w-2xl mx-auto">
              Kickstarter's first authorized offline retail experience in China
            </p>
            <p className="text-xl md:text-2xl font-light text-gray-900 mb-8">
              Ideas Matter
            </p>
          </div>

          {/* Stats wall */}
          <div className="hero-content mb-10" style={{ animationDelay: '0.15s' }}>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm md:text-base text-gray-800">
              <span className="font-medium">512,780+ Visitors</span>
              <span className="text-gray-400" aria-hidden="true">·</span>
              <span className="font-medium">100+ Daily International Guests</span>
              <span className="text-gray-400" aria-hidden="true">·</span>
              <span className="font-medium">1,100㎡</span>
              <span className="text-gray-400" aria-hidden="true">·</span>
              <span className="font-medium">112+ Global Brands</span>
            </div>
          </div>

          <div className="hero-content flex justify-center gap-4 mb-8" style={{ animationDelay: '0.2s' }}>
            <a
              href="https://www.instagram.com/inno100_official?igsh=MTd4YmphdHB4cm1xag%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full glass-card"
              title="Follow us on Instagram"
            >
              <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
              </svg>
            </a>
            <a
              href="https://x.com/INNO100OFFICIAL"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full glass-card"
              title="Follow us on X"
            >
              <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=1066676599854651"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full glass-card"
              title="Follow us on Facebook"
            >
              <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/inno100-store/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full glass-card"
              title="Follow us on LinkedIn"
            >
              <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
              </svg>
            </a>
          </div>

          <div className="hero-content flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '0.3s' }}>
            <a
              href="/visit"
              className="button-primary"
            >
              Plan Your China Tech Visit
            </a>
            <a
              href="/contact"
              className="button-secondary"
            >
              Partner With INNO100
            </a>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="section-content mb-12" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-4xl md:text-5xl font-light text-center text-gray-900 mb-4">
              Experience INNO100
            </h2>
            <p className="text-center text-gray-700 text-lg max-w-2xl mx-auto">
              Discover the world's most innovative products in an immersive environment
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="image-card section-content h-80 md:h-96" style={{ animationDelay: '0.5s' }}>
              <Image
                src="/images/store-1.jpg"
                alt="INNO100 Store Interior"
                fill
                className="object-cover"
              />
            </div>
            <div className="image-card section-content h-80 md:h-96" style={{ animationDelay: '0.6s' }}>
              <Image
                src="/images/store-2.jpg"
                alt="INNO100 Products"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="section-content mb-12" style={{ animationDelay: '0.7s' }}>
            <h2 className="text-4xl md:text-5xl font-light text-center text-gray-900">
              Why INNO100
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-8 rounded-2xl section-content" style={{ animationDelay: '0.8s' }}>
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Top 100 Products</h3>
              <p className="text-gray-700">
                Curated selection of the most significant innovative products from Kickstarter's annual campaigns.
              </p>
            </div>
            <div className="glass-card p-8 rounded-2xl section-content" style={{ animationDelay: '0.9s' }}>
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Immersive Experience</h3>
              <p className="text-gray-700">
                Interact with products in realistic life scenarios rather than viewing them behind glass.
              </p>
            </div>
            <div className="glass-card p-8 rounded-2xl section-content" style={{ animationDelay: '1s' }}>
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Community</h3>
              <p className="text-gray-700">
                Connect with tech enthusiasts and early adopters from around the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 mb-8">
        <div className="max-w-4xl mx-auto glass-card p-12 md:p-16 rounded-3xl section-content" style={{ animationDelay: '1.1s' }}>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Ready to Explore Innovation?
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Visit us at Shenzhen Bay Culture Square and experience the future of consumer technology.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
