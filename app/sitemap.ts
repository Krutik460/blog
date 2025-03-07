import { BlogDef, PostDef } from "@/types/sanity"
import { blogsQuery, postsQuery } from "@/sanity/lib/queries"
import { sanityFetch } from "@/sanity/lib/sanityFetch"

const URL = process.env.SITE_URL

export default async function sitemap() {
  const blogs: BlogDef[] = await sanityFetch<BlogDef[]>({ query: blogsQuery })

  const blogsUrl = blogs.map(({ slug }) => ({
    url: `${URL}/${slug.current}`,
    lastModified: new Date(2023, 5, 4).toISOString(),
  }))

  const postsUrl = blogs.map(async (blog) => {
    const posts: PostDef[] = await sanityFetch<PostDef[]>({
      query: postsQuery,
      params: { _id: blog._id },
    })
    const tempPostsUrl = posts.map((post) => ({
      url: `${URL}/${blog.slug.current}/${post.slug.current}`,
      // lastModified: post.publishedAt,
      lastModified: new Date().toISOString(),
    }))
    return tempPostsUrl
  })
  const postsUrlFlat = (await Promise.all(postsUrl)).flat()

  const routes = [""].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
  }))

  return [...routes, ...blogsUrl, ...postsUrlFlat]
}
