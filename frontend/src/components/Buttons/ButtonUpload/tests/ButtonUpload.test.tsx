import { cleanup, render, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, test, expect, vi } from 'vitest'
import { ButtonUpload } from '../ButtonUpload'
import styles from '../ButtonUpload.module.css'

// Создаем mock-функции для обработчиков
const mockOnFileSelect = vi.fn()
const mockOnClear = vi.fn()

// Создаем тестовый файл
const createTestFile = (name: string, type: string) => new File(['content'], name, { type })

const hasClass = (element: HTMLElement, className: string) => element.className.includes(className)

describe('ButtonUpload Component', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  test('renders initial state correctly', () => {
    render(
      <ButtonUpload
        file={null}
        isError={false}
        onFileSelect={mockOnFileSelect}
        onClear={mockOnClear}
      />
    )

    // Проверяем основные элементы
    expect(screen.getByText('Загрузить файл')).toBeInTheDocument()
    expect(screen.getByText('или перетащите сюда')).toBeInTheDocument()
    expect(screen.getByLabelText('Загрузить файл')).toBeInTheDocument()
  })

  test('handles file selection via input', async () => {
    const testFile = createTestFile('test.csv', 'text/csv')

    const { getByTestId } = render(
      <ButtonUpload
        file={null}
        isError={false}
        onFileSelect={mockOnFileSelect}
        onClear={mockOnClear}
      />
    )

    const input = getByTestId('file-input') as HTMLInputElement

    // Симулируем выбор файла
    fireEvent.change(input, {
      target: { files: [testFile] },
    })

    // Проверяем вызов обработчика
    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith(testFile, false)
    })
  })

  test('handles drag and drop events', () => {
    const testFile = createTestFile('drag.csv', 'text/csv')

    const { getByTestId } = render(
      <ButtonUpload
        file={null}
        isError={false}
        onFileSelect={mockOnFileSelect}
        onClear={mockOnClear}
      />
    )

    const uploadBox = getByTestId('upload-box')

    // Начинаем перетаскивание
    fireEvent.dragOver(uploadBox)

    // Проверяем класс через вспомогательную функцию
    expect(hasClass(uploadBox, 'dragging')).toBe(true)

    // Завершаем перетаскивание
    fireEvent.drop(uploadBox, {
      dataTransfer: { files: [testFile] },
    })

    // Проверяем вызов обработчика
    expect(mockOnFileSelect).toHaveBeenCalledWith(testFile, false)

    // Проверяем, что класс dragging удален
    expect(hasClass(uploadBox, 'dragging')).toBe(false)
  })

  test('rejects invalid file types', () => {
    const invalidFile = createTestFile('image.jpg', 'image/jpeg')

    const { container } = render(
      <ButtonUpload
        file={null}
        isError={false}
        onFileSelect={mockOnFileSelect}
        onClear={mockOnClear}
      />
    )

    const uploadBox = container.querySelector(`.${styles.uploadBox}`)

    // Пытаемся загрузить невалидный файл
    fireEvent.drop(uploadBox!, {
      dataTransfer: { files: [invalidFile] },
    })

    // Проверяем обработку ошибки
    expect(mockOnFileSelect).toHaveBeenCalledWith(invalidFile, true)
  })

  test('displays file name when file is selected', () => {
    const testFile = createTestFile('data.csv', 'text/csv')

    render(
      <ButtonUpload
        file={testFile}
        isError={false}
        onFileSelect={mockOnFileSelect}
        onClear={mockOnClear}
      />
    )

    expect(screen.getByText('data.csv')).toBeInTheDocument()
    expect(screen.getByText('файл загружен!')).toBeInTheDocument()
  })

  test('shows loading state', () => {
    const testFile = createTestFile('loading.csv', 'text/csv')

    render(
      <ButtonUpload
        file={testFile}
        isError={false}
        isLoading={true}
        onFileSelect={mockOnFileSelect}
        onClear={mockOnClear}
      />
    )

    // Проверяем отображение спиннера
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
    expect(screen.getByText('идёт парсинг файла')).toBeInTheDocument()
  })

  test('shows error state', () => {
    const testFile = createTestFile('error.csv', 'text/csv')

    const { getByTestId } = render(
      <ButtonUpload
        file={testFile}
        isError={true}
        onFileSelect={mockOnFileSelect}
        onClear={mockOnClear}
      />
    )

    const uploadBox = getByTestId('upload-box')

    // Проверяем сообщение
    expect(screen.getByText('упс, не то...')).toBeInTheDocument()

    // Проверяем классы ошибки через вспомогательную функцию
    expect(hasClass(uploadBox, 'errorBorder')).toBe(true)
  })

  test('shows success state', () => {
    const testFile = createTestFile('success.csv', 'text/csv')

    const { getByTestId } = render(
      <ButtonUpload
        file={testFile}
        isError={false}
        isSuccess={true}
        onFileSelect={mockOnFileSelect}
        onClear={mockOnClear}
      />
    )

    const uploadBox = getByTestId('upload-box')

    // Проверяем сообщение
    expect(screen.getByText('готово!')).toBeInTheDocument()

    // Проверяем классы успеха через вспомогательную функцию
    expect(hasClass(uploadBox, 'successBackground')).toBe(true)
  })

  test('handles file clear', () => {
    const testFile = createTestFile('clear.csv', 'text/csv')

    render(
      <ButtonUpload
        file={testFile}
        isError={false}
        onFileSelect={mockOnFileSelect}
        onClear={mockOnClear}
      />
    )

    // Находим и кликаем на иконку очистки
    const clearButton = screen.getByTestId('clear-button')
    fireEvent.click(clearButton)

    // Проверяем вызов обработчика
    expect(mockOnClear).toHaveBeenCalled()
  })

  test('does not show clear button during loading', () => {
    const testFile = createTestFile('loading.csv', 'text/csv')

    render(
      <ButtonUpload
        file={testFile}
        isError={false}
        isLoading={true}
        onFileSelect={mockOnFileSelect}
        onClear={mockOnClear}
      />
    )

    expect(screen.queryByTestId('clear-button')).not.toBeInTheDocument()
  })
})
