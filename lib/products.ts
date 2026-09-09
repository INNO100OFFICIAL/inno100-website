import rawProducts from '@/data/deduped-products.json'

/**
 * Product catalogue for /menu.
 *
 * Names, Chinese names, categories and ids come from the store's own export
 * (data/deduped-products.json). The English one-line descriptions below are
 * condensed translations of the vendor spec text carried in that export's
 * `highlight` field — nothing here is written from scratch, so every claim
 * traces back to the supplier copy the store already publishes in Chinese.
 *
 * Products without vendor spec text render as name + Chinese name + category.
 * They are not given invented descriptions.
 */

export type Product = {
  id: string
  name: string
  nameEn: string
  category: string
  categoryLabel: string
  /** Condensed translation of the vendor spec text, when the export has one. */
  valueLine?: string
  /** True only where INNO100 already publishes that the product is demo-able. */
  demo: boolean
}

export type CategoryGroup = {
  key: string
  label: string
  labelCn: string
  products: Product[]
}

/* ─── Category labels ────────────────────────────────────────────
   The export uses 17 raw category names, a few of which are near
   duplicates. Mapping several keys onto one label merges them. */
const CATEGORY_LABELS: Record<string, string> = {
  'AI硬件': 'AI Hardware',
  '桌面机器人': 'Desktop Robots',
  'AR/VR': 'AR & VR',
  '影音': 'Audio, Music & Display',
  '万物工坊': 'Maker Workshop',
  '万物定制': 'Custom Manufacturing',
  '万物定制（AI 生成专用）': 'Custom Manufacturing',
  '咖啡机': 'Coffee Equipment',
  '摄影类目': 'Photography',
  '户外': 'Outdoor & Camera Gear',
  '工具': 'Tools',
  '游戏键盘和鼠标': 'Gaming Keyboards & Mice',
  '3C周边': 'Phone & Computer Accessories',
  '生活家电': 'Home Appliances',
  '家电': 'Home Appliances',
  '女性&宠物': 'Personal Care & Pets',
  '其他或娱乐': 'Other & Entertainment',
}

/** Display order — the categories that make INNO100 distinctive come first. */
const CATEGORY_ORDER = [
  'AI Hardware',
  'Desktop Robots',
  'AR & VR',
  'Audio, Music & Display',
  'Maker Workshop',
  'Custom Manufacturing',
  'Photography',
  'Coffee Equipment',
  'Gaming Keyboards & Mice',
  'Tools',
  'Outdoor & Camera Gear',
  'Home Appliances',
  'Personal Care & Pets',
  'Phone & Computer Accessories',
  'Other & Entertainment',
]

/* ─── One-line value propositions ───────────────────────────────
   Each line is a condensed English rendering of the vendor spec text
   in that product's `highlight` field. 35 of the 151 products carry
   spec text; the rest are listed by name until copy is supplied. */
