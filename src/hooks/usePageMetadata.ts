import { useEffect } from 'react'

type MetaProps = {
  title: string
  description?: string
}

const SITE_TITLE = 'Sembark Store'
const DEFAULT_DESCRIPTION =
  'Browse premium products with fast filtering, responsive design, and secure checkout-ready cart management.'

function updateMetaTag(name: string, content: string) {
  const element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (element) {
    element.content = content
  } else {
    const meta = document.createElement('meta')
    meta.name = name
    meta.content = content
    document.head.append(meta)
  }
}

export function usePageMetadata({ title, description }: MetaProps) {
  useEffect(() => {
    document.title = `${title} | ${SITE_TITLE}`
    updateMetaTag('description', description ?? DEFAULT_DESCRIPTION)
    updateMetaTag('og:title', `${title} | ${SITE_TITLE}`)
    updateMetaTag('og:description', description ?? DEFAULT_DESCRIPTION)
    updateMetaTag('og:type', 'website')
  }, [title, description])
}
