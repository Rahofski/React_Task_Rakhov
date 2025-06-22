import { HistoryRecord } from './HistoryItem/HistoryItem'
import styles from './HistoryPage.module.css'
import { useStore } from '../../store/HistoryStore'
import { Button } from '../Buttons/Button/Button'
import { useNavigate } from 'react-router-dom'

export const HistoryPage = () => {
  const { history } = useStore()
  const navigate = useNavigate()

  const deleteHistory = useStore((state) => state.deleteHistory)

  const handleNavigate = () => {
    navigate('/generatePage')
  }

  return (
    <div className={styles.container}>
      {history && history.length > 0 ? (
        <>
          <div className={styles.historyContainer}>
            {history.map((item) => (
              <HistoryRecord key={item.id} {...item} />
            ))}
          </div>
          <div className={styles.buttonContainer}>
            <Button variant="submitButton" onClick={handleNavigate}>
              Сгенерировать больше
            </Button>
            <Button variant="clear" onClick={deleteHistory}>
              Очистить всё
            </Button>
          </div>
        </>
      ) : (
        <div className={styles.buttonContainer}>
          <Button variant="submitButton" onClick={handleNavigate}>
            Сгенерировать больше
          </Button>
        </div>
      )}
    </div>
  )
}
