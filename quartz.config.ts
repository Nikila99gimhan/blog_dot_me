import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 * Terminal / DevOps Developer Blog
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "~/nikila.dev",
    pageTitleSuffix: " | nikila.dev",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "nikila.dev",
    ignorePatterns: ["private", "templates", ".obsidian", "drafts"],
    defaultDateType: "modified",
    generateSocialImages: false,
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "JetBrains Mono",
        body: "JetBrains Mono",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#f4f4f0",
          lightgray: "#e0e0d8",
          gray: "#9a9a8e",
          darkgray: "#2d2d2a",
          dark: "#1a1a17",
          secondary: "#2d6a4f",
          tertiary: "#52b788",
          highlight: "rgba(82, 183, 136, 0.12)",
          textHighlight: "#52b78840",
        },
        darkMode: {
          light: "#0d0f14",
          lightgray: "#1a1d26",
          gray: "#3a3f52",
          darkgray: "#a8b2cc",
          dark: "#e2e8f0",
          secondary: "#39ff14",
          tertiary: "#00d4ff",
          highlight: "rgba(57, 255, 20, 0.07)",
          textHighlight: "#39ff1430",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "one-dark-pro",
        },
        keepBackground: true,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents({
        collapseByDefault: false,
        minEntries: 2,
      }),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
