export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Krutik Patel",
  description:
    "Portfolio website of Krutik Patel, a technology enthusiast and a full-stack developer.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://blog.krutikpatel.dev",
  ogImage: "/og-image.jpg",
  keywords: [
    "Krutik Patel",
    "Full Stack Developer",
    "Technology Blog",
    "Web Development",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Programming",
    "Software Engineering",
    "Tech Articles",
    "Coding Tutorials",
  ],
  author: {
    name: "Krutik Patel",
    email: "krutikpatel.patel@gmail.com",
    twitter: "@krutik460",
    linkedin: "https://www.linkedin.com/in/krutik460/",
    github: "https://github.com/Krutik460",
  },
  mainNav: [],
  links: {
    github: "https://github.com/Krutik460",
    twitter: "https://twitter.com/krutik460",
    linkedin: "https://www.linkedin.com/in/krutik460/",
  },
}
