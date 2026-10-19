function initPdfEmbeds() {
  document.querySelectorAll<HTMLElement>(".pdf-lazy[data-pdf-src]").forEach((container) => {
    if (container.hasAttribute("data-pdf-initialized")) return
    container.setAttribute("data-pdf-initialized", "true")

    const trigger = container.querySelector<HTMLButtonElement>(".pdf-lazy-trigger")
    if (!trigger) return

    const load = () => {
      const frame = document.createElement("iframe")
      frame.src = container.dataset.pdfSrc!
      frame.title = container.dataset.pdfTitle ?? "PDF document"
      frame.className = "pdf-lazy-frame"
      container.replaceChildren(frame)
    }

    trigger.addEventListener("click", load, { once: true })
    if (typeof window.addCleanup === "function") {
      window.addCleanup(() => trigger.removeEventListener("click", load))
    }
  })
}

document.addEventListener("nav", () => {
  initPdfEmbeds()
})
