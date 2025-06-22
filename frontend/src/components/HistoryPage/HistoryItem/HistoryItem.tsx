import styles from './HistoryItem.module.css'
import fileIcon from './icons/file.svg'
import smileIcon from './icons/smile.svg'
import sadIcon from './icons/sad.svg'
import sadDarkIcon from './icons/sad_dark.svg'
import smileDarkIcon from './icons/smile_dark.svg'

import deleteIcon from './icons/delete.svg'

import { Modal } from './Modal/Modal'
import { useStore, type HistoryItem } from '../../../store/HistoryStore'
import { useState } from 'react'
import { STATS_ITEMS } from '../../Homepage/Stats/StatsItem/StatsMap'
import { StatsItem } from '../../Homepage/Stats/StatsItem/StatsItem'

export const HistoryRecord = (props: HistoryItem) => {
  const { fileName, date, status, stats } = props
  const [isOpen, setIsOpen] = useState(false)
  const deleteHistoryItem = useStore((state) => state.deleteHistoryItem)

  const handleClick = () => {
    if (Object.keys(stats).length !== 0) {
      setIsOpen(true)
    }
  }

  return (
    <>
      <div className={styles.historyItem}>
        <div className={styles.container} onClick={handleClick}>
          <div className={styles.file}>
            <img src={fileIcon} alt="иконка файла" />
            <p className={styles.fileName}>{fileName}</p>
          </div>
          <div className={styles.date}>
            <p>{date}</p>
          </div>
          {status ? (
            <>
              <div className={`${styles.status}`}>
                <p>Обработан успешно</p>
                <img src={smileIcon} alt="улыбочка" />
              </div>
              <div className={`${styles.status} ${styles.error}`}>
                <p>Не удалось обработать</p>
                <img src={sadDarkIcon} alt="грусть" />
              </div>
            </>
          ) : (
            <>
              <div className={`${styles.status} ${styles.error}`}>
                <p>Обработан успешно</p>
                <img src={smileDarkIcon} alt="улыбочка" />
              </div>
              <div className={`${styles.status}`}>
                <p>Не удалось обработать</p>
                <img src={sadIcon} alt="грусть" />
              </div>
            </>
          )}
        </div>
        <div>
          <img
            src={deleteIcon}
            alt="мусорка"
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation()
              deleteHistoryItem(props)
            }}
          />
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className={styles.modalContentWrapper}>
          {stats ? (
            <div className={styles.stats}>
              {STATS_ITEMS(stats).map((item, index: number) => (
                <StatsItem key={index} title={item.title} text={item.text} isModal={true} />
              ))}
            </div>
          ) : null}
        </div>
      </Modal>
    </>
  )
}
