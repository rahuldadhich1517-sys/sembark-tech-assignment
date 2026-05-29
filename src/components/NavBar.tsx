import { type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const navStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 20px',
  gap: 16,
  flexWrap: 'wrap',
  background: '#1f2937',
  color: '#fff',
}

const linkStyle: CSSProperties = {
  color: 'inherit',
  textDecoration: 'none',
  fontWeight: 600,
}

const badgeStyle: CSSProperties = {
  minWidth: 30,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 999,
  background: '#f59e0b',
  color: '#111827',
  padding: '4px 10px',
  fontWeight: 700,
}

export default function NavBar() {
  const { totalCount } = useCart()

  return (
    <header style={navStyle}>
      <Link to="/" style={{ ...linkStyle, fontSize: 20 }}>
        Sembark Shop
      </Link>
      <nav style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <Link to="/" style={linkStyle}>{'Home'}</Link>
        <Link to="/cart" style={linkStyle} data-cy="cart-link">
          Cart
          <span data-cy="cart-count" style={badgeStyle}>{totalCount}</span>
        </Link>
      </nav>
    </header>
  )
}
