function initGallery() {
  const galleries = document.querySelectorAll(".terminal-gallery")
  if (galleries.length === 0) return

  galleries.forEach((gallery) => {
    if (gallery.hasAttribute("data-gallery-initialized")) return
    gallery.setAttribute("data-gallery-initialized", "true")

    const slides = Array.from(gallery.querySelectorAll(".terminal-gallery-slide"))
    if (slides.length === 0) return

    const counter = gallery.querySelector("[data-gallery-counter]")
    const viewport = gallery.querySelector(".terminal-gallery-viewport")

    let currentIndex = 0
    let timer: number | null = null
    let visible = false
    const intervalTime = parseInt(gallery.getAttribute("data-interval") || "3200", 10)

    // Slides after the first carry data-src; load only the current and next image.
    function hydrate(index: number) {
      const img = slides[index]?.querySelector<HTMLImageElement>("img[data-src]")
      if (img) {
        img.src = img.dataset.src!
        img.removeAttribute("data-src")
      }
    }

    function updateUI() {
      hydrate(currentIndex)
      hydrate((currentIndex + 1) % slides.length)
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
      if (!timer && visible) {
        timer = window.setInterval(nextSlide, intervalTime)
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

    // Autoplay only while the gallery is on screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) startTimer()
        else stopTimer()
      },
      { threshold: 0.25 },
    )
    observer.observe(gallery)

    // Clean up timer on Quartz SPA navigation
    if (typeof window.addCleanup === "function") {
      window.addCleanup(() => {
        stopTimer()
        observer.disconnect()
      })
    }

    // Click on viewport advances to next slide immediately
    if (viewport) {
      viewport.addEventListener("click", () => nextSlide())
    }

    // Keyboard navigation when focused
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

if (document.readyState === "complete") {
  initGallery()
}
