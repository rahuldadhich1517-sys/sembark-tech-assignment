import { Link } from 'react-router-dom'
import type { Product } from '../types'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      data-cy="product-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRadius: 16,
        textDecoration: 'none',
        color: '#111827',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
      }}
    >
      <img
        src={product.images[0]}
        alt={product.title}
        style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }}
      />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18 }}>{product.title}</h3>
          <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: 14 }}>{product.category.name}</p>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontSize: 18 }}>${product.price.toFixed(2)}</strong>
          <span style={{ fontSize: 14, color: '#10b981' }}>View</span>
        </div>
      </div>
    </Link>
  )
}
