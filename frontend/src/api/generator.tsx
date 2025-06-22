export const generateFile = async (params: URLSearchParams): Promise<void> => {
  const response: Response = await fetch(`http://localhost:3000/report?${params}`)

  if (!response.ok) {
    throw new Error(await response.text())
  }
  const blob: Blob = await response.blob()
  const url: string = window.URL.createObjectURL(blob)
  const a: HTMLAnchorElement = document.createElement('a')
  a.href = url
  a.download = `report_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  a.remove()
}
