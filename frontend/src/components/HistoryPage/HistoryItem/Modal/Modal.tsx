import { createPortal } from 'react-dom'
import styles from './Modal.module.css'
import clearIcon from './icons/clear.svg'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalWrapper}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={clearIcon} alt="Закрыть" />
        </button>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>,
    document.body
  )
}
