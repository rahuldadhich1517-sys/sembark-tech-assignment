import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import styles from './NavBar.module.scss'

export default function NavBar() {
  const { totalCount } = useCart()

  return (
    <header className={styles.nav}>
      <Link to="/" className={`${styles.link} ${styles.brand}`}>
        Sembark Shop
      </Link>
      <nav className={styles.links}>
        <Link to="/" className={styles.link}>
          Home
        </Link>
        <Link to="/cart" className={styles.cartLink} data-cy="cart-link">
          Cart
          <span data-cy="cart-count" className={styles.badge}>
            {totalCount}
          </span>
        </Link>
      </nav>
    </header>
  )
}
