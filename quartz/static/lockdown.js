/**
 * LOCKDOWN — Article-page only, click blocker.
 * Only activates on the AGC article. Does NOT redirect any page.
 * All internal link clicks are silently cancelled — user stays put.
 * Remove this file + the <script> in Head.tsx when blog is ready.
 */
;(function () {
  var TARGET = "/devops/azure-application-gateway-for-containers/"

  // Normalise pathname (handle trailing-slash variance)
  var current = window.location.pathname.replace(/\/?$/, "/")

  // Only activate on the article page — do nothing everywhere else
  if (current !== TARGET) return

  // ── 1. Block all internal <a> clicks in capture phase ──────────────────────
  //    (fires before Quartz's own click handler so SPA nav never starts)
  document.addEventListener(
    "click",
    function (e) {
      // Walk up DOM to find closest <a>
      var el = e.target
      while (el && el.tagName !== "A") el = el.parentElement
      if (!el) return

      var href = el.getAttribute("href") || ""

      // Allow same-page anchor jumps (TOC headings etc.)
      if (href.startsWith("#")) return

      // Block all same-origin navigations
      try {
        var url = new URL(href, window.location.origin)
        if (url.origin === window.location.origin && url.pathname !== TARGET) {
          e.preventDefault()
          e.stopImmediatePropagation()
        }
      } catch (_) {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
    },
    true // capture = fires before Quartz SPA listener
  )

  // ── 2. Override window.spaNavigate (Quartz's router) with a no-op ──────────
  //    Quartz sets this after spa.inline.ts loads. We intercept the setter
  //    so any SPA navigation call is silently dropped.
  Object.defineProperty(window, "spaNavigate", {
    set: function () { /* drop */ },
    get: function () { return function () { /* no-op */ } },
    configurable: true,
  })
})()
