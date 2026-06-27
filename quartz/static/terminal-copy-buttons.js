/**
 * terminal-copy-buttons.js
 * Injects copy buttons into all fenced code blocks.
 * Runs after Quartz page transitions (SPA-aware).
 */

(function () {
  function addCopyButtons() {
    const codeBlocks = document.querySelectorAll("pre:not([data-copy-injected])")

    codeBlocks.forEach((pre) => {
      pre.setAttribute("data-copy-injected", "true")

      // Don't add to inline-style pres or empty ones
      const code = pre.querySelector("code")
      if (!code) return

      const button = document.createElement("button")
      button.className = "copy-button"
      button.setAttribute("aria-label", "Copy code")
      button.textContent = "copy"

      button.addEventListener("click", async () => {
        const text = code.innerText || code.textContent || ""
        try {
          await navigator.clipboard.writeText(text)
          button.textContent = "copied!"
          button.classList.add("copied")
          setTimeout(() => {
            button.textContent = "copy"
            button.classList.remove("copied")
          }, 2000)
        } catch {
          // Fallback for non-secure contexts
          const range = document.createRange()
          range.selectNode(code)
          window.getSelection().removeAllRanges()
          window.getSelection().addRange(range)
          document.execCommand("copy")
          window.getSelection().removeAllRanges()
          button.textContent = "copied!"
          button.classList.add("copied")
          setTimeout(() => {
            button.textContent = "copy"
            button.classList.remove("copied")
          }, 2000)
        }
      })

      // Insert relative to pre
      pre.style.position = "relative"
      pre.appendChild(button)
    })
  }

  // Run on initial load
  addCopyButtons()

  // Re-run after Quartz SPA navigation
  document.addEventListener("nav", () => {
    addCopyButtons()
  })
})()
