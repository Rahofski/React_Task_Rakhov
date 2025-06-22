import { useState } from 'react'
import styles from './GeneratePage.module.css'
import { generateFile } from '../../api/generator'
import { Button } from '../Buttons/Button/Button'

export const GeneratePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  const handleGenerate = async () => {
    if (isLoading) return

    setIsLoading(true)
    setIsSuccess(false)
    setIsError(false)

    try {
      const params = new URLSearchParams({
        size: '0.1',
        withErrors: 'on',
        maxSpend: '1000',
      })

      await generateFile(params)
      setIsSuccess(true)
    } catch (err) {
      console.log(err)
      setIsError(true)
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setIsLoading(false)
    setIsSuccess(false)
    setIsError(false)
  }

  const getButtonVariant = () => {
    if (isLoading) return 'loading'
    if (isSuccess) return 'done'
    if (isError) return 'error'
    return 'submitButton'
  }

  return (
    <div className={styles.container}>
      <p className={styles.text}>Сгенерируйте готовый csv-файл нажатием одной кнопки</p>

      <Button
        onClick={handleGenerate}
        isLoading={isLoading}
        variant={getButtonVariant()}
        onClear={handleClear}
      >
        Начать генерацию
      </Button>

      {isLoading && <p>идёт процесс генерации</p>}
      {isSuccess && <p>файл сгенерирован!</p>}
      {isError && <p className={styles.failedText}>упс, не то...</p>}
    </div>
  )
}
