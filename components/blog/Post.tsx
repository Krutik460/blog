import Link from "next/link"
import Image from "next/image"
import { Icons } from "@/components/Icons"

import { cn, formatDate, getIndex } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/Button"
import { Separator } from "@/components/ui/separator"

import { PostDef } from "@/types/sanity"
import { urlForImage } from "@/sanity/lib/image"
import { customBlockComponents } from "@/components/blog/PortableTextComponent"
import { PortableText } from "@portabletext/react"
import { PortableTextBlock } from "sanity"
import { ArticleStructuredData } from "@/components/StructuredData"
import { siteConfig } from "@/config/site"

export function Post({
  blogSlug,
  postInfo,
}: {
  blogSlug: string
  postInfo: PostDef
}) {
  const { index, levels } = getIndex(postInfo.body as PortableTextBlock[])
  const postUrl = `${siteConfig.url}/${blogSlug}/${postInfo.slug.current}`
  const imageUrl = postInfo.mainImage
    ? urlForImage(postInfo.mainImage).url()
    : undefined

  return (
    <>
      <ArticleStructuredData
        title={postInfo.title}
        description={postInfo.description}
        publishedAt={postInfo.publishedAt}
        imageUrl={imageUrl}
        url={postUrl}
      />
      <article className="container relative max-w-3xl py-6 lg:py-10">
        <Link
          href={`/${blogSlug}`}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute left-[-200px] top-14 hidden xl:inline-flex"
          )}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          See all posts
        </Link>
        <div>
          {postInfo.publishedAt && (
            <time
              dateTime={postInfo.publishedAt}
              className="block text-sm text-muted-foreground"
            >
              Published on {formatDate(postInfo.publishedAt)}
            </time>
          )}
          <h1 className="font-heading mt-2 inline-block text-3xl leading-tight md:text-4xl lg:text-5xl">
            {postInfo.title}
          </h1>
          <div className="mt-4 flex space-x-4">
            <Link
              key={1}
              href={`https://twitter.com/krutik460`}
              className="flex items-center space-x-2 text-sm"
            >
              <div className="flex-1 text-left leading-tight">
                <p className="font-medium">Krutik Patel</p>
                <p className="text-[12px] text-muted-foreground">@Krutik460</p>
              </div>
            </Link>
          </div>
        </div>
        {postInfo.mainImage && (
          <>
            <div className="my-8 xl:fixed xl:right-8 xl:top-24 xl:inline-flex xl:w-1/5 xl:flex-col xl:space-y-2">
              {postInfo.iframeUrl && (
                // <iframe
                //   className="my-8 h-[190px] w-full rounded-md border sm:h-[300px] md:h-[405px] xl:h-[165px]"
                //   src={postInfo.iframeUrl + "?controls=0"}
                //   title={postInfo.title}
                //   frameBorder="0"
                //   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                //   referrerPolicy="strict-origin-when-cross-origin"
                // />
                <div className="relative pb-[56.25%]">
                  <iframe
                    className="absolute left-0 top-0 h-full w-full rounded-md border"
                    width="100%"
                    height="100%"
                    src={postInfo.iframeUrl + "?fs=0&modestbranding=1&rel=0"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  />
                </div>
              )}
              {!postInfo.iframeUrl && (
                <Image
                  src={urlForImage(postInfo.mainImage).url()}
                  alt={postInfo.mainImage.alt || postInfo.title}
                  width={720}
                  height={405}
                  className="my-8 rounded-md border bg-muted transition-colors"
                  priority
                />
              )}
              <h4 className="text-lg font-medium">Table of Contents</h4>
              <div className="list-disc">
                {index.map((item) => (
                  <a
                    key={item.key}
                    href={`#${item.key}`}
                    className={`block py-[0.2rem] text-sm text-muted-foreground transition-all duration-300 hover:text-foreground hover:underline sm:text-base xl:text-sm `}
                  >
                    <pre className="inline-block">
                      {" ".repeat(levels.indexOf(item.level) * 3)}
                    </pre>
                    {item.title.replace(":", "")}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
        <Separator className="mt-4" />
        <PortableText
          value={postInfo.body}
          components={customBlockComponents}
        />
        <Separator className="my-8" />
        <div className="flex justify-center py-6 lg:py-10">
          <Link
            href={`/${blogSlug}`}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            See all posts
          </Link>
        </div>
      </article>
    </>
  )
}
