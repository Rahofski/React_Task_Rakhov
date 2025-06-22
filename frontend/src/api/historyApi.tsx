import type { HistoryItem } from '../store/HistoryStore'

import { createStorage } from './storage'

const STORAGE_KEY = 'history'

const storage = createStorage<HistoryItem[]>(STORAGE_KEY)

export const HistoryApi = {
  setNotes(notes: HistoryItem[]) {
    storage.setItem(notes)

    return notes
  },

  getNotes() {
    const newHistory = storage.getItem()

    return newHistory ? newHistory : []
  },
}
