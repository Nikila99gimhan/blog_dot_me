import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ShareButtons: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title
  if (!title || !cfg.baseUrl) return null

  // Only render on real content pages (not index/folder/tag pages)
  const slug = fileData.slug
  if (!slug || slug === "index" || slug.startsWith("tags/")) return null

  // Build the canonical URL from cfg.baseUrl (always the real domain, not localhost)
  const canonicalUrl = `https://${cfg.baseUrl}/${slug}`
  const encodedUrl = encodeURIComponent(canonicalUrl)
  const encodedTitle = encodeURIComponent(title)

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`

  return (
    <div class={classNames(displayClass, "share-buttons-container")}>
      <span class="share-label">Share:</span>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="share-btn share-linkedin"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </a>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="share-btn share-twitter"
        title="Share on X (Twitter)"
        aria-label="Share on X (Twitter)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.726-8.799L2.009 2.25h7.019l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
        X (Twitter)
      </a>
      {/* data-canonical-url stores the real nikila.dev URL, script handles click */}
      <button
        class="share-btn share-copy"
        data-canonical-url={canonicalUrl}
        title="Copy link"
        aria-label="Copy link to clipboard"
        id="share-copy-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy Link
      </button>
    </div>
  )
}

ShareButtons.css = `
.share-buttons-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin: 1.5rem 0 0.5rem 0;
  padding: 0.75rem 1rem;
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  background-color: var(--light);
}

.share-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--gray);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-right: 0.25rem;
}

.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--bodyFont);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--lightgray);
  background: transparent;
  color: var(--darkgray);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease;
  line-height: 1;
}

.share-btn:hover {
  background-color: var(--lightgray);
  color: var(--dark);
  border-color: var(--gray);
  transform: translateY(-1px);
}

.share-linkedin:hover {
  background-color: #0a66c2;
  border-color: #0a66c2;
  color: #fff;
}

.share-twitter:hover {
  background-color: var(--darkgray);
  border-color: var(--darkgray);
  color: var(--light);
}

.share-copy:hover {
  background-color: var(--secondary);
  border-color: var(--secondary);
  color: var(--light);
}

.share-copy.copied {
  background-color: var(--secondary);
  border-color: var(--secondary);
  color: var(--light);
}
`

// This runs in the browser after the DOM is ready — clean, no inline escaping issues
ShareButtons.afterDOMLoaded = `
(function() {
  var controller = null;

  function initShareCopyBtn() {
    // Cancel any previously registered listeners before re-initialising
    if (controller) controller.abort();
    controller = new AbortController();
    var signal = controller.signal;

    // Use class selector so it still works after SPA navigation replaces the DOM
    var btn = document.querySelector(".share-copy");
    if (!btn) return;

    btn.addEventListener("click", function() {
      var url = btn.getAttribute("data-canonical-url");
      if (!url) return;

      var originalHTML = btn.innerHTML;
      var checkSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

      function showCopied() {
        btn.innerHTML = checkSVG + " Copied!";
        btn.classList.add("copied");
        setTimeout(function() {
          btn.innerHTML = originalHTML;
          btn.classList.remove("copied");
        }, 2000);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(showCopied).catch(function() {
          fallbackCopy(url, showCopied);
        });
      } else {
        fallbackCopy(url, showCopied);
      }
    }, { signal: signal });
  }

  function fallbackCopy(url, onSuccess) {
    var ta = document.createElement("textarea");
    ta.value = url;
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none;";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand("copy"); onSuccess(); }
    catch(e) { console.warn("Copy failed:", e); }
    document.body.removeChild(ta);
  }

  initShareCopyBtn();
  document.addEventListener("nav", initShareCopyBtn);
})();
`

export default (() => ShareButtons) satisfies QuartzComponentConstructor
