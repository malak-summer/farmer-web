import { farmContent } from '../content/farm'
const BrandLogo = ({ dark = false, responsive = false }) => {
  const variant = dark ? 'dark' : 'light'
  return <picture className="brand-logo">
    {responsive && <source media="(max-width: 599px)" srcSet={`/brand/fresh-farm-symbol-${variant}.svg`} />}
    <img src={`/brand/fresh-farm-${variant}.svg`} width="490" height="136" alt={farmContent.name} />
  </picture>
}
export default BrandLogo