const VALUE_LINES: Record<string, string> = {
  // Tools
  '4614328977':
    '20,000 Pa suction, with blow, inflate and deflate modes in one unit, plus five attachments.',
  '5603390408':
    'Two torque settings, recharges as soon as it goes back in the case, 48 bits included.',
  '4614329673':
    'LED display, one-touch two-speed switching and six torque settings.',
  '5603376144':
    'Precision screwdriver, rotary tool and drill in one, with magnetic snap-together storage and a brushless motor.',
  '5271289367':
    '40 W AI frequency tracking and 40 kHz ultrasonic vibration cut cleanly without jamming or melting edges.',
  '5271296577':
    'Two batteries alternate for continuous cutting, with a 30-minute full charge and an integrated storage base.',
  '5271383059':
    'Twenty precision-sharpened SK5 high-carbon steel blades on a 9 mm 30° standard fitting, with a safe disposal box.',

  // Coffee Equipment
  '4455829091':
    '85 × 85 mm and 138 g, with three modes for hand brew, espresso and manual weighing, plus a carry pouch.',
  '5276679444':
    'Fourteen 0.25 mm needles in concentric rings break up clumps, with adjustable depth and a magnetic base.',
  '4455825706':
    'Stepless adjustment for precise distribution and full control of tamping height.',
  '5276584414':
    'A four-spring design delivers constant, level tamping force with less effort.',
  '4455748955':
    'A patented spout and twin curved channels give clear pour patterns, with a bent handle for grip.',
  '5276482592':
    'Cordless and portable, with 9-bar extraction peaking at 20 bar, a standard 58 mm basket, four heat settings and 10-second pre-infusion.',
  '5276478692':
    '74 mm titanium-coated flat burrs, a 400 W commercial BLDC motor with burr reverse and plasma static removal, and 90 stepless grind settings.',

  // Audio, Music & Display
  '4455703221':
    'True physical 7.1.2 Dolby Atmos across ten drivers, with a satellite neck rest filling in the rear channels over 5.8 GHz.',

  // AI Hardware
  '4453526815':
    'Clones your voice from a 30-second sample, translates inside chat and social apps, and runs simultaneous interpretation with bilingual subtitles on voice and video calls.',

  // Personal Care & Pets
  '5276293934':
    'A 180° camera records every visit, AI tells your cats apart, logs waste shape for health tracking, and seals and swaps the bag automatically.',
  '4455633767':
    'AI recognises your pet and logs every meal, checks the bowl for leftovers, streams live video, and holds 5 L across two hoppers.',
  '5276281677':
    'Runs 83 days off its 5,000 mAh battery with no cable, holds 3 L, and reports drinking data over Bluetooth.',

  // Outdoor & Camera Gear
  '5275585211':
    'Just 200 g, with 35–70 minutes of running time and one-touch assembly.',
  '5275290119':
    '5 kPa and 500 L/min for both inflating and deflating, with a three-level light, at 122 g.',
  '4455221862':
    '125 g, reaches 100 PSI in 80 seconds and up to 120 PSI, with a digital readout and a smart tail light.',
  '4452430652':
    'A 2 L sling built for pocket and action cameras that also takes everyday carry, with three-layer compartments and Crocs charm mounts.',
  '5268995604':
    'A climbing-grade dual-frame harness with a suspended breathable back panel, kangaroo front pocket and folding top expansion; fits one body and five lenses, or a 16-inch MacBook Pro.',
  '4452424905':
    'A USB 3.2 Gen 2 reader at 10 Gbps reads CFexpress up to 1,000 MB/s; holds 3 CFexpress, 3 SD, 4 microSD and 2 nano SIM, IP54 rated.',
  '5268985136':
    'A built-in USB 3.1 reader at up to 312 MB/s reads SD and microSD at the same time; holds 4 SD, 4 microSD and 2 nano SIM, IP54 rated.',
  '5268890566':
    'A 16 L everyday camera pack at 0.95 kg empty, with two quick-access windows, YKK zips and an AirTag pocket; fits one body and three lenses.',
  '5268877360':
    'Carries four ways — shoulder, hand, cross-body or underarm — and fits one body with two lenses, or a 70–200 mm attached.',
  '5268696296':
    'Carries four ways and doubles as a camera insert, in casual nylon with side safety clips and a hidden AirTag pocket.',
  '4452304103':
    'Twin anchor points spread the load and cut sway, adjustable 130–156 cm, with a 10 kg quick-release and a lens-cloth charm.',
  '5268599229':
    'High-strength woven webbing adjustable 127–156 cm, with twin anchor points, a 10 kg quick-release and accessory mounts.',
  '5261096838':
    'At 6.1 mm thick it works as a desk stand, low-angle mount, grip or selfie stick, with a 45° finger ring and 300° rotation.',
  '4448749084':
    'Sticks straight onto MagSafe phones, with 34 LEDs running 30 minutes at full brightness across three colour-temperature and brightness levels.',
  '4448738750':
    'Pairs with the PGYTECH camera app for a custom control dial, supports magnetic wireless charging while shooting, and adds a Bluetooth remote module.',

  // Other & Entertainment
  '5271486350':
    'A compact machine with linked light and shadow effects and app-controlled patterns.',
}

/* ─── Featured products ─────────────────────────────────────────
   Twenty products drawn from the categories that make the store
   distinctive — AI hardware, desktop robots, AR/VR, music and the
   maker workshop — weighted towards the best sellers in the export. */
