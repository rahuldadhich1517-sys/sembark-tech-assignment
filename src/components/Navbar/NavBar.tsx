import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import styles from './NavBar.module.scss'

export default function NavBar() {
  const { totalCount } = useCart()

  return (
    <header className={styles.nav}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          <span>Sembark Store</span>
        </Link>

        <nav className={styles.links}>
          <Link to="/" className={styles.navLink}>
            Shop
          </Link>

          <Link
            to="/cart"
            className={styles.cartLink}
            data-cy="cart-link"
          >
            <span>Cart</span>

            {totalCount > 0 && (
              <span data-cy="cart-count" className={styles.badge}>
                {totalCount}
              </span>
            )}  
          </Link>
        </nav>
      </div>
    </header>
  )
}
