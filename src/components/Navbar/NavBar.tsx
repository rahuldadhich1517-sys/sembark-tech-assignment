import { NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import styles from './NavBar.module.scss'

function classNameIfActive(baseClass: string, isActive: boolean): string {
  return isActive ? `${baseClass} ${styles.activeLink}` : baseClass
}

export default function NavBar() {
  const { totalCount } = useCart()

  return (
    <header className={styles.nav}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.brand} aria-label="Sembark Store home">
          Sembark Store
        </NavLink>

        <nav className={styles.links} aria-label="Primary navigation">
          <NavLink
            to="/"
            className={({ isActive }) => classNameIfActive(styles.navLink, isActive)}
          >
            Shop
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => classNameIfActive(styles.cartLink, isActive)}
            data-cy="cart-link"
          >
            Cart
            {totalCount > 0 && (
              <span data-cy="cart-count" className={styles.badge} aria-live="polite">
                {totalCount}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
