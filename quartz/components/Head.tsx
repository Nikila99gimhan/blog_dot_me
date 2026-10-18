import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"
import {
  AUTHOR,
  buildJsonLd,
  canonicalUrl,
  pageKeywords,
  pageKind,
  serializeJsonLd,
  toIsoDate,
} from "../util/seo"
export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const seoTitle = fileData.frontmatter?.seoTitle as string | undefined
    const title =
      (seoTitle ?? fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) +
      titleSuffix
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    const kind = pageKind(fileData.slug ?? "index")
    const isArticle = kind === "post"
    const socialUrl =
      kind === "notfound" || !cfg.baseUrl
        ? url.toString()
        : canonicalUrl(cfg.baseUrl, fileData.slug!)
    const tags = fileData.frontmatter?.tags ?? []
    const publishedTime = toIsoDate(fileData.dates?.published ?? fileData.dates?.created)
    const modifiedTime = toIsoDate(fileData.dates?.modified) ?? publishedTime
    const robots =
      kind === "notfound"
        ? "noindex, follow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    const jsonLd =
      cfg.baseUrl && kind !== "notfound"
        ? serializeJsonLd(buildJsonLd({ baseUrl: cfg.baseUrl, fileData, title, description }))
        : undefined

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="description" content={description} />
        <meta name="keywords" content={pageKeywords(tags)} />
        <meta name="author" content={AUTHOR.name} />
        <meta name="robots" content={robots} />
        {cfg.baseUrl && kind !== "notfound" && <link rel="canonical" href={socialUrl} />}

        <meta property="og:site_name" content="nikila.dev" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content={title} />
        <meta property="og:type" content={isArticle ? "article" : "website"} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={fileData.frontmatter?.title ?? title} />
        {isArticle && (
          <>
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
            <meta property="article:author" content={AUTHOR.sameAs[1]} />
            {tags.map((tag) => (
              <meta property="article:tag" content={tag} />
            ))}
          </>
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}
            />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="og:url" content={socialUrl}></meta>
            <link
              rel="alternate"
              type="text/plain"
              title="LLM-readable site index"
              href={`https://${cfg.baseUrl}/llms.txt`}
            />
          </>
        )}
        {AUTHOR.sameAs.slice(0, 2).map((href) => (
          <link rel="me" href={href} />
        ))}

        <link rel="icon" href={iconPath} />
        <link rel="apple-touch-icon" href={iconPath} />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content={cfg.theme.colors.lightMode.light}
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content={cfg.theme.colors.darkMode.light}
        />
        <meta name="generator" content="Quartz" />
        {jsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        )}

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
