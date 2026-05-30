import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchProductById } from '../../api'
import type { Product } from '../../types'
import { useCart } from '../../context/CartContext'
import { useCachedApi } from '../../hooks/useCachedApi'
import { usePageMetadata } from '../../hooks/usePageMetadata'
import styles from './ProductDetailPage.module.scss'

const TOAST_DURATION = 1600

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const fetchProduct = useCallback(() => fetchProductById(id ?? ''), [id])

  const { data: product, error, isLoading } = useCachedApi<Product>(`product-${id}`, fetchProduct, {
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  })

  usePageMetadata({
    title: product ? product.title : 'Product details',
    description: product?.description ?? 'Explore product details with premium ecommerce interactions.',
  })

  const handleAddToCart = (): void => {
    if (!product) return

    addToCart(product, 1)
    setSuccessMessage('Added to cart!')
    window.setTimeout(() => setSuccessMessage(null), TOAST_DURATION)
  }

  return (
    <main className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Product details</h1>
          <p className={styles.pageSubtitle}>Explore product specifications, pricing, and add to cart.</p>
        </div>
        <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p role="alert" className={styles.errorText}>Unable to load product details.</p>
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
              <button
                type="button"
                onClick={handleAddToCart}
                className={styles.addButton}
                data-cy="add-to-cart"
              >
                Add to Cart
              </button>
            </div>

            {successMessage && <p className={styles.successText}>{successMessage}</p>}

            <Link to="/" className={styles.backLink}>
              Back to home
            </Link>
          </div>
        </section>
      ) : (
        <p className={styles.errorText}>Product not found.</p>
      )}
    </main>
  )
}
