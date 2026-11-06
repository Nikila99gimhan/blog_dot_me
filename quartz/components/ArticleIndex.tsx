import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug, resolveRelative } from "../util/path"
import { formatDate } from "./Date"
import { pageKind, sectionName } from "../util/seo"

const TOPIC_SECTIONS = ["devops", "notes", "til", "tech-talks"]
const ACRONYMS: Record<string, string> = {
  ai: "AI",
  aks: "AKS",
  agc: "AGC",
  arc: "ARC",
  cli: "CLI",
  eks: "EKS",
  github: "GitHub",
  irsa: "IRSA",
  mcp: "MCP",
  pki: "PKI",
  sre: "SRE",
  tls: "TLS",
}

export function publishedDate(page: QuartzPluginData): Date | undefined {
  return page.dates?.published ?? page.dates?.created
}

export function sectionOf(page: QuartzPluginData): string {
  return page.slug!.split("/")[0]
}

export function getArticles(allFiles: QuartzPluginData[], sections?: string[]): QuartzPluginData[] {
  return allFiles
    .filter((page) => page.slug && pageKind(page.slug) === "post")
    .filter((page) => !sections || sections.includes(sectionOf(page)))
    .sort((a, b) => (publishedDate(b)?.getTime() ?? 0) - (publishedDate(a)?.getTime() ?? 0))
}

function humanizeTag(tag: string): string {
  return tag
    .split("-")
    .map((word) => ACRONYMS[word] ?? word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function topicLabel(page: QuartzPluginData, maxTags = 2): string {
  const section = sectionOf(page)
  const skip = new Set([section, "devops", "til", "tech-talks", "events"])
  const tags = (page.frontmatter?.tags ?? [])
    .filter((tag) => !skip.has(tag))
    .slice(0, maxTags)
    .map(humanizeTag)
  return [sectionName(section), ...tags].join(" · ")
}

export function ArticleList({
  pages,
  currentSlug,
  showDescription = false,
}: {
  pages: QuartzPluginData[]
  currentSlug: FullSlug
  showDescription?: boolean
}) {
  return (
    <ol class="article-list">
      {pages.map((page) => {
        const date = publishedDate(page)
        const description = page.frontmatter?.description
        return (
          <li class="article-list-item">
            {date ? (
              <time class="article-list-date" datetime={date.toISOString()}>
                {formatDate(date)}
              </time>
            ) : (
              <span class="article-list-date" />
            )}
            <div class="article-list-body">
              <a class="article-list-title" href={resolveRelative(currentSlug, page.slug!)}>
                {page.frontmatter?.title}
              </a>
              <span class="article-list-topic">{topicLabel(page)}</span>
              {showDescription && description && (
                <p class="article-list-desc">{description}</p>
              )}
            </div>
            <span class="article-list-arrow" aria-hidden="true">
              ↗
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export default (() => {
  const ArticleIndex: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
    const currentSlug = fileData.slug!
    const articles = getArticles(allFiles)
    const topics = TOPIC_SECTIONS.map((section) => ({
      section,
      count: articles.filter((page) => sectionOf(page) === section).length,
    })).filter((topic) => topic.count > 0)

    return (
      <div class="article-index">
        <nav class="topic-nav" aria-label="Blog topics">
          <span class="topic-nav-label">$ ls topics/</span>
          <ul>
            {topics.map(({ section, count }) => (
              <li>
                <a href={resolveRelative(currentSlug, `${section}/index` as FullSlug)}>
                  {sectionName(section)} <span class="topic-count">{count}</span>
                </a>
              </li>
            ))}
            <li>
              <a href={resolveRelative(currentSlug, "tags/index" as FullSlug)}>All tags</a>
            </li>
          </ul>
        </nav>
        <h2 class="ph-section-title" id="all-articles">
          All articles <span class="ph-section-count">({articles.length})</span>
        </h2>
        <ArticleList pages={articles} currentSlug={currentSlug} showDescription />
      </div>
    )
  }

  return ArticleIndex
}) satisfies QuartzComponentConstructor
