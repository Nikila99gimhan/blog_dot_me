import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import style from "./styles/pageviews.scss"
// @ts-ignore
import script from "./scripts/pageviews-tracker.inline"

interface PageViewsOptions {
  showIcon?: boolean
}

const defaultOptions: PageViewsOptions = {
  showIcon: true,
}

const SECTION_LANDING_PAGES = new Set([
  "devops",
  "notes",
  "til",
  "tech-talks",
  "tools",
  "communities",
  "tags",
])

export function isArticlePage(fileData: QuartzComponentProps["fileData"]): boolean {
  const slug = fileData.slug
  if (!slug || slug === "index" || fileData.frontmatter?.title === undefined) {
    return false
  }

  const cleanSlug = slug.replace(/\/index$/, "")
  if (
    SECTION_LANDING_PAGES.has(cleanSlug) ||
    cleanSlug.startsWith("tags/") ||
    cleanSlug === "tags"
  ) {
    return false
  }

  return true
}

export const PageViewsBadge = ({
  fileData,
  displayClass,
  showIcon = true,
}: QuartzComponentProps & { showIcon?: boolean }) => {
  if (!isArticlePage(fileData)) {
    return null
  }

  const slug = fileData.slug!
  const canonicalPath = "/" + slug.replace(/\/index$/, "")

  return (
    <span
      class={classNames(displayClass, "pageview-badge")}
      data-pageview-badge
      data-canonical-path={canonicalPath}
      title="Pageviews"
    >
      {showIcon && (
        <svg
          class="pageview-icon"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
      <span class="pageview-count" data-pageview-count>
        &mdash; views
      </span>
    </span>
  )
}

export default ((userOpts?: Partial<PageViewsOptions>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const PageViews: QuartzComponent = (props: QuartzComponentProps) => {
    return <PageViewsBadge {...props} showIcon={opts.showIcon} />
  }

  PageViews.css = style
  PageViews.afterDOMLoaded = script

  return PageViews
}) satisfies QuartzComponentConstructor
