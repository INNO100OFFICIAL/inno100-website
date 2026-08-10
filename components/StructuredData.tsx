// Site-wide JSON-LD structured data (Schema.org).
// All fields below are confirmed, real INNO100 data.

const SITE_URL = 'https://inno100.ai'

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'INNO100',
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/images/logo.png`,
      description:
        "Kickstarter's first authorized offline retail experience in China. INNO100 brings the top 100 most innovative global products into a real consumer setting at its Shenzhen flagship store.",
      email: 'brand@inno100.group',
      telephone: '+8618018740492',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: '+8618018740492',
        email: 'brand@inno100.group',
      },
      sameAs: [
        'https://www.linkedin.com/company/inno100-store/',
        'https://www.instagram.com/inno100_official/',
        'https://x.com/INNO100OFFICIAL',
      ],
    },
    {
      // Store is a subtype of LocalBusiness — the accurate type for a
      // physical innovation retail store (not TouristAttraction).
      '@type': 'Store',
      '@id': `${SITE_URL}/#store`,
      name: 'INNO100',
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/images/logo.png`,
      logo: `${SITE_URL}/images/logo.png`,
      description:
        'Global Innovation Flagship Store — an in-person innovation retail experience in Shenzhen showcasing frontier Kickstarter and global innovation products.',
      parentOrganization: { '@id': `${SITE_URL}/#organization` },
      email: 'brand@inno100.group',
      telephone: '+8618018740492',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '南山区深圳湾文化广场北馆 L1 层（东北门，近人才公园）',
        addressLocality: '深圳市',
        addressRegion: '广东省',
        addressCountry: 'CN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 22.51497,
        longitude: 113.94034,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '10:00',
          closes: '22:00',
        },
      ],
      sameAs: [
        'https://www.linkedin.com/company/inno100-store/',
        'https://www.instagram.com/inno100_official/',
        'https://x.com/INNO100OFFICIAL',
      ],
    },
  ],
}

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
