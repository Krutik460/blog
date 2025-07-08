import Link from "next/link"
import Image from "next/image"

import { BlogDef, PostDef } from "@/types/sanity"
import { urlForImage } from "@/sanity/lib/image"
import { cn, formatDate } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/Button"
import { Icons } from "@/components/Icons"
import { Separator } from "@/components/ui/separator"
import { Suspense } from "react"
import PostLoading from "@/components/loading/PostLoading"

export function Blog({
  blogInfo,
  posts,
}: {
  blogInfo: BlogDef
  posts: PostDef[]
}) {
  return (
    <div>
      <div className="container mx-auto flex max-w-5xl flex-row pb-0 pt-6 lg:py-10">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "link" }),
            "hidden basis-1/4 justify-center py-2 md:inline-flex lg:py-10"
          )}
        >
          <Icons.chevronLeft className="mr-2 h-5 w-5 text-muted-foreground hover:text-accent-foreground md:h-8 md:w-8" />
        </Link>
        <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
          <div className="space-y-4">
            <h1 className="font-heading inline-block text-2xl md:text-4xl lg:text-4xl">
              {blogInfo.title}
            </h1>
            {blogInfo.description && (
              <p className="text-base text-muted-foreground md:text-lg">
                {blogInfo.description}
              </p>
            )}
          </div>
        </div>
      </div>
      <Separator className="m-0 mb-2 hidden md:mt-8 md:block" />
      <div className="mb-14 mt-4 md:mt-8">
        {posts?.length ? (
          <Suspense fallback={<PostLoading />}>
            <div className="grid gap-10 sm:grid-cols-2">
              {posts.map((post, index) => (
                <article
                  key={index}
                  className="group relative flex flex-col space-y-2"
                >
                  {post.mainImage && (
                    <Image
                      src={urlForImage(post.mainImage).url()}
                      alt={post.mainImage.alt || post.title}
                      width={804}
                      height={452}
                      className="rounded-md border bg-muted transition-colors"
                      priority={index <= 1}
                    />
                  )}
                  <h2 className="text-xl font-bold">{post.title}</h2>
                  {post.publishedAt && (
                    <p className="text-sm text-muted-foreground">
                      {formatDate(post.publishedAt)}
                    </p>
                  )}
                  <Link
                    href={`/${blogInfo.slug.current}/${post.slug.current}`}
                    className="absolute inset-0"
                  >
                    <span className="sr-only">View Article</span>
                  </Link>
                </article>
              ))}
            </div>
          </Suspense>
        ) : (
          <p>No posts published.</p>
        )}
      </div>
    </div>
  )
}
