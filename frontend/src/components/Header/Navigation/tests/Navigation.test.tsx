// Navigation.test.tsx
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Navigation } from '../Navigation'
import { MemoryRouter } from 'react-router-dom'
import { expect, describe, test, afterEach } from 'vitest'

const hasClass = (element: HTMLElement, className: string) => element.className.includes(className)

describe('Navigation Component', () => {
  afterEach(() => {
    cleanup()
  })

  test('renders all navigation items', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )

    expect(screen.getByText('CSV Аналитик')).toBeInTheDocument()
    expect(screen.getByText('CSV Генератор')).toBeInTheDocument()
    expect(screen.getByText('История')).toBeInTheDocument()

    expect(screen.getByAltText('Загрузить')).toBeInTheDocument()
    expect(screen.getByAltText('Генератор')).toBeInTheDocument()
    expect(screen.getByAltText('История')).toBeInTheDocument()
  })

  test('applies active class to current route', () => {
    render(
      <MemoryRouter initialEntries={['/generatePage']}>
        <Navigation />
      </MemoryRouter>
    )

    const generatorLink = screen.getByText('CSV Генератор').closest('a') as HTMLElement
    const analyticsLink = screen.getByText('CSV Аналитик').closest('a') as HTMLElement

    // Проверяем активное состояние через вспомогательную функцию
    expect(hasClass(generatorLink, 'activeLink')).toBe(true)
    expect(hasClass(analyticsLink, 'activeLink')).toBe(false)
  })

  test('navigates between routes', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navigation />
      </MemoryRouter>
    )

    const generatorLink = screen.getByText('CSV Генератор').closest('a') as HTMLElement

    // Кликаем на ссылку генератора
    fireEvent.click(generatorLink)

    // Проверяем обновление состояния
    expect(hasClass(generatorLink, 'activeLink')).toBe(true)
  })
})
