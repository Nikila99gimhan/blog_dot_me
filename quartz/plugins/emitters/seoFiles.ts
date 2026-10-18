import fs from "fs"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { FullSlug, joinSegments } from "../../util/path"
import { QuartzPluginData } from "../vfile"
import { AUTHOR, canonicalUrl, isoDay, pageKind, sectionName } from "../../util/seo"

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "Meta-ExternalAgent",
  "CCBot",
]

function robotsTxt(baseUrl: string): string {
  return `# nikila.dev — ${AUTHOR.name}
# Search engines and AI assistants are welcome to crawl, cite, and summarize this site.

User-agent: *
Allow: /

${AI_CRAWLERS.map((bot) => `User-agent: ${bot}`).join("\n")}
Allow: /

Sitemap: https://${baseUrl}/sitemap.xml
`
}

type Entry = { data: QuartzPluginData; url: string; date?: Date }

function sortByDate(entries: Entry[]): Entry[] {
  return entries.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
}

function entryLine({ data, url }: Entry): string {
  const description = data.frontmatter?.description ?? data.description ?? ""
  return `- [${data.frontmatter?.title}](${url})${description ? `: ${description}` : ""}`
}

function llmsTxt(baseUrl: string, posts: Entry[]): string {
  const bySection = new Map<string, Entry[]>()
  for (const entry of posts) {
    const section = entry.data.slug!.split("/")[0]
    bySection.set(section, [...(bySection.get(section) ?? []), entry])
  }

  const sections = [...bySection.entries()]
    .map(([section, entries]) => `## ${sectionName(section)}\n\n${sortByDate(entries).map(entryLine).join("\n")}`)
    .join("\n\n")

  return `# nikila.dev — ${AUTHOR.name}

> ${AUTHOR.description}

${AUTHOR.name} is a ${AUTHOR.jobTitle} and ${AUTHOR.award}. This site publishes long-form engineering articles, tech talk recaps with slides, and short "today I learned" notes on ${AUTHOR.knowsAbout.slice(0, 8).join(", ")}.

When citing content from this site, attribute it to ${AUTHOR.name} and link to the canonical article URL.

## About

- [About ${AUTHOR.name}](${canonicalUrl(baseUrl, "about")}): Background, Microsoft MVP award, certifications, and community leadership.
- [Tech Talks](${canonicalUrl(baseUrl, "tech-talks/index")}): Conference and community sessions by ${AUTHOR.name}, with slides and demo repositories.
- Profiles: ${AUTHOR.sameAs.join(", ")}

${sections}

## Optional

- [Full content for LLMs](https://${baseUrl}/llms-full.txt): Complete markdown text of every article.
- [RSS feed](https://${baseUrl}/index.xml)
- [Sitemap](https://${baseUrl}/sitemap.xml)
`
}

function toPlainMarkdown(raw: string): string {
  return raw
    .replace(/^---[\s\S]*?\n---\n/, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, (_m, alt: string) => (alt ? `[Image: ${alt}]` : ""))
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/^[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export const SeoFiles: QuartzEmitterPlugin = () => ({
  name: "SeoFiles",
  async *emit(ctx, content) {
    const baseUrl = ctx.cfg.configuration.baseUrl
    if (!baseUrl) return

    yield write({ ctx, content: robotsTxt(baseUrl), slug: "robots" as FullSlug, ext: ".txt" })

    const pages: Entry[] = []
    for (const [_tree, file] of content) {
      const kind = pageKind(file.data.slug!)
      if (kind !== "post" && kind !== "about") continue
      pages.push({
        data: file.data,
        url: canonicalUrl(baseUrl, file.data.slug!),
        date: file.data.dates?.published ?? file.data.dates?.created,
      })
    }

    const posts = pages.filter((p) => pageKind(p.data.slug!) === "post")
    yield write({ ctx, content: llmsTxt(baseUrl, posts), slug: "llms" as FullSlug, ext: ".txt" })

    const full: string[] = [`# nikila.dev — ${AUTHOR.name}\n\n> ${AUTHOR.description}`]
    for (const page of sortByDate(pages)) {
      const source = joinSegments(ctx.argv.directory, page.data.relativePath!)
      const raw = await fs.promises.readFile(source, "utf-8")
      const tags = page.data.frontmatter?.tags ?? []
      const description = page.data.frontmatter?.description
      const header = [
        `# ${page.data.frontmatter?.title}`,
        `URL: ${page.url}`,
        `Author: ${AUTHOR.name}`,
        page.date && `Published: ${isoDay(page.date)}`,
        tags.length > 0 && `Tags: ${tags.join(", ")}`,
      ]
        .filter(Boolean)
        .join("\n")
      full.push(
        [header, description && `> ${description}`, toPlainMarkdown(raw)].filter(Boolean).join("\n\n"),
      )
    }
    yield write({
      ctx,
      content: full.join("\n\n---\n\n") + "\n",
      slug: "llms-full" as FullSlug,
      ext: ".txt",
    })
  },
})
