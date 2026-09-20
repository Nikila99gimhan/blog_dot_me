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
    const intervalTime = parseInt(gallery.getAttribute("data-interval") || "4500", 10)

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
      if (!timer) {
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

    // Pause on hover
    gallery.addEventListener("mouseenter", stopTimer)
    gallery.addEventListener("mouseleave", startTimer)
    gallery.addEventListener("touchstart", stopTimer, { passive: true })

    // Click on viewport advances to next slide
    if (viewport) {
      viewport.addEventListener("click", () => nextSlide())
    }

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
