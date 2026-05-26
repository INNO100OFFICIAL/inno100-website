'use client'

import Image from 'next/image'

export default function About() {
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

        .about-section {
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
      `}</style>

      {/* Hero Section */}
      <section className="px-4 pt-8 pb-16">
        <div className="max-w-5xl mx-auto about-section" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6 text-gray-900">
            About INNO100
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl">
            Nestled within the landscape of the Nanshan District, INNO100 has established itself as the first authorized Kickstarter offline retail experience in China—a bridge between global innovation and a community of early adopters.
          </p>
        </div>
      </section>

      {/* Hero Image */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto about-section" style={{ animationDelay: '0.2s' }}>
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden glass-card">
            <Image
              src="/images/about-1.jpg"
              alt="INNO100 Store"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto about-section" style={{ animationDelay: '0.3s' }}>
          <div className="glass-card p-8 md:p-12 rounded-2xl">
            <h2 className="text-3xl md:text-4xl font-light mb-8 text-gray-900">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                  Located at the Shenzhen Bay Culture Square, this permanent interactive space serves as a vital bridge between global technology and a community of early adopters. The name represents a dual commitment to exploring innovation and showcasing the top 100 most significant products selected from Kickstarter's annual campaigns.
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  The store is situated within a cultural landmark designed by the award-winning architect Ma Yansong, founder of MAD Architects. The sprawling 188,000-square-meter complex provides a grand backdrop for INNO100's interior, which was inspired by the concept of a primal cave. This design philosophy suggests that just as human civilization began in caves, the spark of technological innovation now spreads from this modern hub.
                </p>
              </div>
              <div className="relative h-80 md:h-96 rounded-xl overflow-hidden">
                <Image
                  src="/images/about-2.jpg"
                  alt="INNO100 Store"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Space Section */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto about-section" style={{ animationDelay: '0.4s' }}>
          <div className="glass-card p-8 md:p-12 rounded-2xl">
            <h2 className="text-3xl md:text-4xl font-light mb-8 text-gray-900">Our Space</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative h-80 md:h-96 rounded-xl overflow-hidden order-2 md:order-1">
                <Image
                  src="/images/about-5.jpg"
                  alt="INNO100 Space"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="order-1 md:order-2">
                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                  The space is divided into two primary sections, each designed to foster innovation and community engagement:
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Zone A</h3>
                    <p className="text-base text-gray-700">
                      Focusing on customization workstations and smart-home retail environments where visitors can interact with cutting-edge products.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Zone B</h3>
                    <p className="text-base text-gray-700">
                      Functions as a vibrant community hub featuring tech-art installations, a water bar, and multi-functional event rooms for workshops and gatherings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto about-section" style={{ animationDelay: '0.5s' }}>
          <div className="glass-card p-8 md:p-12 rounded-2xl">
            <h2 className="text-3xl md:text-4xl font-light mb-8 text-gray-900">Our Mission</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                  Moving away from the traditional retail model, INNO100 employs an immersive approach reminiscent of a high-end showroom. This allows visitors to interact with products within realistic life scenarios rather than viewing them behind glass.
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Beyond its role as a retail destination, INNO100 has become a central gathering point for the tech community through large-scale monthly activities. The venue has hosted China's first thousand-person OpenClaw and AI hardware social gathering, which saw more than 1,200 applicants. The store also collaborated with Xiaohongshu to host a flagship Tech Hackathon, where 200 finalists engaged in a 48-hour intensive development sprint to compete for hardware and software honors.
                </p>
              </div>
              <div className="relative h-80 md:h-96 rounded-xl overflow-hidden">
                <Image
                  src="/images/about-4.jpg"
                  alt="INNO100 Mission"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
