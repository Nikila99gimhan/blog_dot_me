/**
 * LOCKDOWN MODE — Temporary
 * All navigation is intercepted and redirected back to the AGC article.
 * Remove this script (and the <script> tag in Head.tsx) when blog is ready.
 */
;(function () {
  var TARGET = "/devops/azure-application-gateway-for-containers/"

  // ── 1. Hard redirect if we land on any other page ──────────────────────────
  if (window.location.pathname !== TARGET) {
    window.location.replace(TARGET)
    return // stop — redirect is in flight
  }

  // ── 2. Intercept Quartz SPA navigation (window.spaNavigate) ────────────────
  // Quartz sets window.spaNavigate = navigate in spa.inline.ts.
  // We replace it with a no-op so internal link clicks never leave the page.
  Object.defineProperty(window, "spaNavigate", {
    set: function () {
      /* silently drop any attempt by Quartz to register its navigate fn */
    },
    get: function () {
      return function () {
        /* no-op: block all SPA navigations */
      }
    },
    configurable: true,
  })

  // ── 3. Intercept any raw <a> clicks not caught by the SPA router ────────────
  document.addEventListener(
    "click",
    function (e) {
      var el = e.target
      // Walk up the DOM to find the closest <a>
      while (el && el.tagName !== "A") el = el.parentElement
      if (!el) return

      var href = el.getAttribute("href") || ""

      // Allow: same-page anchor links (#section)
      if (href.startsWith("#")) return

      // Allow: external links (open normally in new tab etc.)
      try {
        var url = new URL(href, window.location.origin)
        if (url.origin !== window.location.origin) return
        // Internal link to a different path → block it
        if (url.pathname !== TARGET) {
          e.preventDefault()
          e.stopImmediatePropagation()
        }
      } catch (_) {
        // malformed href — block to be safe
        e.preventDefault()
        e.stopImmediatePropagation()
      }
    },
    true // capture phase — fires before Quartz's click listener
  )

  // ── 4. Block browser back/forward from leaving the article ─────────────────
  window.addEventListener("popstate", function () {
    if (window.location.pathname !== TARGET) {
      window.location.replace(TARGET)
    }
  })

  // ── 5. Guard against any late SPA nav events dispatched by Quartz ──────────
  document.addEventListener("nav", function (e) {
    var slug = e.detail && e.detail.url
    if (slug && slug !== "devops/azure-application-gateway-for-containers") {
      window.location.replace(TARGET)
    }
  })
})()
