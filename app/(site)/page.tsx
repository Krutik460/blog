import { draftMode } from "next/headers"
import { Suspense } from "react"
import { Metadata } from "next"

import { Blogs } from "@/components/blog/Blogs"
import { BlogDef } from "@/types/sanity"
import { blogsQuery } from "@/sanity/lib/queries"
import { sanityFetch, token } from "@/sanity/lib/sanityFetch"
import PreviewProvider from "@/components/PreviewProvider"
import PreviewBlogs from "@/components/blog/PreviewBlogs"
import { Recommendation } from "@/components/blog/Recommendation"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "This page includes blogs on Technology, Business, Science, and more by Krutik Patel.",
  keywords: [
    "Technology Blog",
    "Business Articles",
    "Science Posts",
    "Web Development",
    "Programming Tutorials",
    "Tech Insights",
    "Krutik Patel Blog",
  ],
  openGraph: {
    title: "Technology & Business Blog - Krutik Patel",
    description:
      "Explore insightful articles on Technology, Business, Science, and Web Development by Krutik Patel.",
    type: "website",
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Krutik Patel's Technology Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Technology & Business Blog - Krutik Patel",
    description:
      "Explore insightful articles on Technology, Business, Science, and Web Development.",
    images: [siteConfig.ogImage],
    creator: siteConfig.author.twitter,
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

export default async function BlogPage() {
  const blogs: BlogDef[] = await sanityFetch<BlogDef[]>({ query: blogsQuery })
  const { isEnabled: isDraftMode } = await draftMode()

  if (isDraftMode && token) {
    return (
      <PreviewProvider token={token}>
        <div className="flex flex-col gap-4">
          <PreviewBlogs blogs={blogs} />
          <Recommendation />
        </div>
      </PreviewProvider>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Blogs blogs={blogs} />
      <Suspense fallback={<p>Loading Recommendation...</p>}>
        <Recommendation />
      </Suspense>
    </div>
  )
}
