/**
 * Privacy-preserving Live Pageview Tracker for nikila.dev
 * Powered by Azure Functions & Cosmos DB
 */
;(() => {
  const API_URL = "https://nikila-pv-func-prod-stttwu.azurewebsites.net/views"
  const TIMEOUT_MS = 8000

  let activePath = null
  let activeController = null
  let currentGeneration = 0

  async function updatePageviewBadge() {
    const badge = document.querySelector("[data-pageview-badge]")
    if (!badge) {
      if (activeController) {
        activeController.abort()
        activeController = null
        activePath = null
      }
      return
    }

    const currentPath =
      badge.getAttribute("data-canonical-path") ||
      window.location.pathname.replace(/(\/index)?(\.html)?\/?$/, "") ||
      "/"

    // Guard against redundant duplicate invocations on initial page load / refresh
    if (activePath === currentPath && activeController) {
      return
    }

    if (activeController) {
      activeController.abort()
      activeController = null
    }

    const generation = ++currentGeneration
    activePath = currentPath
    const controller = new AbortController()
    activeController = controller
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

    const countElement = badge.querySelector("[data-pageview-count]")

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({ path: currentPath }),
        signal: controller.signal,
        mode: "cors",
        credentials: "omit",
      })

      clearTimeout(timeoutId)

      // Ensure page has not navigated away while request was in-flight
      if (generation !== currentGeneration) {
        return
      }

      if (!response.ok) {
        // 404 or other HTTP error
        if (response.status === 404 && countElement) {
          countElement.textContent = "0 views"
        }
        return
      }

      const data = await response.json()
      if (typeof data?.views === "number") {
        const countFormatted = new Intl.NumberFormat().format(data.views)
        if (countElement) {
          countElement.textContent = `${countFormatted} views`
        } else {
          badge.textContent = `${countFormatted} views`
        }
        badge.classList.remove("pageview-loading")
        badge.classList.add("pageview-loaded")
      }
    } catch (err) {
      // Ignore intentional navigation aborts
      if (err?.name === "AbortError") {
        return
      }
      // On transient error, keep badge visible rather than disappearing
    } finally {
      if (activeController === controller) {
        activeController = null
        activePath = null
      }
    }
  }

  // Quartz SPA router triggers "nav" on initial load and every navigation
  document.addEventListener("nav", updatePageviewBadge)

  // Fallback for direct non-SPA page loads / cached loads
  if (document.readyState === "complete") {
    updatePageviewBadge()
  }
})()
