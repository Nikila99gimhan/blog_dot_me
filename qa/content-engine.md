# QA Content Engine — blog_dot_me (nikila.dev)

> **Generated:** 2026-06-27 | **Agent:** QA Agent (Claude Sonnet 4.6, Extended Thinking)
> **Source documents ingested:** README.md ✅ | SPEC.md ❌ MISSING | WALKTHROUGH.md ❌ MISSING

---

## ⚠️ Coverage Gap Warning

**SPEC.md and WALKTHROUGH.md are both missing.** All feature descriptions, acceptance criteria, and user flows in this Content Engine are **agent-inferred** from available project artefacts:
- `quartz.config.ts` — plugin configuration, theme, SPA/popovers flags
- `quartz.layout.ts` — component placement and layout slots
- `content/index.md` — homepage structure (inferred as UX walkthrough proxy)
- `content/devops/*.md`, `content/til/*.md`, etc. — real content samples
- `docs/features/*.md` — upstream Quartz platform documentation
- `package.json` — runtime requirements and dependency list

All acceptance criteria are tagged `[INFERRED]` throughout to distinguish them from documented spec.

---

## Project Summary

| Field | Value |
|---|---|
| **Project Name** | blog_dot_me |
| **Owner** | Nikila Fernando |
| **Purpose** | Personal developer & DevOps blog — publishes technical articles, TIL notes, tool writeups, and project case studies |
| **Platform** | Quartz v4.5.2 (TypeScript SSG) |
| **Runtime** | Node >= 22, npm >= 10.9.2 |
| **Production URL** | https://nikila.dev |
| **QA Environment** | http://localhost:8080 (dev server) |
| **Auth Required** | None — public static site |

---

## Architecture Notes

- **Stack:** Quartz v4 on Preact + Unified (Remark/Rehype) pipeline, esbuild for bundling
- **Content format:** Obsidian-flavored Markdown with YAML frontmatter
- **Fonts:** JetBrains Mono for header, body, and code (terminal aesthetic)
- **Dark mode accent:** `#39ff14` (neon green) / Light mode accent: `#2d6a4f` (forest green)
- **SPA routing:** enabled (`enableSPA: true`) via micromorph
- **Popovers:** enabled (`enablePopovers: true`)
- **Search:** FlexSearch (client-side, no server)
- **Analytics:** Plausible (privacy-friendly, no cookies)

### Component Layout
```
LEFT SIDEBAR:    PageTitle | Search | Darkmode | Explorer (desktop)
BEFORE BODY:     Breadcrumbs | ArticleTitle | ContentMeta | TagList
RIGHT SIDEBAR:   TableOfContents (desktop) | Backlinks
FOOTER:          GitHub | LinkedIn | RSS links
```

---

## Feature List

| ID | Feature | Priority | Source Docs | Status |
|---|---|---|---|---|
| F-01 | Homepage / Landing Page | **P0** | content/index.md | ✅ Ready |
| F-02 | Sidebar Explorer (File Navigator) | **P0** | quartz.layout.ts | ✅ Ready |
| F-03 | Full-Text Search | **P0** | quartz.config.ts | ✅ Ready |
| F-04 | Dark / Light Mode Toggle | **P0** | quartz.config.ts | ✅ Ready |
| F-05 | Blog Post Rendering | **P0** | quartz.config.ts + posts | ✅ Ready |
| F-06 | Syntax Highlighting | **P0** | quartz.config.ts | ✅ Ready |
| F-07 | Table of Contents | P1 | quartz.config.ts + layout | ✅ Ready |
| F-08 | Graph View | P1 | docs/features/graph view.md | ⚠️ [GAP-05] |
| F-09 | Backlinks Panel | P1 | quartz.layout.ts | ✅ Ready |
| F-10 | Tag Pages & Folder Listings | P1 | quartz.config.ts | ✅ Ready |
| F-11 | Popover Previews | P1 | quartz.config.ts | ✅ Ready |
| F-12 | RSS Feed | P1 | quartz.config.ts | ✅ Ready |
| F-13 | Breadcrumbs | P2 | quartz.layout.ts | ✅ Ready |
| F-14 | SPA Routing | P2 | quartz.config.ts | ✅ Ready |
| F-15 | 404 Not Found Page | P2 | quartz.config.ts | ✅ Ready |
| F-16 | Wikilinks Resolution | P1 | quartz.config.ts + posts | ✅ Ready |
| F-17 | Content Category Sections | **P0** | content/index.md | ✅ Ready |

---

## Coverage Gaps

| Gap ID | Severity | Description |
|---|---|---|
| GAP-01 | 🔴 High | `SPEC.md` missing — all acceptance criteria are agent-inferred |
| GAP-02 | 🔴 High | `WALKTHROUGH.md` missing — all user flows are agent-inferred |
| GAP-03 | 🟡 Medium | `README.md` is upstream Quartz template, not project-specific |
| GAP-04 | 🟢 Low | til, tools, notes, projects sections have very few posts — limited content coverage |
| GAP-05 | 🟢 Low | Graph view not explicitly placed in quartz.layout.ts — verify at runtime |
| GAP-06 | 🟢 Low | No auth/test accounts needed (N/A — public static site) |

---

## Environments

| Name | URL | QA Safe? |
|---|---|---|
| local-dev | http://localhost:8080 | ✅ YES |
| production | https://nikila.dev | ❌ NO |
