import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug, isAbsoluteURL, simplifySlug } from "./path"

export const AUTHOR = {
  name: "Nikila Fernando",
  jobTitle: "Platform Engineer",
  description:
    "Microsoft MVP and Platform Engineer from Sri Lanka specializing in Kubernetes architecture, Azure, platform engineering, DevOps, and governed agentic AI for CI/CD. Community organizer and tech speaker.",
  sameAs: [
    "https://github.com/Nikila99gimhan",
    "https://www.linkedin.com/in/nikilafernando/",
    "https://mvp.microsoft.com/en-US/MVP/profile/1429d312-99cc-40c8-bfc5-e3664d5503b1",
    "https://www.credly.com/users/nikila-fernando/badges",
  ],
  award: "Microsoft Most Valuable Professional (MVP) — Developer Technologies, Microsoft Azure",
  knowsAbout: [
    "Platform Engineering",
    "Kubernetes Architecture",
    "Kubernetes",
    "Azure Kubernetes Service (AKS)",
    "Microsoft Azure",
    "DevOps",
    "Site Reliability Engineering",
    "Cloud Native Architecture",
    "GitHub Actions",
    "GitHub Copilot",
    "Model Context Protocol (MCP)",
    "Agentic AI",
    "Infrastructure as Code",
    "Terraform",
    "Bicep",
    "Helm",
    "GitOps",
  ],
  memberOf: [
    { name: "Sri Lanka Developer Forum", url: "https://www.devforum.lk/" },
    { name: "Cloud Native Sri Lanka", url: "https://www.facebook.com/CloudNativeSL/" },
  ],
}

export const BASE_KEYWORDS = [
  "Nikila Fernando",
  "Nikila Fernando tech talks",
  "Nikila Fernando platform engineer",
  "platform engineer",
  "platform engineering",
  "Kubernetes architecture",
  "DevOps",
  "Microsoft Azure",
  "Microsoft MVP",
]

const SECTION_NAMES: Record<string, string> = {
  devops: "DevOps",
  notes: "Notes",
  til: "Today I Learned",
  "tech-talks": "Tech Talks",
  tools: "Tools",
  communities: "Communities",
  tags: "Tags",
}

export type PageKind = "home" | "about" | "section" | "tag" | "post" | "notfound"

export function pageKind(slug: string): PageKind {
  if (slug === "index") return "home"
  if (slug === "404") return "notfound"
  if (slug === "about") return "about"
  if (slug === "tags" || slug.startsWith("tags/")) return "tag"
  if (/^[^/]+\/index$/.test(slug)) return "section"
  return "post"
}

export function siteRoot(baseUrl: string): string {
  return `https://${baseUrl}/`
}

export function canonicalUrl(baseUrl: string, slug: string): string {
  const simple = simplifySlug(slug as FullSlug)
  return siteRoot(baseUrl) + (simple === "/" ? "" : encodeURI(simple))
}

