// HistoryPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HistoryPage } from '../HistoryPage'
import { useStore, type HistoryItem } from '../../../store/HistoryStore'
import { useNavigate } from 'react-router-dom'
import { expect, vi, type Mock } from 'vitest'

// Мокаем хранилище
vi.mock('../../../store/HistoryStore', () => ({
  useStore: vi.fn(),
}))

// Мокаем react-router-dom (только один раз!)
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

// Мокаем дочерний компонент
vi.mock('./HistoryItem/HistoryRecord', () => ({
  HistoryRecord: vi.fn((props) => (
    <div data-testid="history-record" data-id={props.id} data-filename={props.fileName} />
  )),
}))

describe('HistoryPage', () => {
  const mockNavigate = vi.fn()
  const mockDeleteHistory = vi.fn()
  const mockAddHistoryItem = vi.fn()
  const mockDeleteHistoryItem = vi.fn()

  // Создаем мок-хранилище
  const mockStore = (history: HistoryItem[]) => ({
    history,
    deleteHistory: mockDeleteHistory,
    addHistoryItem: mockAddHistoryItem,
    deleteHistoryItem: mockDeleteHistoryItem,
  })

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    // Исправляем мок для Zustand
    ;(useStore as unknown as Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStore([]))
      }
      return mockStore([])
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('отображает кнопку генерации при пустой истории', () => {
    ;(useStore as unknown as Mock).mockReturnValue({
      history: [],
      deleteHistory: mockDeleteHistory,
      addHistoryItem: vi.fn(),
      deleteHistoryItem: vi.fn(),
    })

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Сгенерировать больше')).toBeInTheDocument()
    expect(screen.queryByText('Очистить всё')).not.toBeInTheDocument()
    expect(screen.queryByTestId('history-record')).not.toBeInTheDocument()
  })

  it('отображает историю и кнопки при наличии записей', () => {
    const mockHistory = [
      { id: '1', fileName: 'file1.csv', date: '2024-05-20', status: true, stats: {} },
      { id: '2', fileName: 'file2.csv', date: '2024-05-21', status: false, stats: null },
    ]

    vi.mocked(useStore).mockReturnValue({
      history: mockHistory,
      deleteHistory: mockDeleteHistory,
      addHistoryItem: vi.fn(),
      deleteHistoryItem: vi.fn(),
    })

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    )

    // Проверяем записи истории
    const records = screen.getAllByTestId('history-record')
    expect(records).toHaveLength(2)

    // Проверяем кнопки
    expect(screen.getByText('Сгенерировать больше')).toBeInTheDocument()
    expect(screen.getByText('Очистить всё')).toBeInTheDocument()
  })

  it('вызывает навигацию при клике на "Сгенерировать больше"', () => {
    vi.mocked(useStore).mockReturnValue({
      history: [],
      deleteHistory: mockDeleteHistory,
      addHistoryItem: vi.fn(),
      deleteHistoryItem: vi.fn(),
    })

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('Сгенерировать больше'))
    expect(mockNavigate).toHaveBeenCalledWith('/generatePage')
  })

  it('вызывает очистку истории при клике на "Очистить всё"', () => {
    const mockHistory = [
      { id: '1', fileName: 'test.csv', date: '2024-05-20', status: true, stats: {} } as HistoryItem,
      { id: '2', fileName: 'test.csv', date: '2024-05-20', status: true, stats: {} } as HistoryItem,
    ]

    ;(useStore as unknown as Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStore(mockHistory))
      }
      return mockStore(mockHistory)
    })

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    )

    const clearButton = screen.getByText('Очистить всё')
    fireEvent.click(clearButton)
    expect(mockDeleteHistory).toHaveBeenCalled()
  })
})
