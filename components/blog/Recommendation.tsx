"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import Link from "next/link"

import { formatDate } from "@/lib/utils"
import { PostDef, CategoryDef } from "@/types/sanity"
import { client } from "@/sanity/lib/client"
import {
  categoryPost,
  recentPost,
  categoryQuery,
  featuredPost,
} from "@/sanity/lib/queries"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/separator"

const getFilteredData = async (filter: string) => {
  if (filter) {
    if (filter === "featured") {
      return await client.fetch(featuredPost)
    } else {
      return await client.fetch(categoryPost.replace("$_id", `"${filter}"`))
    }
  } else {
    return await client.fetch(recentPost)
  }
}

export function Recommendation() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const filter = searchParams.get("filter") || ""
  
  const [category, setCategory] = useState<CategoryDef[]>([])
  const [filterData, setFilterData] = useState<PostDef[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryData, filteredData] = await Promise.all([
          client.fetch(categoryQuery),
          getFilteredData(filter)
        ])
        setCategory(categoryData)
        setFilterData(filteredData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filter])

  if (loading) {
    return (
      <div className="pb-6 lg:pb-10">
        <div className="flex flex-col">
          <Separator className="mb-4 mt-2 sm:mt-8" />
          <p>Loading recommendations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-6 lg:pb-10">
      <div className="flex flex-col">
        <Separator className="mb-4 mt-2 sm:mt-8" />
        <div className="mb-8 flex items-center">
          <Button
            variant="link"
            className="pr-0 md:pr-4"
            onClick={() => router.push("/")}
          >
            <h3
              className={`text-lg tracking-tight ${
                filter == "" ? "underline" : ""
              }`}
            >
              Recent
            </h3>
          </Button>
          <Button
            variant="link"
            onClick={() => router.push("/?filter=featured")}
          >
            <h3
              className={`text-lg tracking-tight ${
                filter == "featured" ? "underline" : ""
              }`}
            >
              Featured
            </h3>
          </Button>

          <ToggleGroup
            type="single"
            variant="capsule"
            size="capsule"
            className="overflow-auto pl-0 md:pl-4"
            onValueChange={(value) => {
              if (value) router.push(`/?filter=${value}`)
            }}
          >
            {category.map((cat) => (
              <ToggleGroupItem
                key={cat._id}
                value={cat._id}
                aria-label={cat.title}
              >
                #{cat.title.toLowerCase().replace(" ", "-")}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        {filterData?.length ? (
          <div className="grid gap-8 sm:grid-cols-3 sm:gap-24">
            {filterData.map((post) => (
              <article
                key={post._id}
                className="group relative flex flex-col space-y-2"
              >
                <h2 className="text-lg font-medium tracking-tight group-hover:underline">
                  {post.title}
                </h2>
                <p className="text-muted-foreground">{post.description}</p>
                <div className="me-2 flex justify-between">
                  {post.publishedAt && (
                    <p className="text-sm text-muted-foreground">
                      {formatDate(post.publishedAt)}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">Read more →</p>
                </div>

                <Link
                  href={`/${post.blog.slug}/${post.slug.current}`}
                  className="absolute inset-0"
                >
                  <span className="sr-only">View Article</span>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p>No posts published.</p>
        )}
      </div>
    </div>
  )
}
