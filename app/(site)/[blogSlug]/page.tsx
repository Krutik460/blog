import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { Metadata } from "next"

import { Blog } from "@/components/blog/Blog"
import { BlogDef, PostDef } from "@/types/sanity"
import { blogQuery, postsQuery } from "@/sanity/lib/queries"
import { sanityFetch, token } from "@/sanity/lib/sanityFetch"
import PreviewProvider from "@/components/PreviewProvider"
import PreviewBlog from "@/components/blog/PreviewBlog"
import { siteConfig } from "@/config/site"

interface BlogPageProps {
  params: {
    blogSlug: string
  }
}

async function getBlogFromParams({ params }: BlogPageProps) {
  const blog: BlogDef = await sanityFetch<BlogDef>({
    query: blogQuery,
    params: { slug: params.blogSlug },
  })
  if (!blog) {
    return null
  }
  return blog
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const blog = await getBlogFromParams({ params })

  if (!blog) {
    return {}
  }

  const url = `${siteConfig.url}/${params.blogSlug}`

  return {
    title: blog.title,
    description: blog.description,
    authors: [{ name: siteConfig.author.name }],
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "website",
      url,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: [siteConfig.ogImage],
      creator: siteConfig.author.twitter,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const blog: BlogDef = await sanityFetch<BlogDef>({
    query: blogQuery,
    params: { slug: params.blogSlug },
  })
  if (!blog) {
    return notFound()
  }

  const posts: PostDef[] = await sanityFetch<PostDef[]>({
    query: postsQuery,
    params: { _id: blog._id },
  })
  const { isEnabled: isDraftMode } = await draftMode()

  if (isDraftMode && token) {
    return (
      <PreviewProvider token={token}>
        <PreviewBlog blogInfo={blog} posts={posts} />
      </PreviewProvider>
    )
  }

  return <Blog blogInfo={blog} posts={posts} />
}
