import { test, expect } from '@playwright/test'

test.describe('GeneratePage E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/generatePage')
  })

  test.describe('Page Rendering', () => {
    test('Страница должна отображать начальное состояние корректно', async ({ page }) => {
      await expect(
        page.getByText('Сгенерируйте готовый csv-файл нажатием одной кнопки')
      ).toBeVisible()

      const generateButton = page.getByTestId('generate-button')
      await expect(generateButton).toBeVisible()
      await expect(generateButton).toBeEnabled()

      await expect(page.getByText('Отчёт успешно сгенерирован!')).not.toBeVisible()
      await expect(page.getByText(/Произошла ошибка/)).not.toBeVisible()
    })

    test('страница должна быть доступна по навигации', async ({ page }) => {
      await page.goto('http://localhost:5173/')

      await page.getByRole('link', { name: /CSV Генератор/i }).click()

      await expect(page).toHaveURL('http://localhost:5173/generatePage')
      await expect(
        page.getByText('Сгенерируйте готовый csv-файл нажатием одной кнопки')
      ).toBeVisible()
    })
  })

  test.describe('CSV Generation Flow', () => {
    test('Страница должна генерировать и скачивать файл', async ({ page }) => {
      const downloadTriggered = new Promise<void>(async (resolve) => {
        await page.route('http://localhost:3000/report?**', async (route) => {
          await new Promise((r) => setTimeout(r, 100))

          const csvContent = 'id,name,value\n1,Test,100\n2,Example,200'
          const buffer = Buffer.from(csvContent, 'utf-8')

          await route.fulfill({
            status: 200,
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': 'attachment; filename=report.csv',
            },
            body: buffer,
          })

          resolve()
        })
      })

      const generateButton = page.getByTestId('generate-button')
      await generateButton.click()

      await expect(page.locator('[data-testid="spinner"]')).toBeVisible()

      // Ждем срабатывания обработчика маршрута
      await downloadTriggered

      await expect(page.getByText('файл сгенерирован!')).toBeVisible()
    })

    test('Спиннер должен отображаться во время загрузки', async ({ page }) => {
      await page.route('**/report?size=0.01', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        await route.fulfill({
          status: 200,
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=report.csv',
          },
          body: 'id,name\n1,test',
        })
      })

      const generateButton = page.getByTestId('generate-button')

      await generateButton.click()

      await expect(page.locator('[data-testid="spinner"]')).toBeVisible()

      await expect(generateButton).not.toHaveText('Начать генерацию')
    })

    test('Страница должна правильно отображать ошибки', async ({ page }) => {
      await page.route('**/report?size=0.01', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Internal server error during CSV generation',
          }),
        })
      })

      const generateButton = page.getByTestId('generate-button')

      await generateButton.click()

      await expect(generateButton).toBeDisabled()

      await expect(page.getByText('Отчёт успешно сгенерирован!')).not.toBeVisible()
    })
  })

  test.describe('User Experience', () => {
    test('Страница должна приходить в начальное состояние после нажатия на кнопку очистки', async ({
      page,
    }) => {
      const downloadTriggered = new Promise<void>(async (resolve) => {
        await page.route('http://localhost:3000/report?**', async (route) => {
          await new Promise((r) => setTimeout(r, 100))

          const csvContent = 'id,name,value\n1,Test,100\n2,Example,200'
          const buffer = Buffer.from(csvContent, 'utf-8')

          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({
              error: 'Internal server error during CSV generation',
            }),
          })

          resolve()
        })
      })

      const generateButton = page.getByTestId('generate-button')

      await generateButton.click()

      await downloadTriggered

      const clearButton = page.getByTestId('clear-button')
      await clearButton.click()

      await expect(
        page.getByText('Сгенерируйте готовый csv-файл нажатием одной кнопки')
      ).toBeVisible()
    })
  })
})
