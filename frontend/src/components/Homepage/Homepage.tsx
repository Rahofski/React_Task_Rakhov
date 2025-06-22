import styles from './HomePage.module.css'
import { useState, useCallback } from 'react'
import { StatsItem } from './Stats/StatsItem/StatsItem'
import { uploadFile, type AnalyticsResponse } from '../../api/csvAnalytics'
import { STATS_ITEMS } from './Stats/StatsItem/StatsMap'
import { useStore } from '../../store/HistoryStore'

import { Button } from '../Buttons/Button/Button'
import { ButtonUpload } from '../Buttons/ButtonUpload/ButtonUpload'

export type StatItem = {
  title: string
  text: string
  isModal: boolean
}

export const Homepage = () => {
  const addToHistory = useStore((state) => state.addHistoryItem)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isStat, setIsStat] = useState(false)

  const [isSuccess, setIsSuccess] = useState(false) // Новое состояние

  const handleFileSelect = useCallback((file: File | null, isError: boolean) => {
    setSelectedFile(file)
    setIsError(isError)
  }, [])

  const handleClear = useCallback(() => {
    setSelectedFile(null)
    setIsError(false)
    setIsStat(false)
    setIsSuccess(false) // Сбрасываем состояние успеха
    window.location.reload()
  }, [])

  const [currentStats, setCurrentStats] = useState<AnalyticsResponse | null>(null)

  const handleSubmit = async () => {
    if (!selectedFile) return
    setIsLoading(true)
    setIsError(false)
    setCurrentStats(null)
    setIsStat(true)

    try {
      const finalStats = await uploadFile(selectedFile, 10000, (progressData) => {
        setCurrentStats(progressData) // Для отображения в реальном времени
      })

      addToHistory({
        id: `${selectedFile.name}-${Date.now()}`,
        fileName: selectedFile.name,
        date: new Date().toLocaleString('ru-RU', { dateStyle: 'short' }),
        status: true,
        stats: finalStats, // Гарантированно содержит данные
      })
      setIsSuccess(true) // Устанавливаем успешное состояние
    } catch (err) {
      setIsError(true)
      addToHistory({
        id: `${selectedFile.name}-${Date.now()}`,
        fileName: selectedFile.name,
        date: new Date().toLocaleString('ru-RU', { dateStyle: 'short' }),
        status: false,
        stats: {} as AnalyticsResponse,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className={styles.container}>
        <p className={styles.text}>
          Загрузите <span className={styles.highlight}>csv</span> файл и получите{' '}
          <span className={styles.highlight}>полную информацию</span> о нём за сверхнизкое время
        </p>
        <div className={styles.uploadArea}>
          <div className={styles.uploadArea}>
            <ButtonUpload
              file={selectedFile}
              isError={isError}
              isLoading={isLoading} // Передаем состояние загрузки
              isSuccess={isSuccess} // Передаем состояние успеха
              onFileSelect={handleFileSelect}
              onClear={handleClear}
            />
          </div>
        </div>
        {selectedFile ? (
          !isError && !isLoading && !isStat ? (
            <Button isLoading={false} onClick={handleSubmit} variant="submitButton">
              Отправить
            </Button>
          ) : null
        ) : (
          <Button isLoading={false} variant="submitButton" disabled>
            Отправить
          </Button>
        )}
      </div>
      {currentStats ? (
        <div className={styles.stats}>
          {STATS_ITEMS(currentStats).map((item, index: number) => (
            <StatsItem key={index} title={item.title} text={item.text} isModal={false} />
          ))}
        </div>
      ) : (
        <div className={styles.noStatsText}>
          <p>
            Здесь <br />
            появятся хайлайты
          </p>
        </div>
      )}
    </>
  )
}
