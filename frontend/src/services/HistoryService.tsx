import { HistoryApi } from '../api/historyApi'

import type { HistoryItem } from '../store/HistoryStore'

export const HistoryService = {
  setHistory(notes: HistoryItem[]) {
    HistoryApi.setNotes(notes)

    return notes
  },

  getHistory() {
    const newHistory = HistoryApi.getNotes()

    return newHistory ? newHistory : []
  },
}
