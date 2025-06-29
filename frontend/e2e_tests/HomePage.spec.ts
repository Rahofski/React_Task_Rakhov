import { test, expect } from '@playwright/test'

test.describe('HomePage E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
  })

  test.describe('File Upload', () => {
    test('Загрузка корректного файла должна отображать статистику', async ({ page }) => {
      const downloadTriggered = new Promise<void>(async (resolve) => {
        await page.route('http://localhost:3000/aggregate?**', async (route) => {
          await new Promise((r) => setTimeout(r, 100))

          const data = {
            total_spend_galactic: 1500,
            rows_affected: 100,
            less_spent_at: 5,
            big_spent_at: 95,
            less_spent_value: 10,
            big_spent_value: 500,
            average_spend_galactic: 15,
            big_spent_civ: 'humans',
            less_spent_civ: 'monsters'
          }
          
          await route.fulfill({
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) + '\n'
          })

          resolve()
        })
      })

      const fileChooserPromise = page.waitForEvent('filechooser')
      await page.getByText('Загрузить файл').click()
      const fileChooser = await fileChooserPromise
      await fileChooser.setFiles({
        name: 'correct.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from('id,name,value\n1,Test,100')
      })

      await page.getByText('Отправить').click()

      await expect(page.locator('[data-testid="spinner"]')).toBeVisible()

      await downloadTriggered

      await expect(page.getByText('monsters')).toBeVisible({ timeout: 10000 })
    })

    test('Кнопка "Отправить" должна быть неактивна без файла', async ({ page }) => {
      const submitButton = page.getByText('Отправить')
      await expect(submitButton).toBeDisabled()
    })

    test('Очистка выбранного файла должна сбрасывать состояние', async ({ page }) => {
      const fileChooserPromise = page.waitForEvent('filechooser')
      await page.getByText('Загрузить файл').click()
      const fileChooser = await fileChooserPromise
      await fileChooser.setFiles({
        name: 'test.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from('id,name\n1,Test')
      })

      await page.getByTestId('clear-button').click()

      await expect(page.getByText('Загрузить файл')).toBeVisible()
      await expect(page.getByText('Отправить')).toBeDisabled()
    })
  })

  test.describe('History Integration', () => {
    test('После успешной загрузки файл должен появиться в истории', async ({ page }) => {
      const downloadTriggered = new Promise<void>(async (resolve) => {
        await page.route('http://localhost:3000/aggregate?**', async (route) => {
          const data = {
            total_spend_galactic: 1500,
            rows_affected: 100,
            less_spent_at: 5,
            big_spent_at: 95,
            less_spent_value: 10,
            big_spent_value: 500,
            average_spend_galactic: 15,
            big_spent_civ: 'humans',
            less_spent_civ: 'monsters'
          }
          
          await route.fulfill({
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) + '\n'
          })
          resolve()
        })
      })

      const fileChooserPromise = page.waitForEvent('filechooser')
      await page.getByText('Загрузить файл').click()
      const fileChooser = await fileChooserPromise
      await fileChooser.setFiles({
        name: 'correct.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from('id,name,value\n1,Test,100')
      })

      await page.getByText('Отправить').click()
      await downloadTriggered

      await page.getByText('История').click()

      await expect(page).toHaveURL('http://localhost:5173/historyPage')

      const historyRecord = page.locator('[data-testid="history-record"]').first()
      await expect(historyRecord).toBeVisible()
      await expect(historyRecord).toContainText('correct.csv')
    })

    test('После ошибки загрузки файл должен появиться в истории с ошибкой', async ({ page }) => {
      const downloadTriggered = new Promise<void>(async (resolve) => {
        await page.route('http://localhost:3000/aggregate?**', async (route) => {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Internal error' })
          })
          resolve()
        })
      })

      const fileChooserPromise = page.waitForEvent('filechooser')
      await page.getByText('Загрузить файл').click()
      const fileChooser = await fileChooserPromise
      await fileChooser.setFiles({
        name: 'error.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from('invalid,data,format')
      })

      await page.getByText('Отправить').click()
      await downloadTriggered

      await page.getByText('История').click()

      const historyRecord = page.locator('[data-testid="history-record"]').first()
      await expect(historyRecord).toBeVisible()
      await expect(historyRecord).toContainText('error.csv')
    })

    test('Для успешной записи в истории должно открываться модальное окно', async ({ page }) => {
      const downloadTriggered = new Promise<void>(async (resolve) => {
        await page.route('http://localhost:3000/aggregate?**', async (route) => {
          const data = {
            total_spend_galactic: 1500,
            rows_affected: 100,
            less_spent_at: 5,
            big_spent_at: 95,
            less_spent_value: 10,
            big_spent_value: 500,
            average_spend_galactic: 15,
            big_spent_civ: 'humans',
            less_spent_civ: 'monsters'
          }
          
          await route.fulfill({
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) + '\n'
          })
          resolve()
        })
      })

      const fileChooserPromise = page.waitForEvent('filechooser')
      await page.getByText('Загрузить файл').click()
      const fileChooser = await fileChooserPromise
      await fileChooser.setFiles({
        name: 'modal_test.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from('id,name,value\n1,Test,100')
      })

      await page.getByText('Отправить').click()
      await downloadTriggered

      await page.goto('http://localhost:5173/historyPage')
      await page.locator('[data-testid="history-record"]').first().click()
      
      await expect(page.getByTestId('modal')).toBeVisible()
      await expect(page.getByText('humans')).toBeVisible()
      await expect(page.getByText('1500')).toBeVisible()
    })

    test('Для записи с ошибкой модальное окно не должно открываться', async ({ page }) => {
      const downloadTriggered = new Promise<void>(async (resolve) => {
        await page.route('http://localhost:3000/aggregate?**', async (route) => {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Invalid file format' })
          })
          resolve()
        })
      })

      const fileChooserPromise = page.waitForEvent('filechooser')
      await page.getByText('Загрузить файл').click()
      const fileChooser = await fileChooserPromise
      await fileChooser.setFiles({
        name: 'no_modal.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from('invalid,data,format')
      })

      await page.getByText('Отправить').click()
      await downloadTriggered

      await page.goto('http://localhost:5173/historyPage')
      await page.locator('[data-testid="history-record"]').first().click()
      
      await expect(page.getByTestId('modal')).not.toBeVisible()
    })
  })
})