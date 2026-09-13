const API_URL = "https://nikila-pv-func-prod-stttwu.azurewebsites.net/views"
const TIMEOUT_MS = 3500

let currentGeneration = 0
let activeAbortController: AbortController | null = null

async function updatePageviewBadge() {
  const generation = ++currentGeneration

  // Cancel in-flight request from previous navigation
  if (activeAbortController) {
    activeAbortController.abort()
    activeAbortController = null
  }

  const badge = document.querySelector("[data-pageview-badge]") as HTMLElement | null
  if (!badge) {
    return
  }

  const countElement = badge.querySelector("[data-pageview-count]") as HTMLElement | null

  // Setup abort controller for timeout and rapid navigation cancellation
  const controller = new AbortController()
  activeAbortController = controller
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  const currentPath =
    badge.getAttribute("data-canonical-path") ||
    window.location.pathname.replace(/(\/index)?(\.html)?\/?$/, "") ||
    "/"

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

    // Ensure page has not navigated while request was in-flight
    if (generation !== currentGeneration) {
      return
    }

    if (!response.ok) {
      // Non-200 response (404, rate limit, server error) -> leave badge blank
      if (countElement) {
        countElement.textContent = ""
      }
      badge.style.display = "none"
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
      badge.style.display = ""
      badge.classList.remove("pageview-loading")
      badge.classList.add("pageview-loaded")
    } else {
      if (countElement) {
        countElement.textContent = ""
      }
      badge.style.display = "none"
    }
  } catch {
    // Quiet timeout or network failure - do not disrupt blog reader experience
    if (generation === currentGeneration) {
      if (countElement) {
        countElement.textContent = ""
      }
      badge.style.display = "none"
    }
  } finally {
    if (activeAbortController === controller) {
      activeAbortController = null
    }
  }
}

// Initial load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updatePageviewBadge)
} else {
  updatePageviewBadge()
}

// Quartz SPA navigation event
document.addEventListener("nav", updatePageviewBadge)
