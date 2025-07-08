import { PortableTextBlock, Image } from "sanity"

export type BlogDef = {
  _id: string
  title: string
  slug: {
    current: string
  }
  featured: boolean
  description: string
}

export type PostDef = {
  _id: string
  title: string
  slug: {
    current: string
  }
  featured: boolean
  publishedAt: string
  blog: {
    _ref: string
    slug: string
    title: string
  }
  mainImage: Image & {
    alt?: string
  }
  iframeUrl: string
  description: string
  body: PortableTextBlock[]
}

export type CategoryDef = {
  _id: string
  title: string
}
