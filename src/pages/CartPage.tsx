import { type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
}

const cellStyle: CSSProperties = {
  padding: '14px 12px',
  borderBottom: '1px solid #e5e7eb',
}

export default function CartPage() {
  const { cartItems, totalAmount, removeFromCart } = useCart()

  return (
    <main style={{ padding: '24px 20px', maxWidth: 1080, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 34 }}>Your Cart</h1>
          <p style={{ margin: '10px 0 0', color: '#4b5563' }}>Remove items or review the total before checkout.</p>
        </div>
        <Link
          to="/"
          style={{
            borderRadius: 999,
            border: '1px solid #d1d5db',
            background: '#fff',
            padding: '10px 18px',
            textDecoration: 'none',
            color: '#111827',
          }}
        >
          Continue shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <section style={{ marginTop: 32, padding: 28, borderRadius: 24, background: '#fff', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
          <h2 style={{ margin: 0, fontSize: 24 }}>Your cart is empty</h2>
          <p style={{ margin: '12px 0 0', color: '#6b7280' }}>Add a product to the cart from the detail page to see it here.</p>
        </section>
      ) : (
        <section style={{ marginTop: 32, display: 'grid', gap: 24 }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Product</th>
                <th style={cellStyle}>Price</th>
                <th style={cellStyle}>Quantity</th>
                <th style={cellStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product.id} data-cy="cart-item">
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={item.product.images[0]} alt={item.product.title} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 16 }} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 600 }}>{item.product.title}</p>
                        <span style={{ color: '#6b7280', fontSize: 14 }}>{item.product.category.name}</span>
                      </div>
                    </div>
                  </td>
                  <td style={cellStyle}>${item.product.price.toFixed(2)}</td>
                  <td style={cellStyle}>{item.quantity}</td>
                  <td style={cellStyle}>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      style={{ borderRadius: 12, border: '1px solid #d1d5db', padding: '10px 14px', background: '#f8fafc', cursor: 'pointer' }}
                      data-cy="remove-cart-item"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', gap: 16, padding: 24, borderRadius: 24, background: '#fff', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}>
            <p style={{ margin: 0, color: '#6b7280' }}>Total cart value</p>
            <strong style={{ fontSize: 28 }}>${totalAmount.toFixed(2)}</strong>
          </div>
        </section>
      )}
    </main>
  )
}
