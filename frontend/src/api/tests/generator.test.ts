import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generateFile } from '../generator'

interface MockResponse {
  ok: boolean
  blob?: () => Promise<Blob>
  text?: () => Promise<string>
}

describe('generateFile', () => {
  // Сохраняем оригинальные значения для восстановления
  const originalFetch = globalThis.fetch
  const originalCreateObjectURL = globalThis.window?.URL?.createObjectURL
  const originalRevokeObjectURL = globalThis.window?.URL?.revokeObjectURL
  const originalCreateElement = globalThis.document?.createElement
  const originalAppendChild = globalThis.document?.body?.appendChild

  // Моки для DOM методов
  let mockBlob: Blob
  let mockObjectURL: string
  let mockAnchorElement: HTMLAnchorElement

  beforeEach(() => {
    // Мокаем fetch
    globalThis.fetch = vi.fn() as unknown as typeof fetch

    // Мокаем Blob и URL
    mockBlob = new Blob(['test data'], { type: 'text/csv' })
    mockObjectURL = 'mocked-blob-url'

    // Создаем мок для anchor элемента
    mockAnchorElement = {
      href: '',
      download: '',
      click: vi.fn(),
      remove: vi.fn(),
    } as unknown as HTMLAnchorElement

    if (!globalThis.window) {
      globalThis.window = {} as Window & typeof globalThis
    }

    Object.defineProperty(globalThis.window, 'URL', {
      value: {
        createObjectURL: vi.fn(() => mockObjectURL),
        revokeObjectURL: vi.fn(),
      },
      writable: true,
      configurable: true,
    })

    // Создаем document если его нет
    if (!globalThis.document) {
      globalThis.document = {} as Document
    }

    // Мокаем document.createElement
    Object.defineProperty(globalThis.document, 'createElement', {
      value: vi.fn(() => mockAnchorElement),
      writable: true,
      configurable: true,
    })

    // Мокаем document.body.appendChild
    Object.defineProperty(globalThis.document, 'body', {
      value: {
        appendChild: vi.fn(),
      },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    // Восстанавливаем оригинальные значения
    globalThis.fetch = originalFetch

    if (originalCreateObjectURL && originalRevokeObjectURL) {
      Object.defineProperty(globalThis.window, 'URL', {
        value: {
          createObjectURL: originalCreateObjectURL,
          revokeObjectURL: originalRevokeObjectURL,
        },
        writable: true,
        configurable: true,
      })
    }

    if (originalCreateElement) {
      Object.defineProperty(globalThis.document, 'createElement', {
        value: originalCreateElement,
        writable: true,
        configurable: true,
      })
    }

    if (originalAppendChild) {
      Object.defineProperty(globalThis.document, 'body', {
        value: {
          appendChild: originalAppendChild,
        },
        writable: true,
        configurable: true,
      })
    }

    vi.clearAllMocks()
  })

  it('должен успешно генерировать и скачивать файл', async () => {
    // Arrange
    const mockParams = new URLSearchParams({
      size: '0.1',
      withErrors: 'on',
      maxSpend: '1000',
    })

    const mockResponse: MockResponse = {
      ok: true,
      blob: vi.fn().mockResolvedValue(mockBlob),
    }
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as Response)

    // Мокаем дату для предсказуемого имени файла
    const mockDate = new Date('2024-01-15T10:30:00.000Z')
    vi.spyOn(globalThis, 'Date').mockImplementation(() => mockDate)

    // Act
    await generateFile(mockParams)

    // Assert
    // Проверяем вызов fetch с правильным URL
    expect(globalThis.fetch).toHaveBeenCalledWith(`http://localhost:3000/report?${mockParams}`)
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)

    // Проверяем получение blob из ответа
    expect(mockResponse.blob).toHaveBeenCalledTimes(1)

    // Проверяем создание URL для blob
    expect(globalThis.window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob)

    // Проверяем создание якорного элемента
    expect(globalThis.document.createElement).toHaveBeenCalledWith('a')

    // Проверяем настройку anchor элемента
    expect(mockAnchorElement.href).toBe(mockObjectURL)
    expect(mockAnchorElement.download).toBe('report_2024-01-15.csv')

    // Проверяем добавление в DOM и клик
    expect(globalThis.document.body.appendChild).toHaveBeenCalledWith(mockAnchorElement)
    expect(mockAnchorElement.click).toHaveBeenCalledTimes(1)

    // Проверяем очистку ресурсов
    expect(globalThis.window.URL.revokeObjectURL).toHaveBeenCalledWith(mockObjectURL)
    expect(mockAnchorElement.remove).toHaveBeenCalledTimes(1)
  })

  it('должен обрабатывать ошибки сервера', async () => {
    // Arrange
    const mockParams = new URLSearchParams({ size: '0.1' })

    const mockErrorResponse: MockResponse = {
      ok: false,
      text: vi.fn().mockResolvedValue('Server error message'),
    }
    vi.mocked(globalThis.fetch).mockResolvedValue(mockErrorResponse as Response)

    // Act & Assert
    await expect(generateFile(mockParams)).rejects.toThrow('Server error message')

    // Проверяем, что вызов text() был выполнен
    expect(mockErrorResponse.text).toHaveBeenCalledTimes(1)

    // Проверяем, что URL не создавался при ошибке
    expect(globalThis.window.URL.createObjectURL).not.toHaveBeenCalled()
    expect(globalThis.document.createElement).not.toHaveBeenCalled()
  })

  it('должен корректно передавать параметры в URL', async () => {
    // Arrange
    const mockParams = new URLSearchParams({
      size: '2.5',
      withErrors: 'off',
      maxSpend: '5000',
      category: 'premium',
    })

    const mockResponse: MockResponse = {
      ok: true,
      blob: vi.fn().mockResolvedValue(mockBlob),
    }
    vi.mocked(globalThis.fetch).mockResolvedValue(mockResponse as Response)

    // Act
    await generateFile(mockParams)

    // Assert
    expect(globalThis.fetch).toHaveBeenCalledWith(`http://localhost:3000/report?${mockParams}`)
  })
})
