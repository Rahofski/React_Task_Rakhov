import styles from './Header.module.css'
import logo from './icons/logo.svg'

import { Navigation } from './Navigation/Navigation'

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <img src={logo} alt="Летние школы" />
        <div className={styles.headerTitle}>
          <h2 className="text-2xl font-bold">МЕЖГАЛАКТИЧЕСКАЯ АНАЛИТИКА</h2>
        </div>
      </div>
      <Navigation />
    </header>
  )
}
