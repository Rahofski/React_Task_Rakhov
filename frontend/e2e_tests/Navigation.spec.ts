// navigation.e2e.ts
import { test, expect } from '@playwright/test'

const hasClass = (element: HTMLElement, className: string) => element.className.includes(className)

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
  })

  test('Навигация должна работать между несколькими страницами', async ({ page }) => {
    // Проверка начальной страницы
    await expect(page).toHaveURL('http://localhost:5173/')

    // Используем data-active на span
    const analyticsSpan = page.locator(
      '[data-testid="navigation-container"] >> text=CSV Аналитик >> xpath=..//span'
    )
    await expect(analyticsSpan).toHaveAttribute('data-active', 'true')

    // Переход на страницу генератора
    const generatorSpan = page.locator(
      '[data-testid="navigation-container"] >> text=CSV Генератор >> xpath=..//span'
    )
    await generatorSpan.click()

    // Ждем перехода
    await page.waitForURL('**/generatePage')
    await expect(generatorSpan).toHaveAttribute('data-active', 'true')

    // Переход на страницу истории
    const historySpan = page.locator(
      '[data-testid="navigation-container"] >> text=История >> xpath=..//span'
    )
    await historySpan.click()

    // Ждем перехода
    await page.waitForURL('**/historyPage')
    await expect(historySpan).toHaveAttribute('data-active', 'true')

    // Возврат на главную
    await analyticsSpan.click()
    await page.waitForURL('**/')
    await expect(analyticsSpan).toHaveAttribute('data-active', 'true')
  })

  test('должно сохраняться состояние навигации при перезагрузке страницы', async ({ page }) => {
    const generatorSpan = page.locator(
      '[data-testid="navigation-container"] >> text=CSV Генератор >> xpath=..//span'
    )
    await generatorSpan.click()
    await page.waitForURL('**/generatePage')

    await page.reload()
    await page.waitForSelector('[data-testid="navigation-container"]')

    const reloadedGeneratorSpan = page.locator(
      '[data-testid="navigation-container"] >> text=CSV Генератор >> xpath=..//span'
    )
    await expect(reloadedGeneratorSpan).toHaveAttribute('data-active', 'true')
  })
})
