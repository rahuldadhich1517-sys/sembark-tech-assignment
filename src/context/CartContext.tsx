import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, Product } from '../types'

type CartState = {
  cartItems: CartItem[]
  totalCount: number
  totalAmount: number
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  decreaseQuantity: (productId: number) => void
}

const CartContext = createContext<CartState | undefined>(undefined)
const STORAGE_KEY = 'shop_cart_v1'

function loadStoredCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadStoredCart())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const totalCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
    [cartItems],
  )

  const addToCart = (product: Product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...current, { product, quantity: 1 }]
    })
  }

  const decreaseQuantity = (productId: number) => {
    setCartItems((current) =>
      current
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (productId: number) => {
    setCartItems((current) => current.filter((item) => item.product.id !== productId))
  }

  return (
    <CartContext.Provider value={{ cartItems, totalCount, totalAmount, addToCart, removeFromCart, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider')
  }
  return context
}
