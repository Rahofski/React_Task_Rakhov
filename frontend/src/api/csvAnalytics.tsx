export type AnalyticsResponse = {
  total_spend_galactic: number
  rows_affected: number
  less_spent_at: number
  big_spent_at: number
  less_spent_value: number
  big_spent_value: number
  average_spend_galactic: number
  big_spent_civ: string
  less_spent_civ: string
}

const hasNullFields = (data: AnalyticsResponse): boolean => {
  return Object.values(data).some((value) => value === null)
}

export const uploadFile = async (
  file: File,
  rows: number,
  onProgress: (data: AnalyticsResponse) => void
): Promise<AnalyticsResponse> => {
  const url = `http://localhost:3000/aggregate?rows=${rows}`
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(await response.text())
  }

  let finalData: AnalyticsResponse | null = null
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  if (reader) {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value)
      console.log(buffer)

      const lines = buffer.split('\n')

      // Обрабатываем все полные строки
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim()
        if (line) {
          const parsedData = JSON.parse(line) as AnalyticsResponse
          if (hasNullFields(parsedData)) {
            throw new Error('Обнаружены null значения в данных')
          }
          onProgress(parsedData)
          finalData = parsedData
        }
      }

      buffer = lines[lines.length - 1] // Сохраняем неполную строку
    }
  }

  if (!finalData) {
    throw new Error('Не получили валидных данных')
  }

  return finalData
}
