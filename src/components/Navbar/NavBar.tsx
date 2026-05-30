import { NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import styles from './NavBar.module.scss'

export default function NavBar() {
  const { totalCount } = useCart()

  return (
    <header className={styles.nav}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.brand} aria-label="Sembark Store home">
          <span>Sembark Store</span>
        </NavLink>

        <nav className={styles.links} aria-label="Primary navigation">
          <NavLink to="/" className={({ isActive }) => [styles.navLink, isActive ? styles.activeLink : ''].join(' ')}>
            Shop
          </NavLink>

          <NavLink to="/cart" className={({ isActive }) => [styles.cartLink, isActive ? styles.activeLink : ''].join(' ')} data-cy="cart-link">
            <span>Cart</span>
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
