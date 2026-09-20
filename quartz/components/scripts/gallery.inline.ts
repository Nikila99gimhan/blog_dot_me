function initGallery() {
  const galleries = document.querySelectorAll(".terminal-gallery")
  if (galleries.length === 0) return

  galleries.forEach((gallery) => {
    if (gallery.hasAttribute("data-gallery-initialized")) return
    gallery.setAttribute("data-gallery-initialized", "true")

    const slides = Array.from(gallery.querySelectorAll(".terminal-gallery-slide"))
    if (slides.length === 0) return

    const counter = gallery.querySelector("[data-gallery-counter]")
    const statusIndicator = gallery.querySelector("[data-gallery-status]")
    const captionEl = gallery.querySelector("[data-gallery-caption]")
    const prevBtn = gallery.querySelector("[data-gallery-prev]")
    const nextBtn = gallery.querySelector("[data-gallery-next]")
    const toggleBtn = gallery.querySelector("[data-gallery-toggle]")
    const dotsContainer = gallery.querySelector("[data-gallery-dots]")

    let currentIndex = 0
    let isPlaying = true
    let timer: number | null = null
    const intervalTime = parseInt(gallery.getAttribute("data-interval") || "4500", 10)

    if (dotsContainer && dotsContainer.children.length === 0) {
      slides.forEach((_, i) => {
        const dot = document.createElement("button")
        dot.className = "gallery-dot" + (i === 0 ? " active" : "")
        dot.setAttribute("aria-label", `Slide ${i + 1}`)
        dot.addEventListener("click", () => goToSlide(i))
        dotsContainer.appendChild(dot)
      })
    }

    const dotButtons = dotsContainer
      ? Array.from(dotsContainer.querySelectorAll(".gallery-dot"))
      : []

    function updateUI() {
      slides.forEach((slide, i) => {
        if (i === currentIndex) {
          slide.classList.add("active")
        } else {
          slide.classList.remove("active")
        }
      })

      if (counter) {
        const current = String(currentIndex + 1).padStart(2, "0")
        const total = String(slides.length).padStart(2, "0")
        counter.textContent = `${current} / ${total}`
      }

      if (captionEl) {
        const activeSlide = slides[currentIndex]
        const caption = activeSlide.getAttribute("data-caption") || ""
        captionEl.textContent = caption
      }

      dotButtons.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.add("active")
        } else {
          dot.classList.remove("active")
        }
      })
    }

    function goToSlide(index: number) {
      currentIndex = (index + slides.length) % slides.length
      updateUI()
      resetTimer()
    }

    function nextSlide() {
      goToSlide(currentIndex + 1)
    }

    function prevSlide() {
      goToSlide(currentIndex - 1)
    }

    function startTimer() {
      if (!timer && isPlaying) {
        timer = window.setInterval(nextSlide, intervalTime)
        if (statusIndicator) statusIndicator.textContent = "AUTO-PLAY"
        if (toggleBtn) toggleBtn.textContent = "⏸ PAUSE"
      }
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }

    function resetTimer() {
      stopTimer()
      startTimer()
    }

    function pause() {
      stopTimer()
      if (statusIndicator) statusIndicator.textContent = "PAUSED"
    }

    function resume() {
      if (isPlaying) {
        startTimer()
      }
    }

    if (prevBtn) prevBtn.addEventListener("click", () => prevSlide())
    if (nextBtn) nextBtn.addEventListener("click", () => nextSlide())

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        isPlaying = !isPlaying
        if (isPlaying) {
          startTimer()
          toggleBtn.textContent = "⏸ PAUSE"
        } else {
          stopTimer()
          if (statusIndicator) statusIndicator.textContent = "PAUSED"
          toggleBtn.textContent = "▶ PLAY"
        }
      })
    }

    gallery.addEventListener("mouseenter", pause)
    gallery.addEventListener("mouseleave", resume)
    gallery.addEventListener("touchstart", pause, { passive: true })

    gallery.setAttribute("tabindex", "0")
    gallery.addEventListener("keydown", (e: Event) => {
      const key = (e as KeyboardEvent).key
      if (key === "ArrowLeft") {
        prevSlide()
      } else if (key === "ArrowRight") {
        nextSlide()
      }
    })

    updateUI()
    startTimer()
  })
}

document.addEventListener("nav", () => {
  initGallery()
})
