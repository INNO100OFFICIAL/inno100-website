'use client'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function trackSocialClick(network: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'social_click', { social_network: network })
  }
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">INNO100</h3>
            <p className="text-sm text-gray-400">
              Kickstarter's first authorized offline retail experience in China.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/about" className="hover:text-white transition">About Us</a></li>
              <li><a href="/menu" className="hover:text-white transition">Menu</a></li>
              <li><a href="/media" className="hover:text-white transition">Media Centre</a></li>
              <li><a href="/news" className="hover:text-white transition">News</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Follow Us</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://www.instagram.com/inno100_official/" target="_blank" rel="noopener noreferrer" onClick={() => trackSocialClick('instagram')} className="hover:text-white transition">Instagram</a></li>
              <li><a href="https://x.com/INNO100OFFICIAL" target="_blank" rel="noopener noreferrer" onClick={() => trackSocialClick('x')} className="hover:text-white transition">X</a></li>
              <li><a href="https://www.linkedin.com/company/inno100-store/" target="_blank" rel="noopener noreferrer" onClick={() => trackSocialClick('linkedin')} className="hover:text-white transition">LinkedIn</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Contact</h4>
            <p className="text-sm text-gray-400">
              Shenzhen Bay Culture Square<br />
              Nanshan District, Shenzhen
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-400 text-center">
            © {currentYear} INNO100. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
