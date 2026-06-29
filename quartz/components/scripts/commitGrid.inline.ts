document.addEventListener("nav", () => {
  const container = document.querySelector(".commit-grid") as HTMLElement
  if (!container) return

  const cells = Array.from(container.querySelectorAll(".commit-cell"))
  if (cells.length === 0) return

  // Randomly light up some cells on load to make it look active
  cells.forEach(cell => {
    if (Math.random() > 0.8) {
      const intensity = Math.floor(Math.random() * 4) + 1
      cell.className = `commit-cell active-${intensity}`
      
      // Start fading out at random times
      setTimeout(() => {
        cell.className = "commit-cell"
      }, Math.random() * 2000)
    }
  })

  // Interactive "trail" effect when hovering
  container.addEventListener("mouseover", (e) => {
    const target = e.target as HTMLElement
    if (target.classList.contains("commit-cell")) {
      const intensity = Math.floor(Math.random() * 4) + 1
      
      // Instantly apply the active color (bypassing transition via CSS rule)
      target.className = `commit-cell active-${intensity}`
      
      // Give it a tiny delay, then remove the class. 
      // This allows the 0.8s CSS transition on the base class to smoothly fade it back to gray.
      setTimeout(() => {
        target.className = "commit-cell"
      }, 50)
    }
  })
})