export function sectionName(segment: string): string {
  return SECTION_NAMES[segment] ?? segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

// Mirrors the og:image resolution in plugins/emitters/ogImage.tsx.
export function ogImageUrl(baseUrl: string, fileData: QuartzPluginData): string {
  const custom = fileData.frontmatter?.socialImage
  if (custom) return isAbsoluteURL(custom) ? custom : `https://${baseUrl}/static/${custom}`
  if (fileData.filePath) return `https://${baseUrl}/${fileData.slug!}-og-image.webp`
  return `https://${baseUrl}/static/og-image.png`
}

export function pageKeywords(tags: string[] = []): string {
  return [...new Set([...tags.map((t) => t.replace(/-/g, " ")), ...BASE_KEYWORDS])].join(", ")
}

export function toIsoDate(value: unknown): string | undefined {
  if (value instanceof Date && !isNaN(value.getTime())) return value.toISOString()
  if (typeof value === "string" && value.trim() !== "") {
    const d = new Date(value)
    return isNaN(d.getTime()) ? value : d.toISOString()
  }
  return undefined
}

// Frontmatter dates parse as local midnight, so format the local calendar day.
export function isoDay(date: Date): string {
  return date.toLocaleDateString("en-CA")
}

type EventFrontmatter = {
  name?: string
  startDate?: unknown
  location?: string
  organizer?: string
  organizerUrl?: string
}

interface JsonLdInput {
  baseUrl: string
  fileData: QuartzPluginData
  title: string
  description: string
}

export function buildJsonLd({ baseUrl, fileData, title, description }: JsonLdInput): object {
  const root = siteRoot(baseUrl)
  const slug = fileData.slug ?? "index"
  const kind = pageKind(slug)
  const url = canonicalUrl(baseUrl, slug)
  const personId = `${root}#person`
  const websiteId = `${root}#website`
  const published = toIsoDate(fileData.dates?.published ?? fileData.dates?.created)
  const modified = toIsoDate(fileData.dates?.modified) ?? published
  const tags = fileData.frontmatter?.tags ?? []
  const image = ogImageUrl(baseUrl, fileData)

  const graph: object[] = [
    {
      "@type": "Person",
      "@id": personId,
      name: AUTHOR.name,
      url: root,
      jobTitle: AUTHOR.jobTitle,
      description: AUTHOR.description,
      sameAs: AUTHOR.sameAs,
      award: AUTHOR.award,
      knowsAbout: AUTHOR.knowsAbout,
      memberOf: AUTHOR.memberOf.map((org) => ({ "@type": "Organization", ...org })),
      mainEntityOfPage: `${root}about`,
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: root,
      name: "nikila.dev",
      alternateName: [`${AUTHOR.name} — Platform Engineering Blog`, AUTHOR.name],
      description: AUTHOR.description,
      inLanguage: "en-US",
      author: { "@id": personId },
      publisher: { "@id": personId },
    },
  ]

  const webPageBase = {
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: "en-US",
    isPartOf: { "@id": websiteId },
  }

  if (kind === "home") {
    graph.push({ "@type": "WebPage", ...webPageBase, about: { "@id": personId } })
  } else if (kind === "about") {
    graph.push({
      "@type": "ProfilePage",
      ...webPageBase,
      mainEntity: { "@id": personId },
      ...(published && { dateCreated: published }),
      ...(modified && { dateModified: modified }),
    })
  } else if (kind === "section" || kind === "tag") {
    graph.push({ "@type": "CollectionPage", ...webPageBase, about: tags.length ? tags : undefined })
  } else if (kind === "post") {
    const posting: Record<string, unknown> = {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: fileData.frontmatter?.title ?? title,
      description,
      url,
      mainEntityOfPage: url,
      image,
      inLanguage: "en-US",
      author: { "@id": personId },
      publisher: { "@id": personId },
      isPartOf: { "@id": websiteId },
      articleSection: sectionName(slug.split("/")[0]),
      keywords: tags.join(", "),
      ...(published && { datePublished: published }),
      ...(modified && { dateModified: modified }),
    }

    const event = fileData.frontmatter?.event as EventFrontmatter | undefined
    if (event?.name) {
      const eventId = `${url}#event`
      graph.push({
        "@type": "Event",
        "@id": eventId,
        name: event.name,
        startDate: toIsoDate(event.startDate)?.slice(0, 10),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        ...(event.location && {
          location: { "@type": "Place", name: event.location, address: event.location },
        }),
        ...(event.organizer && {
          organizer: {
            "@type": "Organization",
            name: event.organizer,
            ...(event.organizerUrl && { url: event.organizerUrl }),
          },
        }),
        performer: { "@id": personId },
        description,
        image,
        url,
      })
      posting.about = { "@id": eventId }
    }
    graph.push(posting)
  }

  if (kind !== "home" && kind !== "notfound") {
    const segments = slug.split("/").filter((s) => s !== "index")
    const crumbs = [{ name: "Home", item: root }]
    if (kind === "post" || kind === "tag") {
      if (segments.length > 1) {
        crumbs.push({ name: sectionName(segments[0]), item: canonicalUrl(baseUrl, `${segments[0]}/index`) })
      }
    }
    crumbs.push({ name: fileData.frontmatter?.title ?? title, item: url })
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: c.item,
      })),
    })
  }

  return { "@context": "https://schema.org", "@graph": graph }
}

// Escapes "<" so content can never close the surrounding <script> tag.
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
