import styles from './StatsItem.module.css'
import type { StatItem } from '../../Homepage'

export const StatsItem = (props: StatItem) => {
  const { title, text, isModal } = props
  return (
    <>
      <div className={`${styles.statsItem} ${isModal ? styles.modalItem : ''}`}>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </>
  )
}
