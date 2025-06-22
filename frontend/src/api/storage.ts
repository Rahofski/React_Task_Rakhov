export const createStorage = <T>(key: string, storage = localStorage) => ({
  setItem(data: T) {
    storage.setItem(key, JSON.stringify(data))
  },

  getItem(): T | null {
    const item = storage.getItem(key)
    return item ? (JSON.parse(item) as T) : null
  },
})
