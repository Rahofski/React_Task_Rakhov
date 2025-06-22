import styles from './Header.module.css'
import logo from './icons/logo.svg'
import upload from './icons/upload.svg'
import generator from './icons/generator.svg'
import history from './icons/history.svg'
import { NavLink } from 'react-router-dom' // Изменяем Link на NavLink

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <img src={logo} alt="Летние школы" />
        <div className={styles.headerTitle}>
          <h2 className="text-2xl font-bold">МЕЖГАЛАКТИЧЕСКАЯ АНАЛИТИКА</h2>
        </div>
      </div>
      <nav>
        <ul className={styles.navList}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.activeLink}` : styles.navItem
              }
            >
              <img src={upload} alt="Загрузить" />
              <span>CSV Аналитик</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/generatePage"
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.activeLink}` : styles.navItem
              }
            >
              <img src={generator} alt="Генератор" />
              <span>CSV Генератор</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/historyPage"
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.activeLink}` : styles.navItem
              }
            >
              <img src={history} alt="История" />
              <span>История</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