const FEATURED_IDS = [
  // AR & VR
  '4516324646', // Rokid Glasses AI Smart Glasses
  '5396687350', // VITURE Luma XR/AR Smart Glasses
  // Desktop Robots
  '4516819982', // Ropet AI Companion Robot
  '4516639446', // LOOI Robot with DeepSeek AI
  '5371898252', // Fuzozo AI Emotional Companion Robot
  '5471593795', // ChessUp AI Chess Robot (4-in-1 Starter)
  // AI Hardware
  '4479132326', // iKKO MindOne AI Card Phone
  '4467040268', // Plaud Note AI Voice Recorder
  '4690518214', // RingConn Gen 3 Smart Ring
  '4453526815', // InnAIO T10 MagSafe AI Translator
  // Audio, Music & Display
  '5295798098', // Aeroband PocketGuitar & Air Drum Kit
  '5503184178', // Enya Cyber Pocket Air Guitar
  '5295576404', // Music Code Auto Piano (Family Edition)
  '5254397965', // LAVA STUDIO Super Music Workstation
  '4696817518', // ViewX Glasses-Free 3D Spatial Display
  '4516647218', // Haloasis A1 Holographic Lyrics Speaker
  '4455703221', // OXS Thunder Pro+ Gaming Spatial Audio Speaker
  // Maker Workshop
  '5254391058', // Snapmaker U1 Multi-Color 3D Printer
  '5296092550', // xTool F1 Ultra Laser Engraver
  '5599696424', // LaserPecker LX2 All-in-One Laser Cutter
]

/* ─── In-store demo tags ────────────────────────────────────────
   Deliberately narrow. A product is tagged only where INNO100
   already states publicly that visitors can try it — currently the
   string-less guitars named in the /visit FAQ. Everything else is
   left untagged until the store confirms its own demo list. */
const DEMO_IDS = new Set([
  '5503184178', // Enya Cyber Pocket Air Guitar
  '5295983758', // Nafire Spirit Air Guitar
  '5295798098', // Aeroband PocketGuitar & Air Drum Kit
  '5297981662', // Musspark AI Guitar S1 Mini
])

/* ─── Data access ───────────────────────────────────────────────── */

type RawProduct = {
  id: string
  name: string
  nameEn: string
  category: string
}

function toProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    name: raw.name.trim(),
    nameEn: raw.nameEn.trim(),
    category: raw.category,
    categoryLabel: CATEGORY_LABELS[raw.category] ?? raw.category,
    valueLine: VALUE_LINES[raw.id],
    demo: DEMO_IDS.has(raw.id),
  }
}

const ALL_PRODUCTS: Product[] = (rawProducts as RawProduct[]).map(toProduct)

export function getAllProducts(): Product[] {
  return ALL_PRODUCTS
}

export function getFeaturedProducts(): Product[] {
  const byId = new Map(ALL_PRODUCTS.map((p) => [p.id, p]))
  return FEATURED_IDS.map((id) => byId.get(id)).filter(
    (p): p is Product => Boolean(p)
  )
}

/** All products grouped by display label, in CATEGORY_ORDER. */
export function getProductsByCategory(): CategoryGroup[] {
  const groups = new Map<string, Product[]>()

  for (const product of ALL_PRODUCTS) {
    const existing = groups.get(product.categoryLabel)
    if (existing) existing.push(product)
    else groups.set(product.categoryLabel, [product])
  }

  const labelToCn = new Map<string, string[]>()
  for (const [cn, label] of Object.entries(CATEGORY_LABELS)) {
    labelToCn.set(label, [...(labelToCn.get(label) ?? []), cn])
  }

  return [...groups.entries()]
    .sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a[0])
      const bi = CATEGORY_ORDER.indexOf(b[0])
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
    })
    .map(([label, products]) => ({
      key: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label,
      labelCn: (labelToCn.get(label) ?? []).join(' / '),
      products: products.sort((a, b) => a.nameEn.localeCompare(b.nameEn)),
    }))
}

export const PRODUCT_COUNT = ALL_PRODUCTS.length
