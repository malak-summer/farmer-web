// Supplied by the user and explicitly selected for website use on 2026-10-04.
// Photo selection does not confirm product availability, location or worker identity.
// Watermarked farm.jpg and carrots.jpg remain excluded.
export const photos = {
  tomatoes: { approved: true, src: '/media/tomatoes.jpg', alt: 'Red tomatoes growing on vines beside a garden path and tools', width: 735, height: 490, position: '40% center' },
  apples: { approved: true, src: '/media/apples.jpg', alt: 'Red apples on leafy branches in warm sunlight', width: 736, height: 1104, position: 'center 40%' },
  strawberries: { approved: true, src: '/media/strawberries.jpg', alt: 'Ripe red strawberries hanging beneath green leaves', width: 640, height: 960, position: 'center 55%' },
  spinach: { approved: true, src: '/media/spinach.jpg', alt: 'Broad green spinach leaves growing in soil', width: 640, height: 960, position: 'center 45%' },
  basil: { approved: true, src: '/media/basil.jpg', alt: 'Green and purple herb leaves with small purple flowers', width: 736, height: 736 },
  farmer: { approved: true, src: '/media/farmer.webp', alt: 'A person wearing a straw hat tending leafy plants', width: 486, height: 856, position: 'center 45%' },
}
export const media = {
  hero: photos.tomatoes,
  about: photos.farmer,
  articlePlanning: photos.spinach,
  articlePlanningDetail: photos.basil,
  articleVisit: photos.farmer,
}
