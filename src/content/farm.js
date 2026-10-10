import { photos } from './media'

// Brand direction supplied by the user. Purpose/values below are aims, not
// evidence of certifications, measured outcomes or particular growing methods.
export const farmContent = {
  name: 'Fresh Farm',
  summary: 'Fresh Farm is about a closer connection between agriculture and everyday food. Our aim is simple: make freshness, quality and care part of the conversation, from questions about produce to the choices made at the table.',
  about: 'Good food raises good questions: what is in season, how was it grown, and which produce suits the meal ahead? Fresh Farm is built around the idea that those conversations matter. Our purpose is to bring people closer to agriculture through clear information, thoughtful choices and a direct connection with the farm.',
  mission: 'Our mission is to connect people with fresh, quality agricultural produce and encourage care in the way food is grown, selected and used. We aim to make product enquiries straightforward and expectations clear.',
  vision: 'We want stronger relationships between farms, customers and the communities around them, with a better understanding of the work and resources behind everyday food.',
  methods: '', // TODO: Add client-confirmed crop, soil, water and harvest practices.
  values: '', // Optional approved values narrative; principles below are brand aims.
  principles: [
    { title: 'Freshness & quality', text: 'Pay attention to the condition, intended use and handling of produce, rather than relying on appearance alone.' },
    { title: 'Responsibility & care', text: 'Treat soil, water, crops and people as things to care for. Responsible choices need practical detail, not broad environmental promises.' },
    { title: 'Trust & consistency', text: 'Be clear about availability and arrangements. Set expectations that can be checked, and avoid making promises before the details are agreed.' },
  ],
  contact: {
    email: '', // TODO: Client-confirmed public email; distinct from private recipient.
    phone: '', // TODO: Client-confirmed public phone in international format.
    address: '', // TODO: Publish only an approved address intended for visitors.
  },
  products: [], // TODO: Confirm actual products, varieties, source, units and prices.
  categoryImages: {},
  socialLinks: [], // TODO: Add only client-owned, approved profile URLs.
}

// Informational enquiry examples drawn from user-selected photos, NOT an
// assertion that these items are grown or sold by Fresh Farm. Kept separate
// from the confirmed catalogue so images cannot silently become stock claims.
export const produceGuide = [
  { name: 'Tomatoes', category: 'Vegetables', description: 'A versatile starting point for salads, sauces and everyday cooking. Ask about the variety, ripeness and quantity that would suit your plans.', image: photos.tomatoes },
  { name: 'Spinach', category: 'Vegetables', description: 'Leafy greens for cooked dishes or recipes that call for tender leaves. Include your preferred leaf size and intended use when asking about availability.', image: photos.spinach },
  { name: 'Red apples', category: 'Fruits', description: 'Different apple varieties offer different textures and flavours. Tell us whether you want fruit for eating fresh or cooking; the photograph does not identify a specific variety.', image: photos.apples },
  { name: 'Strawberries', category: 'Fruits', description: 'Berries for fruit bowls, desserts and other kitchen plans. Mention the quantity and timing you need, and confirm availability before making arrangements.', image: photos.strawberries },
  { name: 'Fresh herbs', category: 'Herbs', description: 'Herbs bring aroma and flavour to a dish. Name the herb you need and how you plan to use it; the flowering plant pictured is an illustration, not a confirmed variety or pack size.', image: photos.basil },
]
export const categoryCopy = {
  Vegetables: 'From leafy greens to tomatoes used in everyday cooking, start with the type of vegetable and the quantity you need.',
  Fruits: 'Explore fruit enquiry examples, then ask about varieties, ripeness and seasonal availability for your plans.',
  Herbs: 'A little flavour can go a long way. Specify the herb, intended use and whether you are asking about cut leaves or plants.',
}
export const getProduceItems = () => farmContent.products.length ? farmContent.products : produceGuide
