import { render, screen, fireEvent } from '@testing-library/react'
import { HistoryRecord } from '../HistoryItem'
import { useStore } from '../../../../store/HistoryStore'
import { expect, vi, type Mock } from 'vitest'
import type { HistoryItem } from '../../../../store/HistoryStore'
import type { AnalyticsResponse } from '../../../../api/csvAnalytics'

vi.mock('../../../../store/HistoryStore', () => ({
  useStore: vi.fn(),
}))

vi.mock('../HistoryItem.module.css', () => ({
  default: {
    historyItem: '',
    container: '',
    file: '',
    fileName: '',
    date: '',
    status: '',
    error: '',
    deleteButton: '',
    modalContentWrapper: '',
    stats: '',
  },
}))

vi.mock('../icons/file.svg', () => ({ default: 'file-icon' }))
vi.mock('../icons/smile.svg', () => ({ default: 'smile-icon' }))
vi.mock('../icons/sad.svg', () => ({ default: 'sad-icon' }))
vi.mock('../icons/sad_dark.svg', () => ({ default: 'sad-dark-icon' }))
vi.mock('../icons/smile_dark.svg', () => ({ default: 'smile-dark-icon' }))
vi.mock('../icons/delete.svg', () => ({ default: 'delete-icon' }))

vi.mock('../Modal/Modal', () => ({
  Modal: vi.fn(({ children, isOpen }) =>
    isOpen ? <div data-testid="modal">{children}</div> : null
  ),
}))

vi.mock('../../../Homepage/Stats/StatsItem/StatsItem', () => ({
  StatsItem: vi.fn(() => <div data-testid="stats-item" />),
}))

describe('HistoryRecord', () => {
  const mockDeleteHistoryItem = vi.fn()
  const mockItem: HistoryItem = {
    id: '1',
    fileName: 'test.csv',
    date: '2024-05-20',
    status: true,
    stats: {
      total_spend_galactic: 300,
      rows_affected: 300,
      less_spent_at: 300,
      big_spent_at: 300,
      less_spent_value: 300,
      big_spent_value: 300,
      average_spend_galactic: 300,
      big_spent_civ: 'humans',
      less_spent_civ: 'monsters',
    } as AnalyticsResponse,
  }

  beforeEach(() => {
    ;(useStore as unknown as Mock).mockImplementation((selector) => {
      if (selector) {
        return selector({ deleteHistoryItem: mockDeleteHistoryItem })
      }
      return { deleteHistoryItem: mockDeleteHistoryItem }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('корректно отображает информацию о записи', () => {
    render(<HistoryRecord {...mockItem} data-testid="history-record" />)

    expect(screen.getByText('test.csv')).toBeInTheDocument()
    expect(screen.getByText('2024-05-20')).toBeInTheDocument()
    expect(screen.getByText('Обработан успешно')).toBeInTheDocument()
    expect(screen.getByAltText('улыбочка')).toHaveAttribute('src', 'smile-icon')
  })

  it('отображает статус ошибки при status=false', () => {
    const failedItem = { ...mockItem, status: false }
    render(<HistoryRecord {...failedItem} />)

    expect(screen.getByText('Не удалось обработать')).toBeInTheDocument()
    expect(screen.getByAltText('грусть')).toHaveAttribute('src', 'sad-icon')
  })

  it('открывает модальное окно при клике на запись', () => {
    render(<HistoryRecord {...mockItem} />)

    fireEvent.click(screen.getByText('test.csv'))
    expect(screen.getByTestId('modal')).toBeInTheDocument()
    expect(screen.getAllByTestId('stats-item').length).toBeGreaterThan(0)
  })

  it('не открывает модальное окно при отсутствии статистики', () => {
    const emptyStatsItem: HistoryItem = {
      id: '1',
      fileName: 'test.csv',
      date: '2024-05-20',
      status: true,
      stats: {} as AnalyticsResponse,
    }
    render(<HistoryRecord {...emptyStatsItem} />)

    fireEvent.click(screen.getByText('test.csv'))
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('вызывает удаление при клике на иконку удаления', () => {
    render(<HistoryRecord {...mockItem} />)

    const deleteButton = screen.getByAltText('мусорка')
    fireEvent.click(deleteButton)

    expect(mockDeleteHistoryItem).toHaveBeenCalledWith(mockItem)
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('не открывает модальное окно при клике на иконку удаления', () => {
    render(<HistoryRecord {...mockItem} />)

    const deleteButton = screen.getByAltText('мусорка')
    fireEvent.click(deleteButton)

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })
})
