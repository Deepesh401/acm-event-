import { Helmet } from 'react-helmet-async'

export default function SEO({ title, description, image = '/images/logo.png' }) {
  const fullTitle = title
    ? `${title} | NMIMS Indore ACM Student Chapter`
    : 'NMIMS Indore ACM Student Chapter'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || 'Preserving Legacy. Showcasing Innovation. Two Years of Innovation. One Digital Legacy.'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  )
}
