import { afterEach, describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Button } from '../Button'

afterEach(() => {
  cleanup() // Очищаем DOM после каждого теста
})

describe('Button Component', () => {
  test('renders button with children text', () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })

  // 3. Состояние загрузки
  test('shows spinner when isLoading=true', () => {
    render(<Button isLoading={true}>Loading</Button>)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  // 4. Обработка кликов
  test('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clickable</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // 5. Состояние "done"
  test('renders done state correctly', () => {
    const onClearMock = vi.fn()
    render(
      <Button variant="done" onClear={onClearMock} data-testid="done-button">
        Done State
      </Button>
    )

    expect(screen.getByText('Done!')).toBeInTheDocument()
    expect(screen.getByTestId('clear-button')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('clear-button'))
    expect(onClearMock).toHaveBeenCalledTimes(1)
  })

  // 6. Отключенное состояние
  test('disables button when disabled=true', () => {
    render(<Button disabled={true}>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  // 7. Тест на передачу data-testid
  test('passes data-testid attribute', () => {
    render(<Button data-testid="custom-button">Test</Button>)
    expect(screen.getByTestId('custom-button')).toBeInTheDocument()
  })

  // 8. Граничный случай: отсутствие onClear
  test('handles missing onClear in done state', () => {
    render(<Button variant="done">Without Clear</Button>)
    expect(screen.getByTestId('clear-button')).toBeInTheDocument()

    // Проверяем что клик не вызывает ошибок
    fireEvent.click(screen.getByTestId('clear-button'))
  })
})
