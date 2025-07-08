import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { Metadata } from "next"

import { Post } from "@/components/blog/Post"
import { postQuery } from "@/sanity/lib/queries"
import { PostDef } from "@/types/sanity"
import { sanityFetch, token } from "@/sanity/lib/sanityFetch"
import PreviewProvider from "@/components/PreviewProvider"
import PreviewPost from "@/components/blog/PreviewPost"
import { siteConfig } from "@/config/site"
import { urlForImage } from "@/sanity/lib/image"

interface PostPageProps {
  params: {
    blogSlug: string
    postSlug: string
  }
}

async function getPostFromParams({ params }: PostPageProps) {
  const post: PostDef = await sanityFetch<PostDef>({
    query: postQuery,
    params: { slug: params.postSlug },
  })

  if (!post) {
    notFound()
  }
  return post
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostFromParams({ params })

  if (!post) {
    return {}
  }

  const url = `${siteConfig.url}/${params.blogSlug}/${params.postSlug}`
  const ogImage = post.mainImage
    ? urlForImage(post.mainImage).width(1200).height(630).url()
    : siteConfig.ogImage

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: siteConfig.author.name }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [siteConfig.author.name],
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
      creator: siteConfig.author.twitter,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post: PostDef = await sanityFetch<PostDef>({
    query: postQuery,
    params: { slug: params.postSlug },
  })

  if (!post) {
    notFound()
  }
  const { isEnabled: isDraftMode } = await draftMode()

  if (isDraftMode && token) {
    return (
      <PreviewProvider token={token}>
        <PreviewPost postInfo={post} blogSlug={params.blogSlug} />
      </PreviewProvider>
    )
  }

  return <Post postInfo={post} blogSlug={params.blogSlug} />
}
