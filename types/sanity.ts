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
  publishedAt: string
  blog: {
    _ref: string
  }
  mainImage: Image
  description: string
  sourceUrl: string | undefined
  body: PortableTextBlock[]
}

export type CategoryDef = {
  _id: string
  title: string
}
