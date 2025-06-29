import type { ReactNode } from 'react'
import styles from './Button.module.css'
import { Spinner } from '../../Spinner/Spinner'

import { ClearButton } from '../ClearButton/ClearButton'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  isLoading?: boolean
  disabled?: boolean
  variant?: 'submitButton' | 'clear' | 'error' | 'done' | 'loading'
  onClear?: () => void
  'data-testid'?: string // Add data-testid prop
}

export const Button = ({
  children,
  onClick,
  isLoading = false,
  disabled = false,
  variant = 'submitButton',
  onClear,
  'data-testid': dataTestId, // Destructure data-testid
}: ButtonProps) => {
  const handleClearClick = () => {
    if (onClear) onClear()
  }

  // Для состояний done и error рендерим контейнер с кнопкой и иконкой
  if (variant === 'done' || variant === 'error') {
    return (
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles[variant]}`}
          onClick={onClick}
          disabled={disabled || isLoading}
          data-testid={dataTestId} // Pass data-testid to button
        >
          {variant === 'done' ? 'Done!' : 'Ошибка'}
        </button>

        <ClearButton onClear={handleClearClick} data-testid="clear-button" />
      </div>
    )
  }

  // Для остальных состояний рендерим только кнопку
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      data-testid={dataTestId} // Pass data-testid to button
    >
      {isLoading ? (
        <Spinner data-testid="spinner" />
      ) : (
        <p className={styles.buttonContent}>{children}</p>
      )}
    </button>
  )
}
