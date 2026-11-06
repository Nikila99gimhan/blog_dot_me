import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"

type NavItem = {
  label: string
  target: string
  isActive: (slug: string) => boolean
}

const primary: NavItem[] = [
  { label: "About", target: "about", isActive: (s) => s === "about" },
  { label: "Work", target: "work", isActive: (s) => s === "work" },
  {
    label: "Blog",
    target: "blog",
    isActive: (s) => s === "blog" || /^(devops|notes|til)\//.test(s),
  },
  { label: "Talks", target: "tech-talks/index", isActive: (s) => s.startsWith("tech-talks/") },
]

const secondary: NavItem[] = [
  { label: "Notes", target: "notes/index", isActive: (s) => s.startsWith("notes/") },
  { label: "TIL", target: "til/index", isActive: (s) => s.startsWith("til/") },
  { label: "Tools", target: "tools/index", isActive: (s) => s.startsWith("tools/") },
  {
    label: "Communities",
    target: "communities/index",
    isActive: (s) => s.startsWith("communities/"),
  },
]

export default (() => {
  const SiteNav: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const slug = fileData.slug ?? "index"
    const href = (target: string) => resolveRelative(slug as FullSlug, target as FullSlug)
    const contactHref = slug === "index" ? "#contact" : `${href("index")}#contact`

    const renderItem = (item: NavItem) => {
      const active = item.isActive(slug)
      return (
        <li>
          <a
            href={href(item.target)}
            class={active ? "site-nav-link is-active" : "site-nav-link"}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </a>
        </li>
      )
    }

    return (
      <nav class={`site-nav ${displayClass ?? ""}`} aria-label="Primary">
        <ul class="site-nav-primary">
          {primary.map(renderItem)}
          <li>
            <a href={contactHref} class="site-nav-link site-nav-contact">
              Contact
            </a>
          </li>
        </ul>
        <ul class="site-nav-secondary" aria-label="More sections">
          {secondary.map(renderItem)}
        </ul>
      </nav>
    )
  }

  return SiteNav
}) satisfies QuartzComponentConstructor
