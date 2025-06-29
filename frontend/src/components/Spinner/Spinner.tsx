import styles from './Spinner.module.css'

type SpinnerProps = {
  'data-testid'?: string
}

export const Spinner = ({ 'data-testid': dataTestId }: SpinnerProps) => {
  return <div className={styles.spinner} data-testid={dataTestId}></div>
}
