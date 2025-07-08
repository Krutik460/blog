import { BlogDef, PostDef } from "@/types/sanity"
import { blogsQuery, postsQuery } from "@/sanity/lib/queries"
import { sanityFetch } from "@/sanity/lib/sanityFetch"

const URL = process.env.NEXT_PUBLIC_SITE_URL || "https://krutik.dev"

export default async function sitemap() {
  const blogs: BlogDef[] = await sanityFetch<BlogDef[]>({ query: blogsQuery })

  const blogsUrl = blogs.map(({ slug }) => ({
    url: `${URL}/${slug.current}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const postsUrl = blogs.map(async (blog) => {
    const posts: PostDef[] = await sanityFetch<PostDef[]>({
      query: postsQuery,
      params: { _id: blog._id },
    })
    const tempPostsUrl = posts.map((post) => ({
      url: `${URL}/${blog.slug.current}/${post.slug.current}`,
      lastModified: post.publishedAt || new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
    return tempPostsUrl
  })
  const postsUrlFlat = (await Promise.all(postsUrl)).flat()

  const routes = [""].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: 1.0,
  }))

  return [...routes, ...blogsUrl, ...postsUrlFlat]
}
