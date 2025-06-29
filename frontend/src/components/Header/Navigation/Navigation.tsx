// Navigation.tsx
import { NavLink } from 'react-router-dom'
import upload from '../icons/upload.svg'
import generator from '../icons/generator.svg'
import history from '../icons/history.svg'
import styles from './Navigation.module.css'

export const Navigation = () => {
  return (
    <ul className={styles.navList} data-testid="navigation-container">
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.activeLink}` : styles.navItem
          }
          data-active="false" // Значение по умолчанию
        >
          {({ isActive }) => (
            <>
              <img src={upload} alt="Загрузить" />
              <span data-active={isActive.toString()}>CSV Аналитик</span>
            </>
          )}
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/generatePage"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.activeLink}` : styles.navItem
          }
          data-active="false"
        >
          {({ isActive }) => (
            <>
              <img src={generator} alt="Генератор" />
              <span data-active={isActive.toString()}>CSV Генератор</span>
            </>
          )}
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/historyPage"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.activeLink}` : styles.navItem
          }
          data-active="false"
        >
          {({ isActive }) => (
            <>
              <img src={history} alt="История" />
              <span data-active={isActive.toString()}>История</span>
            </>
          )}
        </NavLink>
      </li>
    </ul>
  )
}
