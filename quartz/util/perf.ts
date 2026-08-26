import { styleText } from "util"

export class PerfTimer {
  evts: { [key: string]: number }

  constructor() {
    this.evts = {}
    this.addEvent("start")
  }

  addEvent(evtName: string) {
    this.evts[evtName] = performance.now()
  }

  timeSince(evtName?: string): string {
    const elapsed = performance.now() - (this.evts[evtName ?? "start"] ?? performance.now())
    const formatted =
      elapsed >= 1000
        ? `${(elapsed / 1000).toFixed(elapsed >= 10000 ? 0 : 2)}s`
        : `${Math.round(elapsed)}ms`
    return styleText("yellow", formatted)
  }
}
