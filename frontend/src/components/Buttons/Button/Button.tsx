import type { ReactNode } from 'react'
import styles from './Button.module.css'
import { Spinner } from '../../Spinner/Spinner'
import clearIcon from './icons/Clear.png'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  isLoading?: boolean
  disabled?: boolean
  variant?: 'submitButton' | 'clear' | 'error' | 'done' | 'loading'
  onClear?: () => void
}

export const Button = ({
  children,
  onClick,
  isLoading = false,
  disabled = false,
  variant = 'submitButton',
  onClear,
}: ButtonProps) => {
  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation()
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
        >
          {variant === 'done' ? 'Done!' : 'Ошибка'}
        </button>
        <img src={clearIcon} alt="Clear" className={styles.clearIcon} onClick={handleClearClick} />
      </div>
    )
  }

  // Для остальных состояний рендерим только кнопку
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? <Spinner /> : <p className={styles.buttonContent}>{children}</p>}
    </button>
  )
}
