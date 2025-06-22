import { HistoryService } from '../../services/HistoryService'

import type { HistoryItem } from '../HistoryStore'

import type { StateCreator } from 'zustand'

export type HistorySlice = {
  history: HistoryItem[]
  addHistoryItem: (item: HistoryItem) => void
  deleteHistoryItem: (item: HistoryItem) => void
  deleteHistory: () => void
}

export const createHistorySlice: StateCreator<HistorySlice, [], [], HistorySlice> = (set) => ({
  history: HistoryService.getHistory(),

  addHistoryItem: (historyItem: HistoryItem) => {
    const updatedHistory = [...HistoryService.getHistory(), historyItem]
    const newHistory = HistoryService.setHistory(updatedHistory)
    set({ history: newHistory })
  },

  deleteHistoryItem: (historyItem: HistoryItem) => {
    const History = [...HistoryService.getHistory()]
    const updatedHistory = History.filter((item) => item.id !== historyItem.id)
    const newHistory = HistoryService.setHistory(updatedHistory)
    set({ history: newHistory })
  },

  deleteHistory: () => {
    const newHistory = HistoryService.setHistory([])
    set({ history: newHistory })
  },
})
