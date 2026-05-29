import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchProductById } from '../api'
import type { Product } from '../types'
import { useCart } from '../context/CartContext'

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
    <main style={{ padding: '24px 20px', maxWidth: 1080, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 34 }}>Product details</h1>
          <p style={{ margin: '10px 0 0', color: '#4b5563' }}>A full detail page powered by dynamic URL routing.</p>
        </div>
        <button
          type="button"
          style={{
            borderRadius: 999,
            border: '1px solid #d1d5db',
            background: '#fff',
            padding: '10px 18px',
            cursor: 'pointer',
          }}
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      {error ? (
        <p style={{ marginTop: 24, color: '#dc2626' }}>{error}</p>
      ) : loading ? (
        <p style={{ marginTop: 24 }}>Loading product details...</p>
      ) : product ? (
        <section style={{ display: 'grid', gap: 24, gridTemplateColumns: '1.15fr 0.85fr', marginTop: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <img
              src={product.images[0]}
              alt={product.title}
              style={{ width: '100%', borderRadius: 22, maxHeight: 540, objectFit: 'cover' }}
            />
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ padding: '8px 14px', background: '#eff6ff', borderRadius: 999, color: '#2563eb' }}>
                {product.category.name}
              </span>
              <span style={{ padding: '8px 14px', background: '#ecfccb', borderRadius: 999, color: '#166534' }}>
                {product.price.toFixed(2)} USD
              </span>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)' }}>
            <h2 style={{ margin: 0, fontSize: 28 }}>{product.title}</h2>
            <p style={{ color: '#4b5563', margin: '18px 0 0', whiteSpace: 'pre-wrap' }}>{product.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, gap: 12, flexWrap: 'wrap' }}>
              <div>
                <p style={{ margin: 0, color: '#6b7280' }}>Price</p>
                <strong style={{ fontSize: 32 }}>${product.price.toFixed(2)}</strong>
              </div>
              <button
                type="button"
                onClick={() => addToCart(product)}
                style={{
                  borderRadius: 16,
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  padding: '14px 22px',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
                data-cy="add-to-cart"
              >
                Add to Cart
              </button>
            </div>
            <Link
              to="/"
              style={{ display: 'inline-block', marginTop: 24, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}
            >
              ← Back to home
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  )
}
