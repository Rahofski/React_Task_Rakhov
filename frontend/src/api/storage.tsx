export const createStorage = (key: string, storage = localStorage) => ({
  setItem(data: any) {
    storage.setItem(key, JSON.stringify(data))
  },

  getItem() {
    const item = storage.getItem(key)
    return item ? JSON.parse(item) : null
  },
})

export const storage = createStorage('myData')
