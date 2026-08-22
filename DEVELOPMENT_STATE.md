# blog_dot_me — Development State

## Core Architecture
- **SSG**: Quartz v4.5.2
- **Repo**: `blog_dot_me/` → nikila.dev (auto-deploys on push to `main`)
- **Content root**: `blog_dot_me/content/`
- **Structure**: One post = one directory (`<section>/<slug>/index.md`)
- **Build command**: `npx quartz build`
- **Push**: `git push origin main`

## Content Sections
| Section | Path |
|---|---|
| devops | `content/devops/` |
| notes | `content/notes/` |
| tech-talks | `content/tech-talks/` |
| til | `content/til/` |
| tools | `content/tools/` |
| communities | `content/communities/` |

## Published Posts (devops)
- `github-actions-reusable-workflows/` — GitHub Actions reusable workflows
- `kubernetes-zero-to-prod/` — K8s zero to prod walkthrough
- `azure-application-gateway-for-containers/` — Layer 7 traffic on AKS with AGC (added 2026-07-19, with 5 diagrams)

## Active Features

### 🔒 Lockdown Mode (TEMPORARY — remove when blog is ready)
**Purpose**: Share only the AGC article while other content is dummy/WIP.  
**How it works** (two-layer approach):
1. **Server-side**: `<meta http-equiv="refresh" content="0; url=/devops/azure-application-gateway-for-containers/">` injected in `Head.tsx` for every page whose `fileData.slug` is NOT `devops/azure-application-gateway-for-containers/index`. This redirects instantly, even before JS loads.
2. **Client-side SPA**: `quartz/static/lockdown.js` loaded via `<script defer>` on every page. It:
   - Hard-redirects if the user lands on a non-article URL
   - Overrides `window.spaNavigate` (Quartz's router) with a no-op via `Object.defineProperty`
   - Captures all `<a>` clicks in capture phase and blocks internal navigations
   - Blocks `popstate` and `nav` custom events from leaving the article

**To remove lockdown**: Delete `quartz/static/lockdown.js` and revert the block in `quartz/components/Head.tsx` (marked with `LOCKDOWN MODE` comment).

## Blog Style Conventions
- **Frontmatter**: `title`, `date` (YYYY-MM-DD), `tags` (flat array), `description`, `draft: false`
- **Callouts**: `> [!tip]`, `> [!warning]`, `> [!note]`, `> [!important]`, `> [!caution]`
- **Cross-links**: Wikilink syntax `[[section/slug|Label]]` in "Related Posts" section at end
- **Diagrams**: Mermaid fenced code blocks + inline PNG images (side-by-side with `index.md`, referenced as `./image.png`)
- **Tone**: Direct prose, minimal fluff, platform-engineer perspective

## Pending / Future Work
- Remove lockdown mode when remaining blog content is finalized and ready to publish
