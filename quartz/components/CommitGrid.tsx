import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/commitGrid.scss"
// @ts-ignore
import script from "./scripts/commitGrid.inline"

export default (() => {
  const CommitGrid: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    // Generate a 7x50 grid of divs (350 cells)
    const cells = Array.from({ length: 7 * 50 }, (_, i) => <div class="commit-cell" key={i}></div>)
    
    return (
      <div class={`commit-grid-container ${displayClass ?? ""}`} aria-label="Interactive commit grid">
        <div class="commit-grid">
          {cells}
        </div>
      </div>
    )
  }

  CommitGrid.css = style
  CommitGrid.afterDOMLoaded = script

  return CommitGrid
}) satisfies QuartzComponentConstructor
