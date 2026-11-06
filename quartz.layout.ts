import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponent, QuartzComponentProps } from "./quartz/components/types"

type PagePredicate = (props: QuartzComponentProps) => boolean

const isHome: PagePredicate = (props) => props.fileData.slug === "index"
const isListingSlug = (slug?: string) => ["index", "work", "blog"].includes(slug ?? "")
const isListingPage: PagePredicate = (props) => isListingSlug(props.fileData.slug)

const showOn = (condition: PagePredicate, component: QuartzComponent) =>
  Component.ConditionalRender({ condition, component })
const hideOn = (condition: PagePredicate, component: QuartzComponent) =>
  Component.ConditionalRender({ condition: (props) => !condition(props), component })

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Component.SiteNav()],
  afterBody: [showOn((props) => props.fileData.slug === "about", Component.CommitGrid())],
  footer: Component.Footer({
    links: {
      About: "/about",
      GitHub: "https://github.com/Nikila99gimhan",
      LinkedIn: "https://www.linkedin.com/in/nikilafernando/",
      RSS: "/index.xml",
      Tools: "/tools/",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    showOn(isHome, Component.PortfolioHome()),
    hideOn(isHome, Component.Breadcrumbs()),
    hideOn(isHome, Component.ArticleTitle()),
    hideOn(isListingPage, Component.ContentMeta()),
    hideOn(isListingPage, Component.TagList()),
    hideOn(isListingPage, Component.ShareButtons()),
    showOn((props) => props.fileData.slug === "blog", Component.ArticleIndex()),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.ReaderMode(),
    Component.Explorer({
      folderClickBehavior: "link",
    }),
  ],
  right: [
    hideOn(isHome, Component.Graph()),
    hideOn(isHome, Component.DesktopOnly(Component.TableOfContents())),
    hideOn(isHome, Component.RecentNotes({ limit: 4, filter: (page) => !isListingSlug(page.slug) })),
    hideOn(isHome, Component.Backlinks()),
  ],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
    Component.ShareButtons(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.ReaderMode(),
    Component.Explorer({
      folderClickBehavior: "link",
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.RecentNotes({ limit: 4, filter: (page) => !isListingSlug(page.slug) }),
    Component.Backlinks(),
  ],
}
