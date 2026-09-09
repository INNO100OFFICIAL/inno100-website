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
        'https://www.linkedin.com/company/inno100-store',
        'https://www.instagram.com/inno100_official/',
        'https://x.com/INNO100OFFICIAL',
        'https://www.facebook.com/profile.php?id=1066676599854651',
        'https://www.reddit.com/user/INNO100-OFFICIAL/',
        // Canonical .com host on purpose. The listing is reachable on every
        // TripAdvisor locale domain (.fr, .cn, …) but only the .com URL should
        // be declared here, so Google resolves one entity rather than several.
        'https://www.tripadvisor.com/Attraction_Review-g297415-d34534030-Reviews-INNO100-Shenzhen_Guangdong.html',
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
      // From the store's registered Apple Maps place record
      // (place-id H2710I3F98C392CA40D), the same record the map link on
      // /visit opens. The previous pair sat 614 m away.
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 22.513058,
        longitude: 113.945949,
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
        'https://www.linkedin.com/company/inno100-store',
        'https://www.instagram.com/inno100_official/',
        'https://x.com/INNO100OFFICIAL',
        'https://www.facebook.com/profile.php?id=1066676599854651',
        'https://www.reddit.com/user/INNO100-OFFICIAL/',
        // Canonical .com host on purpose. The listing is reachable on every
        // TripAdvisor locale domain (.fr, .cn, …) but only the .com URL should
        // be declared here, so Google resolves one entity rather than several.
        'https://www.tripadvisor.com/Attraction_Review-g297415-d34534030-Reviews-INNO100-Shenzhen_Guangdong.html',
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
