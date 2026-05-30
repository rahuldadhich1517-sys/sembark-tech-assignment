import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, Product } from '../types'

const STORAGE_KEY = 'sembark_store_cart_v1'

type CartState = {
  cartItems: CartItem[]
  totalCount: number
  totalAmount: number
  addToCart: (product: Product, quantity?: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  removeFromCart: (productId: number) => void
}

const CartContext = createContext<CartState | undefined>(undefined)

function parseStoredCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }

    const parsed = JSON.parse(stored) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter((item): item is CartItem => {
        return (
          typeof item === 'object' &&
          item !== null &&
          typeof (item as CartItem).quantity === 'number' &&
          typeof (item as CartItem).product?.id === 'number' &&
          typeof (item as CartItem).product?.title === 'string' &&
          typeof (item as CartItem).product?.price === 'number'
        )
      })
      .map((item) => ({
        product: item.product,
        quantity: Math.max(1, item.quantity),
      }))
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    setCartItems(parseStoredCart())
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) {
        return
      }
      setCartItems(parseStoredCart())
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const totalCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
    [cartItems],
  )

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      return [...current, { product, quantity }]
    })
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setCartItems((current) =>
      current
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((current) => current.filter((item) => item.product.id !== productId))
  }, [])

  const value = useMemo(
    () => ({ cartItems, totalCount, totalAmount, addToCart, updateQuantity, removeFromCart }),
    [cartItems, totalCount, totalAmount, addToCart, updateQuantity, removeFromCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider')
  }
  return context
}
