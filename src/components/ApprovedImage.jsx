const ApprovedImage = ({ image, priority = false, className = '' }) => {
  if (!image?.approved || !image.src || !image.alt || !image.width || !image.height) return null
  return <img className={className} src={image.src} srcSet={image.srcSet || undefined}
    sizes={image.srcSet ? '(max-width: 599px) 100vw, (max-width: 999px) 50vw, 600px' : undefined}
    alt={image.alt} width={image.width} height={image.height}
    loading={priority ? 'eager' : 'lazy'} decoding="async" fetchpriority={priority ? 'high' : 'auto'}
    style={{ objectPosition: image.position || 'center' }} />
}
export default ApprovedImage
