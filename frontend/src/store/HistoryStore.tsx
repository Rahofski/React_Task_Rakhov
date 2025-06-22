import type { AnalyticsResponse } from '../api/csvAnalytics'

export type HistoryItem = {
  id: string
  fileName: string
  date: string
  status: boolean
  stats: AnalyticsResponse // Тип из вашего API
}

import { create } from 'zustand'
import { createHistorySlice, type HistorySlice } from './history/history'

export const useStore = create<HistorySlice>()((...a) => ({
  ...createHistorySlice(...a),
}))
