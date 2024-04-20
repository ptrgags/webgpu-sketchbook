/**
 * At least in Chrome, right click + save image as... is greyed out for
 * WebGPU contexts, so convert to a data URL and simulate clicking a download
 * button.
 *
 * @param canvas The canvas to save a screenshot of
 * @param filename The filename (without path) of what to save the image as.
 * e.g. "screenshot.png"
 */
export function download_screenshot(canvas: HTMLCanvasElement, filename: string) {
  const data_url = canvas.toDataURL()

  const a = document.createElement('a')
  a.href = data_url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}
