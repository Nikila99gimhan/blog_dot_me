import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { ArticleList, getArticles } from "./ArticleIndex"
import { AUTHOR } from "../util/seo"

const LINKEDIN = AUTHOR.sameAs[1]

const selectedWork = [
  {
    slug: "notes/arc-github-runners-platform-as-a-service/index",
    label: "Architecture blueprint",
    title: "GitHub runners as a platform service",
    description:
      "A technical deep dive into Actions Runner Controller and a platform approach to CI runners on Kubernetes.",
    tech: ["GitHub Actions", "ARC", "Kubernetes", "EKS"],
    action: "Explore the blueprint",
  },
  {
    slug: "notes/anyscale-on-azure/index",
    label: "Architecture notes",
    title: "Anyscale on Azure",
    description:
      "Architecture notes on Ray, distributed workloads, and Managed Ray on Azure Kubernetes Service.",
    tech: ["Ray", "AKS", "Azure", "AI workloads"],
    action: "Explore the architecture",
  },
]

const communities = [
  {
    name: "Sri Lanka Developer Forum",
    href: "https://www.devforum.lk/",
    logo: "logos/sri-lanka-developer-forum-logo.png",
    desc: "Technical sessions, workshops & mentorship for Sri Lanka's developer community.",
  },
  {
    name: "Cloud Native Sri Lanka",
    href: "https://www.facebook.com/CloudNativeSL/",
    logo: "logos/cloud-native-sri-lanka-logo.jpg",
    desc: "CNCF ecosystem meetups on Kubernetes & platform engineering.",
  },
]

export default (() => {
  const PortfolioHome: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
    const slug = fileData.slug!
    const href = (target: string) => resolveRelative(slug, target as FullSlug)
    const latest = getArticles(allFiles, ["devops", "notes"]).slice(0, 3)
    const latestTalk = getArticles(allFiles, ["tech-talks"])[0]
    const workSlugs = new Set(allFiles.map((page) => page.slug))

    return (
      <div class="portfolio-home">
        <section class="ph-hero" aria-labelledby="ph-name">
          <div class="ph-intro">
            <p class="ph-prompt">$ whoami</p>
            <h1 class="ph-name" id="ph-name">
              Nikila Fernando<span class="ph-dot" aria-hidden="true">.</span>
            </h1>
            <p class="ph-role">Platform Engineer · Microsoft MVP</p>
            <p class="ph-tagline">
              Building cloud-native platforms.
              <br />
              Sharing the blueprints along the way.
            </p>
            <div class="ph-actions">
              <a class="ph-btn ph-btn-primary" href={href("work")}>
                Explore my work <span aria-hidden="true">↗</span>
              </a>
              <a class="ph-btn" href="#contact">
                Discuss a project <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <aside class="ph-terminal" aria-label="Profile summary">
            <div class="ph-terminal-bar">
              <span class="hero-card-dots" aria-hidden="true">
                <span class="dot-red"></span>
                <span class="dot-yellow"></span>
                <span class="dot-green"></span>
              </span>
              <span class="ph-terminal-path">~/about/profile.sh</span>
            </div>
            <div class="ph-terminal-body">
              <p class="ph-cmd">$ cat focus.txt</p>
              <p>Kubernetes · Platform engineering</p>
              <p>Azure · AWS · Infrastructure as code</p>
              <p class="ph-cmd">$ cat community.txt</p>
              <p>Sri Lanka Developer Forum</p>
              <p>Cloud Native Sri Lanka</p>
              <p class="ph-cmd">
                $ <span class="ph-cursor" aria-hidden="true"></span>
              </p>
            </div>
          </aside>
        </section>

        <section class="ph-strip" aria-label="Credentials">
          <span class="ph-strip-item ph-strip-mvp">Microsoft MVP · 2026–2027</span>
          <span class="ph-strip-item">Kubernetes · Cloud architecture · DevOps</span>
          <a class="ph-strip-link" href={href("about")}>
            Profile &amp; credentials <span aria-hidden="true">↗</span>
          </a>
        </section>

        <section class="ph-section" aria-labelledby="ph-work">
          <div class="ph-section-head">
            <h2 class="ph-section-title" id="ph-work">
              <span class="ph-num">01 /</span> Selected architecture
            </h2>
            <a class="ph-more" href={href("work")}>
              All blueprints <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div class="ph-cards">
            {selectedWork
              .filter((item) => workSlugs.has(item.slug as FullSlug))
              .map((item) => (
                <div class="ph-card">
                  <p class="ph-card-label">{item.label}</p>
                  <h3 class="ph-card-title">
                    <a href={href(item.slug)}>{item.title}</a>
                  </h3>
                  <p class="ph-card-desc">{item.description}</p>
                  <ul class="ph-card-tech" aria-label="Technologies">
                    {item.tech.map((tech) => (
                      <li>{tech}</li>
                    ))}
                  </ul>
                  <span class="ph-card-action" aria-hidden="true">
                    {item.action} →
                  </span>
                </div>
              ))}
          </div>
        </section>

        <section class="ph-section" aria-labelledby="ph-writing">
          <div class="ph-section-head">
            <h2 class="ph-section-title" id="ph-writing">
              <span class="ph-num">02 /</span> Latest writing
            </h2>
            <a class="ph-more" href={href("blog")}>
              Browse the blog <span aria-hidden="true">↗</span>
            </a>
          </div>
          <ArticleList pages={latest} currentSlug={slug} />
        </section>

        <section class="ph-section ph-beyond" aria-labelledby="ph-beyond">
          <div class="ph-section-head">
            <div>
              <h2 class="ph-eyebrow" id="ph-beyond">
                Beyond the terminal
              </h2>
              <p class="ph-beyond-text">
                Speaking, workshops &amp; developer communities in Sri Lanka.
              </p>
            </div>
            <a class="ph-more" href={href("tech-talks/index")}>
              Talks &amp; community <span aria-hidden="true">↗</span>
            </a>
          </div>
          <ul class="ph-beyond-list">
            {latestTalk && (
              <li class="ph-beyond-item">
                <span class="ph-beyond-kind">Latest talk</span>
                <a href={href(latestTalk.slug!)}>{latestTalk.frontmatter?.title}</a>
              </li>
            )}
            {communities.map((community) => (
              <li class="ph-beyond-item">
                <img
                  class="ph-beyond-logo"
                  src={href(community.logo)}
                  alt=""
                  width={28}
                  height={28}
                  loading="lazy"
                />
                <span class="ph-beyond-kind">Organizer</span>
                <a href={community.href} target="_blank" rel="noopener noreferrer">
                  {community.name}
                </a>
                <span class="ph-beyond-desc">{community.desc}</span>
              </li>
            ))}
          </ul>
          <p class="ph-beyond-links">
            <a href={href("tech-talks/index")}>Talks &amp; slides →</a>
            <a href={href("communities/index")}>Communities →</a>
            <a href={href("about")}>Event gallery →</a>
          </p>
        </section>

        <section class="ph-cta" id="contact" aria-labelledby="ph-cta-title">
          <div class="ph-cta-text">
            <p class="ph-prompt">$ let's build something</p>
            <h2 class="ph-cta-title" id="ph-cta-title">
              Have a platform challenge?
            </h2>
            <p>
              Let's discuss cloud architecture, Kubernetes, platform engineering, delivery
              workflows, or a hands-on technical workshop.
            </p>
          </div>
          <a class="ph-btn ph-btn-primary" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
            Start a conversation <span aria-hidden="true">↗</span>
          </a>
        </section>
      </div>
    )
  }

  return PortfolioHome
}) satisfies QuartzComponentConstructor
