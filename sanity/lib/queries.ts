// ./nextjs-app/sanity/lib/queries.ts

import { groq } from "next-sanity"

// Get all blogs
export const blogsQuery = groq`*[_type == "blog"] | order(title)[]{
  _id, 
  title, 
  slug, 
  featured, 
  description}`

// Get a single blog by its slug
export const blogQuery = groq`*[_type == "blog" && slug.current == $slug][0]{
  _id, 
  title, 
  slug, 
  featured, 
  description}`

// Get all post for a blog
export const postsQuery = groq`*[_type == "post" && blog._ref == $_id] | order(publishedAt desc)[]{
  _id,
  title,
  slug,
  publishedAt,
  blog,
  mainImage{
    asset,
    alt
  },
  description,
  body
}`

// Get a single post by its slug
export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  mainImage{
    asset,
    alt
  },
  iframeUrl,
  description,
  blog,
  body
}`

export const categoryQuery = groq`*[_type == "category"]{
  _id, 
  title}`

// Get 3 recent posts
export const recentPost = groq`*[_type == "post"] | order(publishedAt desc)[0..2]{
  _id, 
  title, 
  slug, 
  "blog": {"ref":blog._ref, "slug":blog->slug.current, "title":blog->title},
  publishedAt,
  description}`

// Get filtered post based on category
export const categoryPost = groq`*[_type == "post" && $_id in category[]->_id] | order(publishedAt desc)[]{
  _id, 
  title, 
  slug, 
  publishedAt,
  "blog": {"ref":blog._ref, "slug":blog->slug.current, "title":blog->title},
  publishedAt,
  description}`

// Get filtered post based on category
export const featuredPost = groq`*[_type == "post" && featured] | order(publishedAt desc)[]{
  _id, 
  title, 
  slug, 
  featured,
  "blog": {"ref":blog._ref, "slug":blog->slug.current, "title":blog->title},
  publishedAt,
  description}`
