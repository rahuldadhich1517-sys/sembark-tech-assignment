import { useEffect } from 'react'

const SITE_TITLE = 'Sembark Store'
const DEFAULT_DESCRIPTION =
  'Browse premium products with fast filtering, responsive design, and secure checkout-ready cart management.'

type MetaProps = {
  title: string
  description?: string
}

function updateMetaTag(name: string, content: string): void {
  const element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (element) {
    element.content = content
  } else {
    const meta = document.createElement('meta')
    meta.name = name
    meta.content = content
    document.head.appendChild(meta)
  }
}

export function usePageMetadata({ title, description }: MetaProps): void {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_TITLE}`
    const finalDescription = description ?? DEFAULT_DESCRIPTION

    document.title = fullTitle
    updateMetaTag('description', finalDescription)
    updateMetaTag('og:title', fullTitle)
    updateMetaTag('og:description', finalDescription)
    updateMetaTag('og:type', 'website')
  }, [title, description])
}
