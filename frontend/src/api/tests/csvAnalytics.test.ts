import { describe, expect, it, vi, type Mock } from 'vitest'
import { uploadFile, type AnalyticsResponse } from '../csvAnalytics'

const mockFile = new File(['content'], 'test.csv', { type: 'text/csv' })

const mockOnProgress = vi.fn()

// Мок глобального fetch
global.fetch = vi.fn()

describe('uploadFile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('успешно загружает файл и обрабатывает поток', async () => {
    // Мок ответа с потоком данных
    const response1: AnalyticsResponse = {
      total_spend_galactic: 0,
      rows_affected: 0,
      less_spent_at: 0,
      big_spent_at: 0,
      less_spent_value: 0,
      big_spent_value: 0,
      average_spend_galactic: 0,
      big_spent_civ: '',
      less_spent_civ: '',
    }

    const response2: AnalyticsResponse = {
      total_spend_galactic: 5047274,
      rows_affected: 10000,
      less_spent_at: 36,
      big_spent_at: 359,
      less_spent_value: 3488,
      big_spent_value: 25768,
      average_spend_galactic: 504.7274,
      big_spent_civ: 'monsters',
      less_spent_civ: 'humans',
    }

    const mockStream = createMockStream([
      JSON.stringify(response1) + '\n',
      JSON.stringify(response2) + '\n',
    ])

    ;(fetch as Mock).mockResolvedValueOnce({
      ok: true,
      body: mockStream,
    })

    const result = await uploadFile(mockFile, 10, mockOnProgress)

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/aggregate?rows=10',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    )

    // Проверяем вызовы onProgress
    expect(mockOnProgress).toHaveBeenCalledTimes(2)
    expect(mockOnProgress).toHaveBeenNthCalledWith(1, {
      total_spend_galactic: 0,
      rows_affected: 0,
      less_spent_at: 0,
      big_spent_at: 0,
      less_spent_value: 0,
      big_spent_value: 0,
      average_spend_galactic: 0,
      big_spent_civ: '',
      less_spent_civ: '',
    })
    expect(mockOnProgress).toHaveBeenNthCalledWith(2, {
      total_spend_galactic: 5047274,
      rows_affected: 10000,
      less_spent_at: 36,
      big_spent_at: 359,
      less_spent_value: 3488,
      big_spent_value: 25768,
      average_spend_galactic: 504.7274,
      big_spent_civ: 'monsters',
      less_spent_civ: 'humans',
    })

    // Проверяем финальный результат
    expect(result).toEqual({
      total_spend_galactic: 5047274,
      rows_affected: 10000,
      less_spent_at: 36,
      big_spent_at: 359,
      less_spent_value: 3488,
      big_spent_value: 25768,
      average_spend_galactic: 504.7274,
      big_spent_civ: 'monsters',
      less_spent_civ: 'humans',
    })
  })

  it('обрабатывает HTTP ошибки', async () => {
    ;(fetch as Mock).mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('Server error'),
    })

    await expect(uploadFile(mockFile, 10, mockOnProgress)).rejects.toThrow('Server error')
  })

  it('бросает ошибку при наличии null в данных', async () => {
    const mockStream = createMockStream([
      JSON.stringify({
        total_spend_galactic: 5047274,
        rows_affected: null,
        less_spent_at: 36,
        big_spent_at: 359,
        less_spent_value: 3488,
        big_spent_value: 25768,
        average_spend_galactic: 504.7274,
        big_spent_civ: 'monsters',
        less_spent_civ: 'humans',
      }) + '\n',
    ])

    ;(fetch as Mock).mockResolvedValue({
      ok: true,
      body: mockStream,
    })

    await expect(uploadFile(mockFile, 10, mockOnProgress)).rejects.toThrow(
      'Обнаружены null значения в данных'
    )
  })

  it('бросает ошибку при отсутствии данных', async () => {
    // Пустой поток
    const mockStream = createMockStream([])

    ;(fetch as Mock).mockResolvedValue({
      ok: true,
      body: mockStream,
    })

    await expect(uploadFile(mockFile, 10, mockOnProgress)).rejects.toThrow(
      'Не получили валидных данных'
    )
  })
})

// Вспомогательная функция для создания мока потока
function createMockStream(chunks: string[]): ReadableStream {
  const encoder = new TextEncoder()
  let index = 0

  return new ReadableStream({
    async pull(controller) {
      if (index < chunks.length) {
        controller.enqueue(encoder.encode(chunks[index]))
        index++
      } else {
        controller.close()
      }
    },
  })
}
