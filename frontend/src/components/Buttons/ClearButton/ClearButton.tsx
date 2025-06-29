import clearIcon from './icons/Clear.png'

import styles from './ClearButton.module.css'

interface ClearButtonProps {
  onClear: () => void
  'data-testid'?: string
}

export const ClearButton = ({ onClear, 'data-testid': dataTestId }: ClearButtonProps) => {
  return (
    <img
      src={clearIcon}
      alt="Clear"
      className={styles.clearIcon}
      onClick={onClear}
      data-testid={dataTestId}
    />
  )
}
