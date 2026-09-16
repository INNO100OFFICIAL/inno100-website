import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import AIReferrerTracker from '@/components/AIReferrerTracker'

const GA_MEASUREMENT_ID = 'G-854QE2CJWH'
const SITE_URL = 'https://inno100.ai'

export const metadata: Metadata = {
  // Without this, Next.js resolves og:image against localhost at build time and
  // against the per-deployment Vercel URL at runtime, so shared links would
  // point at a hostname that changes on every deploy.
  metadataBase: new URL(SITE_URL),
  title: 'INNO100 - Global Innovation Flagship Store',
  description: 'Kickstarter\'s first authorized offline retail experience in China. Discover the top 100 most innovative products at our Shenzhen location.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <StructuredData />
        <AIReferrerTracker />
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
