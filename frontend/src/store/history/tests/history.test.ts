// historySlice.test.ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStore } from '../../HistoryStore'
import { HistoryService } from '../../../services/HistoryService'
import type { HistoryItem } from '../../HistoryStore'

import type { AnalyticsResponse } from '../../../api/csvAnalytics'

// Мокируем HistoryService
vi.mock('../services/HistoryService')

const mockItem: HistoryItem = {
  id: '1',
  fileName: 'test.csv',
  date: '2023-01-01',
  status: true,
  stats: {
    total_spend_galactic: 100,
    rows_affected: 10,
    less_spent_at: 5,
    big_spent_at: 95,
    less_spent_value: 5,
    big_spent_value: 95,
    average_spend_galactic: 50,
    big_spent_civ: 'Alpha',
    less_spent_civ: 'Beta',
  } as AnalyticsResponse,
}

describe('History Slice', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    HistoryService.getHistory = vi.fn().mockReturnValue([])
    HistoryService.setHistory = vi.fn().mockImplementation((items) => items)
  })

  it('элемент должен добавляться', () => {
    const { result } = renderHook(() => useStore())

    act(() => {
      result.current.addHistoryItem(mockItem)
    })

    expect(result.current.history).toEqual([mockItem])

    expect(HistoryService.setHistory).toHaveBeenCalledWith([mockItem])
    expect(HistoryService.getHistory).toHaveBeenCalledTimes(1)
  })

  it('элемент должен удаляться', () => {
    const initialItems = [mockItem, { ...mockItem, id: '2' }]
    HistoryService.getHistory = vi.fn().mockReturnValue(initialItems)

    const { result } = renderHook(() => useStore())

    act(() => {
      result.current.deleteHistoryItem(mockItem)
    })

    expect(result.current.history).toEqual([{ ...mockItem, id: '2' }])

    expect(HistoryService.setHistory).toHaveBeenCalledWith([{ ...mockItem, id: '2' }])
  })

  it('история должна очищаться', () => {
    HistoryService.getHistory = vi.fn().mockReturnValue([mockItem])

    const { result } = renderHook(() => useStore())

    act(() => {
      result.current.deleteHistory()
    })

    expect(result.current.history).toEqual([])

    expect(HistoryService.setHistory).toHaveBeenCalledWith([])
  })
})
