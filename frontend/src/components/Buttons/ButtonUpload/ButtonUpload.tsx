// ButtonUpload.tsx
import { useState, useCallback } from 'react'
import styles from './ButtonUpload.module.css'
import { ClearButton } from '../ClearButton/ClearButton'
import { Spinner } from '../../Spinner/Spinner' // Импорт спиннера

interface ButtonUploadProps {
  file: File | null
  isError: boolean
  isLoading?: boolean
  isSuccess?: boolean
  onFileSelect: (file: File | null, isError: boolean) => void
  onClear: () => void
}

export const ButtonUpload = ({
  file,
  isError,
  isLoading = false,
  isSuccess = false,
  onFileSelect,
  onClear,
}: ButtonUploadProps) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        onFileSelect(droppedFile, droppedFile.type !== 'text/csv')
      }
    },
    [onFileSelect]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] || null
      if (selectedFile) {
        onFileSelect(selectedFile, selectedFile.type !== 'text/csv')
      }
    },
    [onFileSelect]
  )

  const handleClearClick = useCallback(() => {
    onClear()
    setIsDragging(false)
  }, [onClear])

  return (
    <div
      className={`
        ${styles.uploadBox} 
        ${isDragging ? styles.dragging : ''}
        ${file ? styles.areaUploaded : ''}
        ${
          file
            ? isError
              ? styles.errorBorder
              : isSuccess
                ? styles.successBackground
                : styles.neutralBorder
            : ''
        }
      `}
      data-testid="upload-box"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        accept=".csv"
        onChange={handleFileInput}
        style={{ display: 'none' }}
        data-testid="file-input"
      />

      {!file ? (
        <label htmlFor="file-upload" className={`${styles.uploadButton}`}>
          <p>Загрузить файл</p>
        </label>
      ) : (
        <div className={styles.uploadFileDiv}>
          <label
            htmlFor="file-upload"
            className={`${styles.uploadButton} ${
              isLoading
                ? styles.uploadLoading
                : isError
                  ? styles.uploadFileButtonError
                  : isSuccess
                    ? styles.uploadFileButtonSuccess
                    : styles.uploadFileButton
            }`}
          >
            {isLoading ? <Spinner data-testid="spinner" /> : <p>{file.name}</p>}
          </label>
          {!isLoading && <ClearButton onClear={handleClearClick} data-testid="clear-button" />}
        </div>
      )}

      <p className={`${styles.dragText} ${isError ? styles.dragTextError : ''}`}>
        {file
          ? isError
            ? 'упс, не то...'
            : isLoading
              ? 'идёт парсинг файла'
              : isSuccess
                ? 'готово!'
                : 'файл загружен!'
          : 'или перетащите сюда'}
      </p>
    </div>
  )
}
