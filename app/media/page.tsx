'use client'

import Image from 'next/image'

export default function Media() {
  const articles = [
    {
      id: 1,
      title: 'Guangdong Accelerates AI Development in Toy Manufacturing',
      date: '2025-12-26',
      source: 'Xinhua News Agency',
      excerpt: 'The report features children interacting with Ropet, an AI-powered toy, at the INNO100 flagship store, highlighting Guangdong\'s growing momentum in AI-enabled toy manufacturing.',
      image: '/images/media/1.png',
    },
    {
      id: 2,
      title: 'Inside China\'s Robot Valley, Where the Future Gets Built at Speed of Proximity',
      date: '2026-02-05',
      source: 'Xinhua News Agency',
      excerpt: 'Exploring the innovation hub where cutting-edge robotics and AI technologies are developed and showcased.',
      image: '/images/media/2.png',
    },
    {
      id: 3,
      title: 'Shenzhen Brings Cutting-Edge Technology to Consumers with New Retail Scenarios',
      date: '2026-01-21',
      source: 'People\'s Daily Online',
      excerpt: 'New retail experiences transform how consumers interact with technology in Shenzhen\'s innovation ecosystem.',
      image: '/images/media/3.png',
    },
    {
      id: 4,
      title: 'Shenzhen Leads Major Cities with 5.5% GDP Growth on Tech Edge',
      date: '2026-02-10',
      source: 'China.org.cn',
      excerpt: 'Shenzhen\'s economic growth is driven by its leadership in technology innovation and digital transformation.',
      image: '/images/media/4.png',
    },
    {
      id: 5,
      title: 'Challenges for Shenzhen Investors in Breaking into the DJI Circle',
      date: '2026-02-03',
      source: '36Kr Global',
      excerpt: 'Analysis of the competitive landscape for tech investors in Shenzhen\'s thriving drone and robotics sector.',
      image: '/images/media/5.png',
    },
    {
      id: 6,
      title: 'Nanshan: China\'s First District to Achieve a Trillion-Yuan Output',
      date: '2026-01-27',
      source: 'Shenzhen Municipal Government',
      excerpt: 'Nanshan District reaches historic milestone in economic output, driven by tech innovation and entrepreneurship.',
      image: '/images/media/6.png',
    },
    {
      id: 7,
      title: 'Tech Gadgets Become New Must-Haves for Chinese New Year',
      date: '2026-02-15',
      source: 'Shenzhen Municipal Government',
      excerpt: 'Latest consumer trends show tech gadgets dominating gift choices during the Chinese New Year season.',
      image: '/images/media/7.png',
    },
    {
      id: 8,
      title: 'Kickstarter Makes China Debut with INNO100\'s Flagship Store in Shenzhen',
      date: '2025-11-24',
      source: 'KrASIA',
      excerpt: 'Kickstarter\'s first China location opens at INNO100, bringing global crowdfunding to Shenzhen\'s innovation hub.',
      image: '/images/media/8.png',
    },
    {
      id: 9,
      title: 'Smart Gadgets for a Smarter New Year | Marina at INNO100',
      date: '2025-12-01',
      source: 'Shenzhen Daily on YouTube',
      excerpt: 'Video feature showcasing the latest smart gadgets and innovations available at INNO100 for the new year.',
      image: '/images/media/9.png',
    },
    {
      id: 10,
      title: 'World\'s First Bambu Lab Store in the World! 3D Printing Heaven',
      date: '2026-01-01',
      source: 'Floaty Piet on YouTube',
      excerpt: 'Exclusive look at the world\'s first Bambu Lab flagship store featuring cutting-edge 3D printing technology.',
      image: '/images/media/10.png',
    },
    {
      id: 11,
      title: 'The Future Is Already on Sale! AI Gadgets You Won\'t Believe Exist',
      date: '2026-04-01',
      source: 'Expedición Vital on YouTube',
      excerpt: 'Discover the most innovative AI-powered gadgets currently available at INNO100\'s retail experience.',
      image: '/images/media/11.png',
    },
    {
      id: 12,
      title: 'First Domestic Store Lands in Shenzhen Bay',
      date: '2025-12-01',
      source: 'GBA Travel on YouTube',
      excerpt: 'Coverage of the opening of a major domestic brand\'s first flagship store at Shenzhen Bay Culture Square.',
      image: '/images/media/12.png',
    },
    {
      id: 13,
      title: 'It\'s Practically a Maker\'s Toolkit! Highlights from Shenzhen INNO100',
      date: '2026-04-01',
      source: 'Dr. J on YouTube',
      excerpt: 'In-depth review of INNO100\'s comprehensive collection of maker tools and innovative tech products.',
      image: '/images/media/13.png',
    },
    {
      id: 14,
      title: 'Event Day: Hands-On with Xmachine 5-Axis CNC and XMaker AI CAM Launch',
      date: '2026-03-01',
      source: 'Xhorse3D on YouTube',
      excerpt: 'Live event coverage featuring the latest CNC technology and AI-powered design tools for makers.',
      image: '/images/media/14.png',
    },
    {
      id: 15,
      title: 'Tech New Year Goods Gain Popularity as Guangdong Manufacturing and Services Go Global',
      date: '2026-02-23',
      source: '21st Century Business Herald',
      excerpt: 'Report on the surge in tech product demand during New Year season and Guangdong\'s global expansion.',
      image: '/images/media/15.png',
    },
    {
      id: 16,
      title: 'On-Site Report: Shenzhen Bay\'s Technology Playground Turns Niche Hard Tech into Hits',
      date: '2025-12-13',
      source: 'Sina Finance Video',
      excerpt: 'Analysis of how INNO100 successfully brings specialized hardware products to mainstream consumers.',
      image: '/images/media/16.png',
    },
    {
      id: 17,
      title: 'INNO100 × Alibaba Cloud: Visit the \'Create with AI\' Zone from January 8 to 11',
      date: '2026-01-07',
      source: 'NetEase News',
      excerpt: 'Special collaboration between INNO100 and Alibaba Cloud showcasing AI-powered creative tools.',
      image: '/images/media/17.png',
    },
    {
      id: 18,
      title: 'Shenzhen Hardware Entrepreneurs Are Quietly Entering a Second Golden Age',
      date: '2025-12-02',
      source: 'GeekPark on Zhihu',
      excerpt: 'Deep dive into Shenzhen\'s resurgence as a hardware innovation hub with emerging entrepreneurial opportunities.',
      image: '/images/media/18.png',
    },
    {
      id: 19,
      title: 'Tech Innovation 001: Visiting INNO100 as Shenzhen Begins a New Hardware Innovation Wave',
      date: '2025-12-12',
      source: 'Tencent News / Shenzhen Economic Daily',
      excerpt: 'Comprehensive feature on INNO100\'s role in Shenzhen\'s latest wave of hardware innovation.',
      image: '/images/media/19.png',
    },
    {
      id: 20,
      title: 'INNO100 Global Innovation Flagship Store Opens',
      date: '2025-11-24',
      source: 'Sina Technology / Leiphone',
      excerpt: 'Launch coverage of INNO100\'s flagship store as a global innovation retail destination.',
      image: '/images/media/20.png',
    },
    {
      id: 21,
      title: 'Shenzhen Builds a New Technology Retail Landmark with a Sense of the Future',
      date: '2026-01-21',
      source: 'Xinhua Guangdong',
      excerpt: 'INNO100 emerges as a landmark retail experience that reimagines how technology is presented to consumers.',
      image: '/images/media/21.png',
    },
    {
      id: 22,
      title: 'OpenClaw Lobster Gathering Energizes the AI Community in Nanshan',
      date: '2026-03-08',
      source: 'Innovative Nanshan on WeChat Channels',
      excerpt: 'Community event brings together AI enthusiasts and innovators at INNO100 for networking and collaboration.',
      image: '/images/media/22.png',
    },
    {
      id: 23,
      title: 'Exploring the Home Base of Global Hit Tech Products: Shenzhen INNO100',
      date: '2025-11-27',
      source: 'Tech Innovation Compass on WeChat Channels',
      excerpt: 'Feature on INNO100 as the showcase for globally successful tech products and innovations.',
      image: '/images/media/23.png',
    },
    {
      id: 24,
      title: 'A Reverse Chinese New Year in Shenzhen Brings Visitors to Nanshan\'s Tech Tourism Scene',
      date: '2026-02-24',
      source: 'Innovative Nanshan on WeChat Channels',
      excerpt: 'INNO100 becomes a major tech tourism destination during the Chinese New Year holiday season.',
      image: '/images/media/24.png',
    },
    {
      id: 25,
      title: 'Inside an 1,100-Square-Meter Space Filled with Global Top 100 Novel Tech Products',
      date: '2025-11-01',
      source: 'Vincy on WeChat Channels',
      excerpt: 'Tour of INNO100\'s expansive retail space showcasing the world\'s most innovative tech products.',
      image: '/images/media/25.png',
    },
    {
      id: 26,
      title: 'Exploring Guangdong Goods During Spring Festival Through Interactive Retail Experiences',
      date: '2026-02-01',
      source: 'Pengcheng Perspectives on WeChat Channels',
      excerpt: 'INNO100 highlights Guangdong\'s innovative products through immersive retail experiences during Spring Festival.',
      image: '/images/media/26.png',
    },
    {
      id: 27,
      title: 'AI100: Why Did This Company\'s First Smartphone Reach RMB 50 Million in Presales?',
      date: '2025-12-01',
      source: 'Huxiu App on WeChat Official Account',
      excerpt: 'Analysis of a breakthrough AI-powered smartphone launch and its unprecedented presale success.',
      image: '/images/media/27.png',
    },
    {
      id: 28,
      title: 'INNO100 Reveals the Innovation Ambition of China\'s Hardware Industry',
      date: '2025-11-01',
      source: 'Baijing on WeChat Official Account',
      excerpt: 'INNO100 serves as a window into China\'s ambitious hardware innovation ecosystem and future direction.',
      image: '/images/media/28.png',
    },
    {
      id: 29,
      title: 'Shenzhen Hardware Entrepreneurs Are Quietly Entering a Second Golden Age',
      date: '2025-12-01',
      source: 'GeekPark on WeChat Official Account',
      excerpt: 'Exploration of Shenzhen\'s resurgence as a hardware innovation powerhouse with emerging opportunities.',
      image: '/images/media/29.png',
    },
    {
      id: 30,
      title: 'Another Global Flagship Store Lands in Shenzhen Nanshan',
      date: '2025-11-01',
      source: 'Innovative Nanshan on WeChat Official Account',
      excerpt: 'INNO100 joins the wave of global flagship stores establishing their presence in Shenzhen\'s tech district.',
      image: '/images/media/30.png',
    },
    {
      id: 31,
      title: 'A Field Visit to Shenzhen\'s First-Store Economy: A Radiant Burst of Technology',
      date: '2026-02-07',
      source: 'Dute News / Shenzhen Special Zone Daily',
      excerpt: 'In-depth look at how INNO100 exemplifies Shenzhen\'s thriving first-store economy and tech retail innovation.',
      image: '/images/media/31.png',
    },
    {
      id: 32,
      title: 'Shenzhen\'s Tech Spaces Become Popular Destinations for International Visitors',
      date: '2026-08-12',
      source: 'Xinhua News Agency (Xinhua Viewpoint)',
      excerpt: 'A wave of "tech shopping" is sweeping the Guangdong-Hong Kong-Macao Greater Bay Area, with robotics experience centers, AI product flagship stores, and drone shops becoming popular check-in spots for foreign tourists in Shenzhen. INNO100\'s Global Innovation Flagship Store is featured as one of the representative scenes in the report.',
      image: '/images/media/32.png',
    },
    {
      id: 33,
      title: 'Strategic Emerging Industries Drive Over 60% of GDP as Nanshan Hands the Baton to AI',
      date: '2026-08-25',
      source: 'SFC (South Finance Channel)',
      excerpt: 'Nanshan\'s trillion-yuan consumer economy is finding real-world scenarios. In recent years, a wave of tech flagship stores has landed in Nanshan, including INNO100 — Kickstarter\'s first officially authorized store in China. Inside, novelty tech products like stringless guitars, robot dogs, and AI tennis robots draw over a hundred foreign visitors daily, with more than 60% staying over an hour. As the report notes, these stores are "no longer simple points of sale, but gateways for global innovation products entering everyday life."',
      image: '/images/media/33.png',
    },
    {
      id: 34,
      title: 'Why Is "Inbound Tourism" Booming This Summer?',
      date: '2026-08-21',
      source: 'Science and Technology Daily (STDaily)',
      excerpt: 'On overseas social platforms, "China Travel" remains a hot topic, with the "Chinamaxxing" hashtag surpassing 4 billion views. "Made-in-China products are compelling enough that many inbound tourists add AI glasses, phones, and home appliances to their shopping lists." Foreign tourists are seen selecting AI sports camera glasses at INNO100\'s Global Innovation Flagship Store in Shenzhen.',
      image: '/images/media/34.png',
    },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="pt-16">
      <section className="py-12 bg-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Media Centre
          </h1>
          <p className="text-lg text-gray-600">
            Latest news and coverage about INNO100
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
                <div className="relative w-full h-40 bg-gray-200">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#2B7A8F' }}>
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {new Date(article.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })} • {article.source}
                  </p>
                  <p className="text-gray-700 text-sm">{article.excerpt}</p>
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
            Subscribe to our newsletter for the latest news and updates from INNO100.
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
