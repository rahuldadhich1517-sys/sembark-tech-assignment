import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchProductById } from '../../api'
import type { Product } from '../../types'
import { useCart } from '../../context/CartContext'
import styles from './ProductDetailPage.module.scss'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Product not found.')
      setLoading(false)
      return
    }
    setLoading(true)
    fetchProductById(id)
      .then(setProduct)
      .catch(() => setError('Unable to load product details.'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <main className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Product details</h1>
          <p className={styles.pageSubtitle}>A full detail page powered by dynamic URL routing.</p>
        </div>
        <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {error ? (
        <p className={styles.errorText}>{error}</p>
      ) : loading ? (
        <p className={styles.loadingText}>Loading product details...</p>
      ) : product ? (
        <section className={styles.productGrid}>
          <div className={styles.leftColumn}>
            <img src={product.images[0]} alt={product.title} className={styles.productImage} />
            <div className={styles.tagRow}>
              <span className={styles.tag}>{product.category.name}</span>
              <span className={styles.tag}>${product.price.toFixed(2)} USD</span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h2 className={styles.productTitle}>{product.title}</h2>
            <p className={styles.productDescription}>{product.description}</p>
            <div className={styles.priceRow}>
              <div className={styles.priceInfo}>
                <p className={styles.subText}>Price</p>
                <strong className={styles.price}>${product.price.toFixed(2)}</strong>
              </div>
              <button type="button" onClick={() => addToCart(product)} className={styles.addButton} data-cy="add-to-cart">
                Add to Cart
              </button>
            </div>
            <Link to="/" className={styles.backLink}>
               Back to home
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  )
}
