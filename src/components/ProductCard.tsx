import { Link } from 'react-router-dom'
import type { Product } from '../types'
import styles from './ProductCard.module.scss'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} data-cy="product-card" className={styles.card}>
      <img src={product.images[0]} alt={product.title} className={styles.image} />
      <div className={styles.cardBody}>
        <div>
          <h3 className={styles.cardTitle}>{product.title}</h3>
          <p className={styles.cardCategory}>{product.category.name}</p>
        </div>
        <div className={styles.cardFooter}>
          <strong className={styles.price}>${product.price.toFixed(2)}</strong>
          <span className={styles.viewLabel}>View</span>
        </div>
      </div>
    </Link>
  )
}
