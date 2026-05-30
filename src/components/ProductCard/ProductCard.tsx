import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import styles from './ProductCard.module.scss'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} data-cy="product-card" className={styles.card}>
      <img src={product.images[0]} alt={product.title} className={styles.image} />
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <p className={styles.cardCategory}>{product.category.name}</p>
          <h3 className={styles.cardTitle}>{product.title}</h3>
        </div>
        <div className={styles.cardFooter}>
          <strong className={styles.price}>${product.price.toFixed(2)}</strong>
          <span className={styles.viewLabel}>View</span>
        </div>
      </div>
    </Link>
  )
}
